import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, MapPin, Leaf, FlaskConical, Loader2, Info, XCircle } from 'lucide-react';

// --- Configuration ---
// Ensure your Flask backend is running and accessible at this URL.
const BACKEND_URL = 'http://127.0.0.1:5000';

// Canvas-specific variables (can be ignored for local development)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

/**
 * Gets a prediction from the Flask backend.
 * @param {File} file The image file to be analyzed.
 * @returns {Promise<Object>} A promise that resolves to the prediction data.
 */
async function getPrediction(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.error || 'Prediction API call failed');
    }
    // Directly return the prediction data from the backend
    return await response.json(); // Expected: { prediction: 'Healthy'/'Bleached', class_index: 0/1 }
  } catch (error) {
    console.error('Error fetching prediction from backend:', error);
    // Re-throw the error to be handled by the calling function
    throw new Error(`Prediction failed: ${error.message}`);
  }
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
const cardVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 255, 255, 0.3)" },
};

// --- Main App Component ---
export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Effect for cleaning up the created object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (uploadedImageUrl) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
    };
  }, [uploadedImageUrl]);

  // Centralized function to handle file processing
  const processFile = async (file) => {
    if (file && file.type.startsWith('image/')) {
      // Revoke the previous URL if it exists
      if (uploadedImageUrl) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
      
      const newImageUrl = URL.createObjectURL(file);
      setUploadedFile(file);
      setUploadedImageUrl(newImageUrl); // Store the new URL
      
      setError(null);
      setResult(null);
      setLoading(true);

      try {
        const predictionData = await getPrediction(file);
        
        // Set result with prediction and the URL of the uploaded image
        setResult({
          ...predictionData,
          imageToDisplay: newImageUrl,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-cyan-300', 'scale-105');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = (e) => e.currentTarget.classList.add('border-cyan-300', 'scale-105');
  const handleDragLeave = (e) => e.currentTarget.classList.remove('border-cyan-300', 'scale-105');

  const resetApp = () => {
    setUploadedFile(null);
    setResult(null);
    setLoading(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-blue-950 to-teal-950 text-white min-h-screen flex flex-col items-center p-4 sm:p-8 overflow-x-hidden">
      {/* Header */}
      <motion.header className="text-center py-10 w-full max-w-4xl" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.h1 className="text-4xl sm:text-6xl font-extrabold text-cyan-300 drop-shadow-2xl leading-tight" variants={itemVariants}>
          Coral Health AI Explorer
        </motion.h1>
        <motion.p className="mt-4 text-cyan-100 max-w-3xl mx-auto text-lg sm:text-xl" variants={itemVariants}>
          Upload a coral image and our AI will provide a health assessment, helping you understand the state of these vital ecosystems.
        </motion.p>
      </motion.header>

      {/* Drag & Drop Upload */}
      <motion.section
        className="relative border-4 border-dashed border-cyan-500 p-8 sm:p-12 mx-auto w-full md:w-2/3 lg:w-1/2 text-center rounded-2xl bg-cyan-800/20 hover:bg-cyan-800/40 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center min-h-[250px]"
        onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.5 }}
        whileHover={{ scale: 1.02, borderColor: '#67e8f9' }}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <CloudUpload className="text-6xl mx-auto text-cyan-300 mb-4" />
        </motion.div>
        <p className="text-xl sm:text-2xl text-cyan-100 font-semibold">
          {uploadedFile ? uploadedFile.name : "Drag & drop a coral image here"}
        </p>
        <p className="text-md sm:text-lg text-cyan-200 mt-2">or click to select a file</p>
        {uploadedFile && (
          <motion.button onClick={(e) => { e.stopPropagation(); resetApp(); }}
            className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          >
            <XCircle size={24} />
          </motion.button>
        )}
      </motion.section>

      {/* Loading, Error & Result Display */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="loading" className="mt-10 max-w-md mx-auto p-6 rounded-lg bg-white/10 flex flex-col items-center justify-center shadow-xl"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Loader2 className="text-5xl text-cyan-400" />
            </motion.div>
            <p className="mt-4 text-xl text-cyan-200">Analyzing coral health...</p>
          </motion.div>
        )}
        {error && (
          <motion.div key="error" className="mt-10 max-w-md mx-auto p-6 rounded-lg bg-red-800/50 text-red-200 flex items-center justify-center shadow-xl"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
            <XCircle className="text-3xl mr-3" />
            <p className="text-lg">{error}</p>
          </motion.div>
        )}
        {result && !loading && (
          <motion.section key="result" className="mt-10 max-w-4xl mx-auto bg-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-6"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
            <motion.img src={result.imageToDisplay} alt="Uploaded Coral"
              className="rounded-xl shadow-lg w-full md:w-1/2 max-h-80 object-cover"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} />
            <motion.div className="text-center md:text-left w-full md:w-1/2"
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <h3 className="text-3xl sm:text-4xl text-cyan-200 font-bold mb-2">
                Prediction: <span className="text-white">{result.prediction}</span>
              </h3>
              <p className="text-cyan-300 text-lg">Model Class Index: {result.class_index}</p>
              <p className="mt-4 text-cyan-100 text-base">
                This is your uploaded image with the AI's health assessment based on our model.
              </p>
              <motion.button onClick={resetApp}
                className="mt-6 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-full shadow-lg hover:bg-cyan-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 255, 255, 0.4)" }} whileTap={{ scale: 0.95 }}>
                Analyze Another Image
              </motion.button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Info Sections */}
      <motion.section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-8 mt-14 w-full max-w-7xl"
        initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div className="bg-cyan-900/50 p-6 rounded-2xl shadow-xl border border-cyan-700"
              variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
                <MapPin className="text-4xl text-cyan-300 mb-3" />
                <h4 className="text-2xl font-semibold mb-2">Coral Geography</h4>
                <p className="text-cyan-100">Coral reefs thrive in warm, shallow, clear waters, primarily in tropical regions. The Indo-Pacific, Caribbean, and Red Sea are major hotspots.</p>
            </motion.div>
            <motion.div className="bg-cyan-900/50 p-6 rounded-2xl shadow-xl border border-cyan-700"
              variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
                <Leaf className="text-4xl text-cyan-300 mb-3" />
                <h4 className="text-2xl font-semibold mb-2">Ecosystem Benefits</h4>
                <p className="text-cyan-100">Reefs are biodiversity hotspots, supporting over 25% of all marine species. They protect coastlines, provide livelihoods, and are vital for tourism.</p>
            </motion.div>
            <motion.div className="bg-cyan-900/50 p-6 rounded-2xl shadow-xl border border-cyan-700"
              variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
                <FlaskConical className="text-4xl text-cyan-300 mb-3" />
                <h4 className="text-2xl font-semibold mb-2">Threat Factors</h4>
                <p className="text-cyan-100">Major threats include climate change (ocean warming), pollution, and overfishing, which lead to coral bleaching and habitat degradation.</p>
            </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer className="mt-20 px-6 text-center max-w-4xl mx-auto pb-10"
        initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h2 className="text-3xl sm:text-4xl text-cyan-200 font-bold mb-4" variants={itemVariants}>
                Join the Movement for Coral Conservation
            </motion.h2>
            <motion.p className="text-cyan-100 text-lg sm:text-xl" variants={itemVariants}>
                Protecting coral reefs is a global imperative. Every action, big or small, contributes to their survival.
            </motion.p>
            <motion.button className="mt-8 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-full shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 255, 255, 0.5)" }} whileTap={{ scale: 0.95 }} variants={itemVariants}>
                <Info className="inline-block mr-2" size={20} /> Learn How You Can Help
            </motion.button>
      </motion.footer>
    </div>
  );
}