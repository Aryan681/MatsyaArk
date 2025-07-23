import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const keyTopics = [
  {
    title: "Biomimicry-Inspired Innovation",
    desc: "Fish-shaped autonomous drones designed to mimic nature for efficient underwater exploration.",
  },
  {
    title: "Marine Health Monitoring",
    desc: "Real-time tracking of pollution, coral health, and biodiversity for a healthier ocean ecosystem.",
  },
  {
    title: "AI & IoT Integration",
    desc: "Smart sensors, deep learning, and satellite data combine for intelligent marine insights.",
  },
  {
    title: "AR Public Engagement",
    desc: "Immersive ocean education experiences delivered through Augmented Reality.",
  },
  {
    title: "Eco-Tourism & Education",
    desc: "AR-powered sustainable tourism and academic modules for impactful learning.",
  },
  {
    title: "Self-sustaining Energy",
    desc: "Solar, hydro, kinetic, and thermal energy sources keep the drones running sustainably.",
  },
  {
    title: "Global Ocean Conservation Mission",
    desc: "Partnering with governments and NGOs to protect and restore marine environments.",
  },
  {
    title: "Smart Fishing Guidance",
    desc: "AI-driven route updates help prevent overfishing and support sustainable practices.",
  },
  {
    title: "Blockchain for Marine Data",
    desc: "Secured, transparent pollution and fishing data using blockchain technology.",
  },
  {
    title: "No Direct Competitor",
    desc: "First-of-its-kind tech stack integration in a biomimetic fish drone.",
  },
];

export default function HeroSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#02111b] via-[#032027] to-[#00151a] text-white overflow-x-hidden">
      {/* Background Fish Animation */}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover opacity-30 z-0 pointer-events-none"
        src="/fish.webm"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Floating Jellyfish / Bubbles */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="animate-pulse absolute w-20 h-20 bg-cyan-400/10 rounded-full top-[20%] left-[10%] blur-xl"></div>
        <div className="animate-pulse absolute w-16 h-16 bg-sky-300/10 rounded-full top-[60%] left-[70%] blur-xl"></div>
        <div className="animate-pulse absolute w-24 h-24 bg-blue-500/10 rounded-full top-[40%] left-[40%] blur-xl"></div>
      </div>

      {/* Hero Section */}
      <section
        ref={sectionRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 py-24 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-sky-200 drop-shadow-xl mb-6"
        >
          Where Nature Meets Innovation
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="text-xl sm:text-2xl text-cyan-300 max-w-2xl mx-auto mb-8"
        >
          Meet the world’s first biomimetic fish drone platform, blending AI, AR, and green energy for a smarter, cleaner ocean.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-8 py-3 bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 backdrop-blur-md rounded-full shadow-lg hover:bg-cyan-600/30 transition-all"
        >
          Dive Into Innovation
        </motion.button>
      </section>

      {/* Key Topics Sections */}
      <section className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-16">
        {keyTopics.map((topic, idx) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: idx * 0.08, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-cyan-400/20 p-6 flex flex-col items-center text-center hover:scale-105 transition-transform min-h-[200px]"
          >
            <h3 className="text-xl font-bold text-cyan-300 mb-2 drop-shadow">{topic.title}</h3>
            <p className="text-base text-sky-100">{topic.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
