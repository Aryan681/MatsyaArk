// src/pages/Fish.jsx
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiDatabase, FiEye, FiBarChart2, FiClock } from "react-icons/fi"; // Added FiClock
import Footer from "../components/bais/Footer"
gsap.registerPlugin(ScrollTrigger);

// Helper Component: Animated Counter
const AnimatedCounter = ({ value }) => {
  const countRef = useRef(null);
  useEffect(() => {
    gsap.to(countRef.current, {
      duration: 1,
      innerText: value,
      roundProps: "innerText",
      ease: "power2.inOut",
    });
  }, [value]);
  return <span ref={countRef}>{value > 0 ? value - 1 : 0}</span>;
};

// Main Component
export default function Fish() {
  const [detections, setDetections] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  // ✅ NEW: State to store the history of unique detections
  const [detectionHistory, setDetectionHistory] = useState([]);

  const mainRef = useRef(null);

  // Fetching logic
  useEffect(() => {
    let errorTimeout;
    const fetchDetections = () => {
      fetch("http://localhost:8000/detections")
        .then((res) => res.json())
        .then((data) => {
          setDetections(data.detections || []);
          setIsConnected(true);
          clearTimeout(errorTimeout);
        })
        .catch(() => {
          errorTimeout = setTimeout(() => setIsConnected(false), 3000);
        });
    };
    fetchDetections();
    const interval = setInterval(fetchDetections, 1500);
    return () => {
      clearInterval(interval);
      clearTimeout(errorTimeout);
    };
  }, []);

  // ✅ NEW: Effect to update the history when new detections arrive
  useEffect(() => {
    if (detections.length === 0) return;

    setDetectionHistory((prevHistory) => {
      const newHistoryMap = new Map(
        prevHistory.map((item) => [item.class_name, item])
      );
      detections.forEach((det) => {
        if (!newHistoryMap.has(det.class_name)) {
          newHistoryMap.set(det.class_name, {
            ...det,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }
      });
      // Convert map back to array, sort by time, and keep the latest 50
      return Array.from(newHistoryMap.values()).slice(-50);
    });
  }, [detections]);

  // GSAP Main Animation
  useEffect(() => {
    if (!mainRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-animate]", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-animate]",
          start: "top 95%",
          toggleActions: "play none none none",
        },
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const totalDetections = detections.length;
  const latestDetection = detections[0]?.class_name || "N/A";

  return (
   <> <div
      ref={mainRef}
      className="min-h-screen bg-[#01161E] text-white p-4 sm:p-2"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1
            data-animate
            className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-2"
          >
            Live Fish Detection
          </h1>
          <p data-animate className="text-lg text-cyan-100/70">
            Real-time monitoring via AI-powered video stream.
          </p>
        </header>

        <div
          data-animate
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          {/* Widgets... */}
          <StatusWidget icon={<FiDatabase />} title="Connection Status">
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  isConnected ? "bg-green-400 animate-pulse" : "bg-red-500"
                }`}
              ></span>
              <span className={isConnected ? "text-green-300" : "text-red-300"}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </StatusWidget>
          <StatusWidget icon={<FiBarChart2 />} title="Live Detections">
            <AnimatedCounter value={totalDetections} />
          </StatusWidget>
          <StatusWidget icon={<FiEye />} title="Latest Detection">
            <span className="truncate">{latestDetection}</span>
          </StatusWidget>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Live Stream */}
          <div
            data-animate
            className="lg:col-span-3 w-full bg-black/30 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-cyan-400/20"
          >
            <div className="flex justify-between items-center p-4 bg-black/20">
              <h2 className="text-xl font-bold text-cyan-200">Live Stream</h2>
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>{" "}
                LIVE
              </div>
            </div>
            <div className="aspect-w-16 aspect-h-9 bg-black">
              <img
                src="http://localhost:8000/video_feed"
                alt="Live Detection"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          {/* Detection Log */}
          <div
            data-animate
            className="lg:col-span-2 w-full bg-black/30 rounded-2xl shadow-2xl shadow-cyan-500/10 p-5 border border-cyan-400/20"
          >
            <h2 className="text-xl font-bold text-cyan-200 mb-4">
              Detection Log
            </h2>
            <div className="space-y-3 pr-2 overflow-y-auto max-h-[420px]">
              {detections.length === 0 ? (
                <EmptyState />
              ) : (
                detections.map((det, idx) => (
                  <DetectionCard key={idx} detection={det} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* ✅ NEW: Detection History Section */}
        <div data-animate className="mt-12">
          <h2 className="text-2xl font-bold text-cyan-200 mb-4 flex items-center gap-3">
            <FiClock />
            Detection History
          </h2>
          {detectionHistory.length === 0 ? (
            <div className="bg-black/30 text-center p-8 rounded-lg border border-cyan-400/10">
              <p className="text-cyan-100/50">
                History will be populated as new fish species are detected.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {detectionHistory.map((histItem, idx) => (
                <HistoryCard key={idx} historyItem={histItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    <Footer/>        
    </div>
    </>
    
  );
}

// --- UI Sub-components ---

const StatusWidget = ({ icon, title, children }) => (
  <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center gap-4">
    <div className="text-2xl text-cyan-300">{icon}</div>
    <div>
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-lg font-bold">{children}</p>
    </div>
  </div>
);

const DetectionCard = React.forwardRef(({ detection }, ref) => {
  const [isNew, setIsNew] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      ref={ref}
      className={`p-3 rounded-lg flex items-center gap-4 transition-all duration-500 ${
        isNew ? "bg-cyan-400/20" : "bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="text-2xl text-cyan-300">🐟</div>
      <div className="flex-grow">
        <h3 className="font-semibold">{detection.class_name}</h3>
        <div className="w-full bg-black/20 rounded-full h-1.5 mt-1">
          <div
            className="bg-cyan-400 h-1.5 rounded-full"
            style={{ width: `${Math.round(detection.confidence * 100)}%` }}
          ></div>
        </div>
      </div>
      <p className="text-sm font-bold text-cyan-200">
        {Math.round(detection.confidence * 100)}%
      </p>
    </div>
  );
});

// ✅ NEW: History Card Component
const HistoryCard = ({ historyItem }) => (
  <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-center transition-transform hover:scale-105 hover:bg-white/10">
    <p className="text-2xl mb-2">🐟</p>
    <p className="font-semibold truncate text-cyan-300">
      {historyItem.class_name}
    </p>
    <p className="text-xs text-white/60">{historyItem.timestamp}</p>
  </div>
);

const EmptyState = () => {
  const emptyRef = useRef(null);
  useEffect(() => {
    gsap.to(emptyRef.current, {
      opacity: 0.6,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut",
    });
  }, []);
  return (
    <p ref={emptyRef} className="text-center text-cyan-100/50 p-8">
      Searching for fish...
    </p>
  );
};
