import React, { useEffect, useState, useCallback, memo } from "react";
import Footer from "../components/bais/Footer";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Memoize the submission status message component
const SubmissionStatusMessage = memo(({ status, message }) => {
  if (!status) return null;

  let bgColor;
  if (status === "success") {
    bgColor = "bg-green-600/80 text-white";
  } else if (status === "error") {
    bgColor = "bg-red-600/80 text-white";
  } else {
    bgColor = "bg-blue-600/80 text-white";
  }

  return (
    <motion.div
      className={`p-3 rounded-md text-center text-lg font-medium ${bgColor}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {message}
    </motion.div>
  );
});

// Memoize the main Contact component
const Contact = memo(() => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState("");

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setSubmissionStatus("submitting");
      setSubmissionMessage("Sending your message...");

      try {
        const response = await fetch(`${BACKEND_URL}/api/posts/contact`, {
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
          setFormData({
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
        setTimeout(() => {
          setSubmissionStatus(null);
          setSubmissionMessage("");
        }, 5000);
      }
    },
    [formData]
  );

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
              src="/cont.webm"
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
                href="mailto:aryannaruka7@gmail.com"
                className="text-blue-300 underline hover:text-blue-200 transition-colors duration-300"
              >
                aryannaruka7@gmail.com
              </a>{" "}
              or use the form below.
            </motion.p>

            <AnimatePresence>
              <SubmissionStatusMessage
                status={submissionStatus}
                message={submissionMessage}
              />
            </AnimatePresence>

            <motion.form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              onSubmit={handleSubmit}
            >
              <motion.input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200 col-span-1"
                variants={itemVariants}
                required
              />
              <motion.input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200 col-span-1"
                variants={itemVariants}
                required
              />
              <motion.input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200 col-span-2"
                variants={itemVariants}
                required
              />
              <motion.input
                type="tel"
                name="phone"
                placeholder="+91 (000) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200 col-span-2"
                variants={itemVariants}
              />

              <motion.textarea
                rows="4"
                name="message"
                placeholder="Share your depths with us..."
                value={formData.message}
                onChange={handleChange}
                className="col-span-2 p-3 rounded-md bg-white/15 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200"
                variants={itemVariants}
                required
              ></motion.textarea>

              <motion.button
                type="submit"
                className="col-span-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                variants={itemVariants}
                disabled={submissionStatus === "submitting"}
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
});

export default Contact;