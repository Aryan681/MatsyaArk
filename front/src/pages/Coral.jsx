import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudUpload,
  MapPin,
  Leaf,
  FlaskConical,
  Loader2,
  Info,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"; // Added Chevron icons
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import Footer from "../components/bais/Footer"
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// --- Configuration ---
const BACKEND_URL = "http://127.0.0.1:5000";

// --- API Function ---
async function getPrediction(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.error || "Prediction API call failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching prediction from backend:", error);
    throw new Error(`Prediction failed: ${error.message}`);
  }
}

export default function App() {
  // State variables
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geminiExplanation, setGeminiExplanation] = useState(null);

  // NEW STATE for collapsible sections (optional, but good for long content)
  const [showFactors, setShowFactors] = useState(true); // Start open
  const [showBenefits, setShowBenefits] = useState(true); // Start open

  // Refs for GSAP animations and DOM elements
  const fileInputRef = useRef(null);
  const appRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const uploadZoneRef = useRef(null);
  const infoCardsRef = useRef([]);
  const footerRef = useRef(null);
  const resultSectionRef = useRef(null);

  // GSAP Animations Setup (Unchanged)
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(appRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });
      gsap.from(titleRef.current, {
        y: -50,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        delay: 0.3,
      });
      gsap.set(subtitleRef.current, { text: "" });
      gsap.to(subtitleRef.current, {
        duration: 2.5,
        text: "Upload a coral image and our AI will provide a health assessment, helping you understand the state of these vital ecosystems.",
        ease: "none",
        delay: 1,
      });
      gsap.from(uploadZoneRef.current, {
        scale: 0.5,
        opacity: 0,
        rotation: 5,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 1.5,
      });
      gsap.to(uploadZoneRef.current.querySelector(".cloud-icon"), {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      infoCardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          x: index % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
        const icon = card.querySelector("svg");
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            boxShadow: "0 20px 40px rgba(0, 255, 255, 0.3)",
            duration: 0.3,
          });
          gsap.to(icon, { scale: 1.2, duration: 0.3 });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            boxShadow: "0 0px 0px rgba(0, 255, 255, 0)",
            duration: 0.3,
          });
          gsap.to(icon, { scale: 1, duration: 0.3 });
        });
      });

      gsap.from(footerRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    }, appRef);

    return () => ctx.revert();
  }, []);

  // Effect for parsing Gemini explanation
  useEffect(() => {
    if (result && result.gemini_explanation) {
      try {
        const cleanedJson = result.gemini_explanation
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsedData = JSON.parse(cleanedJson);
        setGeminiExplanation(parsedData);
      } catch (error) {
        console.error("Error parsing gemini_explanation:", error);
        setGeminiExplanation(null);
        setError(
          "Failed to parse detailed coral information. Please try again."
        );
      }
    }
  }, [result]);

  // File Handling Functions
  const processFile = async (file) => {
    if (file && file.type.startsWith("image/")) {
      if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
      const newImageUrl = URL.createObjectURL(file);
      setUploadedFile(file);
      setUploadedImageUrl(newImageUrl);
      setError(null);
      setResult(null);
      setGeminiExplanation(null);
      setLoading(true);
      // Reset collapsible sections when processing new file
      setShowFactors(true);
      setShowBenefits(true);

      try {
        const predictionData = await getPrediction(file);
        setResult({ ...predictionData, imageToDisplay: newImageUrl });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    processFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => e.preventDefault();
  const resetApp = () => {
    setUploadedFile(null);
    setResult(null);
    setLoading(false);
    setError(null);
    setGeminiExplanation(null);
    // Reset collapsible sections on app reset
    setShowFactors(true);
    setShowBenefits(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      ref={appRef}
      className="font-sans bg-gradient-to-br from-blue-950 to-teal-950 text-white min-h-screen flex flex-col items-center p-2 overflow-x-hidden md:max-w-screen"
    >
      {/* Header */}
      <header className="text-center py-10 w-full max-w-4xl relative z-10">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl font-extrabold text-cyan-300 drop-shadow-2xl leading-tight"
        >
          Coral Health AI Explorer
        </h1>
        <p
          ref={subtitleRef}
          className="mt-4 text-cyan-100 max-w-3xl mx-auto text-lg sm:text-xl min-h-[72px]"
        >
          {/* GSAP will populate this */}
        </p>
      </header>

      {/* Drag & Drop Upload */}
      <section
        ref={uploadZoneRef}
        className="relative border-4 border-dashed border-cyan-500 p-8 sm:p-12 mx-auto w-full md:w-2/3 lg:w-1/2 text-center rounded-2xl bg-cyan-800/20 cursor-pointer flex flex-col items-center justify-center min-h-[250px]  z-10"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <CloudUpload className="cloud-icon text-6xl mx-auto text-cyan-300 mb-4" />
        <p className="text-xl sm:text-2xl text-cyan-100 font-semibold">
          {uploadedFile ? uploadedFile.name : "Drag & drop a coral image here"}
        </p>
        <p className="text-md sm:text-lg text-cyan-200 mt-2">
          or click to select a file
        </p>
        {uploadedFile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetApp();
            }}
            className="absolute top-4 right-4 text-red-400 hover:text-red-500 transition-colors"
          >
            <XCircle size={24} />
          </button>
        )}
      </section>

      {/* Loading, Error & Result Display */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            className="mt-10 max-w-md  flex flex-row items-center justify-center  z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <video
              src="/Loding.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-42 h-42 object-cover"
            />

            <p className="mt-4 text-xl text-cyan-200">
              Analyzing coral health...
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            className="mt-10 max-w-md mx-auto p-6 rounded-lg bg-red-800/50 text-red-200 flex items-center justify-center shadow-xl z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <XCircle className="text-3xl mr-3" />
            <p className="text-lg">{error}</p>
          </motion.div>
        )}

        {result && !loading && (
          <section
            ref={resultSectionRef}
            key="result"
            className="mt-10 w-full max-w-5xl mx-auto bg-gradient-to-br from-gray-900/80 to-blue-900/70 p-6 rounded-2xl shadow-2xl z-10 border  border-cyan-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr] gap-4" >
              {/* IMAGE */}
              <div className="row-span-1 md:row-span-2 w-full max-w-[300px] bg-gray-800/50 rounded-lg  border border-cyan-600 flex items-center justify-center overflow-hidden">
                <img
                  src={result.imageToDisplay}
                  alt="Uploaded Coral"
                  className="rounded-md w-full h-full object-cover"
                />
              </div>

              {/* DESCRIPTION TOP */}
              <div className="w-full h-[14rem] bg-gray-800/50 border border-cyan-600 rounded-lg p-4  overflow-y-auto custom-scrollbar">
                <h3 className="text-3xl sm:text-4xl text-cyan-200 font-bold mb-1">
                  Type:{" "}
                  <span className="text-teal-300">
                    {geminiExplanation?.type || "N/A"}
                  </span>s
                </h3>
                <p className="text-2xl sm:text-3xl font-bold">
                  Health:{" "}
                  <span
                    className={
                      result.prediction === "Healthy"
                        ? "text-green-400"
                        : "text-orange-400"
                    }
                  >
                    {result.prediction}
                  </span>
                </p>
                {result.confidence !== undefined && (
                  <div className="my-2">
                    <p className="text-cyan-300 text-sm mb-1">Confidence</p>
                    <div
                      className={`w-full h-2 rounded-full ${
                        result.prediction === "Healthy"
                          ? "bg-green-900/50"
                          : "bg-orange-900/50"
                      }`}
                    >
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                <p className="mt-2 text-cyan-100 text-base">
                  {result.prediction === "Healthy"
                    ? "This coral appears to be in good health! Keep protecting our oceans."
                    : "This coral shows signs of stress. Climate action can help restore coral health."}
                </p>
              </div>

              {/* DESCRIPTION BELOW */}
              <div className="col-span-1 md:col-span-2 bg-gray-800/50 border border-cyan-600 rounded-lg p-4 max-h-[350px] overflow-y-auto custom-scrollbar">
                {geminiExplanation && (
                  <>
                    <h4 className="text-2xl font-bold text-cyan-200 mb-4">
                      Detailed Insights:
                    </h4>

                    {/* Geography */}
                    <div className="mb-6">
                      <h5 className="text-xl font-semibold text-rose-400 mb-2">
                        Geography
                      </h5>
                      <p className="text-cyan-100">
                        {geminiExplanation.geography}
                      </p>
                    </div>

                    {/* Factors */}
                    {/* Factors */}
                    <div className="mb-6">
                      <h5 className="text-xl font-semibold text-red-700 mb-2">
                        Factors Affecting Health
                      </h5>
                      <ul className="list-disc ml-5 space-y-1 text-cyan-100">
                        {geminiExplanation.factors?.map((factor, index) => (
                          <li key={index}>
                            <strong className="text-red-400">
                              {factor.name}:
                            </strong>{" "}
                            {factor.description}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                      <h5 className="text-xl font-semibold text-cyan-300 mb-2">
                        Ecological & Human Benefits
                      </h5>
                      <ul className="list-disc ml-5 space-y-1 text-cyan-100">
                        {geminiExplanation.benefits?.map((benefit, index) => (
                          <li key={index}>
                            <strong className="text-green-500">
                              {benefit.type || benefit.aspect}:
                            </strong>{" "}
                            {benefit.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Button */}
            <motion.button
              onClick={resetApp}
              className="w-full mt-6 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-full shadow-lg hover:bg-cyan-500 transition-all"
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 5px 15px rgba(0, 255, 255, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Analyze Another Image
            </motion.button>
          </section>
        )}
      </AnimatePresence>

      {/* Info Sections (Unchanged) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-8 mt-14 w-full max-w-7xl z-10 mb-5">
        <div
          ref={(el) => (infoCardsRef.current[0] = el)}
          className="info-card bg-cyan-900/50 p-6 rounded-2xl shadow-xl border border-cyan-700"
        >
          <MapPin className="text-4xl text-cyan-300 mb-3" />
          <h4 className="text-2xl font-semibold mb-2">Coral Geography</h4>
          <p className="text-cyan-100">
            Coral reefs thrive in warm, shallow, clear waters, primarily in
            tropical regions.
          </p>
        </div>

        <div
          ref={(el) => (infoCardsRef.current[1] = el)}
          className="info-card bg-cyan-900/50 p-6 rounded-2xl shadow-xl border border-cyan-700"
        >
          <Leaf className="text-4xl text-cyan-300 mb-3" />
          <h4 className="text-2xl font-semibold mb-2">Ecosystem Benefits</h4>
          <p className="text-cyan-100">
            Reefs are biodiversity hotspots, supporting over 25% of all marine
            species.
          </p>
        </div>

        <div
          ref={(el) => (infoCardsRef.current[2] = el)}
          className="info-card bg-cyan-900/50 p-6 rounded-2xl shadow-xl border border-cyan-700"
        >
          <FlaskConical className="text-4xl text-cyan-300 mb-3" />
          <h4 className="text-2xl font-semibold mb-2">Threat Factors</h4>
          <p className="text-cyan-100">
            Major threats include climate change, pollution, and overfishing.
          </p>
        </div>
      </section>

      {/* Footer (Unchanged) */}
     
      <Footer />
    </div>
  );
}
