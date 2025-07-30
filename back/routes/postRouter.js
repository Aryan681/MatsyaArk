const express = require('express');
const { body, validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

// Define validation and sanitization rules as middleware
const contactValidationRules = [
  // Trim whitespace and ensure firstName is not empty.
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  
  // lastName is optional, so we just trim it.
  body('lastName').trim(),

  // Validate that email is a valid email format.
  body('email').isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),

  // phone is optional, but if it exists, it should be a plausible phone number.
  // This is a simple check; more complex regex can be used for specific formats.
  body('phone').optional().trim().matches(/^[0-9\s-()+]{7,15}$/).withMessage('Invalid phone number format.'),

  // Ensure the message content is not empty.
  body('message').trim().notEmpty().withMessage('Message cannot be empty.'),
];

router.post(
  "/contact",
  contactValidationRules, // Apply validation rules
  async (req, res) => {
    // 1. Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors, return a 400 Bad Request status with the error details.
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // 2. Create and save the new message
      // Directly use req.body, as Mongoose will only pick fields defined in the schema.
      const newMessage = new ContactMessage(req.body);
      await newMessage.save();

      res.status(201).json({ message: "Message received successfully! Thank you." });

    } catch (error) {
      // 3. Handle different types of errors
      console.error('Error saving contact message:', error);

      // Check if it's a Mongoose validation error (e.g., unique constraint failed)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }

      // Fallback for any other server-side errors
      res.status(500).json({ error: "An unexpected error occurred on the server." });
    }
  }
);

// Use module.exports for consistency with CommonJS module system
module.exports = router;