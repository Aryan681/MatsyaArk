const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { getGeminiResponse } = require('../util/gemini');

// Multer setup
const upload = multer({ dest: 'uploads/' });

router.post('/gemini', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    const result = await getGeminiResponse(base64Image);

    fs.unlinkSync(imagePath); // clean up

    res.json({ result });
  } catch (err) {
    console.error('Gemini API Error:', err.message);
    res.status(500).json({ error: 'Gemini API failed' });
  }
});

module.exports = router;
