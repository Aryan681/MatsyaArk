import React, { useEffect, useState } from "react"; // Import useState
import Footer from "../components/bais/Footer";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Contact() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  // State for form submission feedback
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', 'submitting'
  const [submissionMessage, setSubmissionMessage] = useState("");

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setSubmissionStatus("submitting");
    setSubmissionMessage("Sending your message...");

    try {
      const response = await fetch("http://localhost:3000/api/posts/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmissionStatus("success");
        setSubmissionMessage("Message sent successfully!");
        setFormData({ // Clear form after successful submission
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      setSubmissionMessage("Network error. Could not connect to the server.");
    } finally {
      // Clear status message after a few seconds
      setTimeout(() => {
        setSubmissionStatus(null);
        setSubmissionMessage("");
      }, 5000);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-[#02182B] via-[#043353] to-[#010D18] text-white overflow-hidden">
      {/* Ocean background elements */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/30 rounded-full animate-bubble"
              style={{
                width: `${Math.random() * 5 + 5}px`,
                height: `${Math.random() * 5 + 5}px`,
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 15 + 10}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-500/10 opacity-60 animate-pulse-light"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/20 via-transparent to-cyan-400/10 opacity-60 animate-pulse-light delay-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-10 px-4 sm:px-6 mb-7">
        <motion.div
          ref={ref}
          className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-start bg-white/5 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-cyan-400/30"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {/* Left: Video */}
          <motion.div
            className="w-full h-64 sm:h-80 md:h-[400px] lg:h-[450px] rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg"
            variants={itemVariants}
          >
            <video
              src="/cont.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right: Form */}
          <motion.div className="w-full space-y-6" variants={itemVariants}>
            <motion.h2
              className="text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow-lg"
              variants={itemVariants}
            >
              Dive In and Connect!
            </motion.h2>
            <motion.p
              className="text-cyan-100 text-base sm:text-lg"
              variants={itemVariants}
            >
              Ready to explore? Reach out manually to{" "}
              <a
                href="mailto:hello@matsyaark.com"
                className="text-blue-300 underline hover:text-blue-200 transition-colors duration-300"
              >
                aryannaruka7@gmail.com
              </a>{" "}
              or use the form below.
            </motion.p>

            {/* Submission Status Message */}
            {submissionStatus && (
              <motion.div
                className={`p-3 rounded-md text-center text-lg font-medium ${
                  submissionStatus === "success"
                    ? "bg-green-600/80 text-white"
                    : submissionStatus === "error"
                    ? "bg-red-600/80 text-white"
                    : "bg-blue-600/80 text-white"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {submissionMessage}
              </motion.div>
            )}

            <motion.form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              onSubmit={handleSubmit} // Add onSubmit handler
            >
              <motion.input
                type="text"
                name="firstName" // Add name attribute
                placeholder="First Name"
                value={formData.firstName} // Bind value
                onChange={handleChange} // Add onChange handler
                className="p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200 col-span-1"
                variants={itemVariants}
                required // Make required
              />
              <motion.input
                type="text"
                name="lastName" // Add name attribute
                placeholder="Last Name"
                value={formData.lastName} // Bind value
                onChange={handleChange} // Add onChange handler
                className="p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200 col-span-1"
                variants={itemVariants}
                required // Make required
              />
              <motion.input
                type="email"
                name="email" // Add name attribute
                placeholder="Email Address"
                value={formData.email} // Bind value
                onChange={handleChange} // Add onChange handler
                className="p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200 col-span-2"
                variants={itemVariants}
                required // Make required
              />
              <motion.input
                type="tel"
                name="phone" // Add name attribute
                placeholder="+91 (000) 000-0000"
                value={formData.phone} // Bind value
                onChange={handleChange} // Add onChange handler
                className="p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200 col-span-2"
                variants={itemVariants}
              />

              <motion.textarea
                rows="4"
                name="message" // Add name attribute
                placeholder="Share your depths with us..."
                value={formData.message} // Bind value
                onChange={handleChange} // Add onChange handler
                className="col-span-2 p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200"
                variants={itemVariants}
                required // Make required
              ></motion.textarea>

              <motion.button
                type="submit"
                className="col-span-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                variants={itemVariants}
                disabled={submissionStatus === "submitting"} // Disable button during submission
              >
                {submissionStatus === "submitting" ? "Sending..." : "Send Your Message →"}
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Animations */}
      <style jsx>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateY(-50vh) translateX(calc(var(--rand-x) * 10px)) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(calc(var(--rand-x) * 20px)) scale(0);
            opacity: 0;
          }
        }

        @keyframes pulse-light {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
        }

        .animate-bubble {
          animation: bubble var(--animation-duration) ease-out infinite;
          --rand-x: calc(var(--rand-seed) * 2 - 1);
        }
        .animate-pulse-light {
          animation: pulse-light 10s infinite alternate;
        }
      `}</style>
    </div>
  );
}