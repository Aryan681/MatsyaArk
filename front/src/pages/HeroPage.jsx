import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Footer from "../components/bais/Footer";
import HomeN from "../components/bais/HomeN";
import {
  CpuChipIcon,
  ChartBarIcon,
  SwatchIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Coral Conservation AI",
    desc: "Predicts coral bleaching with 94% accuracy using ML models.",
    icon: <CpuChipIcon className="w-10 h-10 text-cyan-300" />,
  },
  {
    title: "Real-Time Ocean Health",
    desc: "Monitors temperature, pH, and pollution continuously.",
    icon: <ChartBarIcon className="w-10 h-10 text-cyan-300" />,
  },
  {
    title: "Biomimetic FishBots",
    desc: "Drones mimic marine life for non-invasive research.",
    icon: <SwatchIcon className="w-10 h-10 text-cyan-300" />,
  },
  {
    title: "Underwater AR",
    desc: "Augmented reality for immersive marine education.",
    icon: <DevicePhoneMobileIcon className="w-10 h-10 text-cyan-300" />,
  },
  {
    title: "Satellite Sensors",
    desc: "Hyperspectral imaging for global ocean tracking.",
    icon: <GlobeAltIcon className="w-10 h-10 text-cyan-300" />,
  },
  {
    title: "Blockchain Data Logs",
    desc: "Tamper-proof conservation records using blockchain.",
    icon: <LockClosedIcon className="w-10 h-10 text-cyan-300" />,
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function HeroPage() {
  const sectionsRef = useRef([]);
  const waveRef = useRef(null);
  const transitionRef = useRef(null);
  const fishRef = useRef(null);
  const bubbleRefs = useRef([]);
  const coralParticleRefs = useRef([]);
  const featureGridRef = useRef(null);

  const addToSectionsRef = useCallback((el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  }, []);

  const addToBubbleRefs = useCallback((el) => {
    if (el && !bubbleRefs.current.includes(el)) {
      bubbleRefs.current.push(el);
    }
  }, []);

  const addToCoralParticleRefs = useCallback((el) => {
    if (el && !coralParticleRefs.current.includes(el)) {
      coralParticleRefs.current.push(el);
    }
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();

    sectionsRef.current.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    gsap.to(fishRef.current, {
      x: "120vw",
      duration: 30,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(fishRef.current, {
          x: "-30vw",
          y: gsap.utils.random(-50, 50),
        });
      },
      delay: gsap.utils.random(0, 10),
    });

    gsap.set(fishRef.current, { x: "-30vw" });

    bubbleRefs.current.forEach((bubble) => {
      gsap.fromTo(
        bubble,
        {
          y: 0,
          opacity: 0.1 + Math.random() * 0.4,
          scale: 0.5 + Math.random() * 0.5,
        },
        {
          y: -window.innerHeight * 1.5,
          x: `+=${gsap.utils.random(-80, 80)}`,
          opacity: 0,
          scale: 0.8 + Math.random() * 0.5,
          duration: gsap.utils.random(15, 25),
          ease: "power1.in",
          repeat: -1,
          delay: gsap.utils.random(0, 10),
          onRepeat: () => {
            gsap.set(bubble, {
              y: 0,
              x: 0,
              opacity: 0.1 + Math.random() * 0.4,
              scale: 0.5 + Math.random() * 0.5,
            });
          },
        }
      );
    });

    coralParticleRefs.current.forEach((coral) => {
      gsap.to(coral, {
        x: `+=${(Math.random() - 0.5) * 200}`,
        y: `+=${(Math.random() - 0.5) * 200}`,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
        opacity: Math.random() * 0.6 + 0.3,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    gsap.set(waveRef.current, {
      xPercent: -50,
      width: "200%",
      left: "50%",
    });

    gsap.set(transitionRef.current, {
      xPercent: -50,
      width: "200%",
      left: "50%",
    });

    if (waveRef.current && sectionsRef.current[0]) {
      gsap.to(waveRef.current.querySelector(".wave-shape-fill"), {
        fill: "#01161E",
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionsRef.current[0],
          start: "top 90%",
          end: "top 10%",
          scrub: true,
        },
      });
    }

    if (transitionRef.current && sectionsRef.current[1]) {
      gsap.to(transitionRef.current.querySelector(".transition-shape-fill"), {
        fill: "#002D3A",
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionsRef.current[1],
          start: "top 90%",
          end: "top 10%",
          scrub: true,
        },
      });
    }

    // ✅ Zig-Zag ScrollTrigger animation setup (inside useEffect)
    gsap.utils.toArray(".zig-zag-item").forEach((item, index) => {
      const media = item.querySelector(".zig-zag-media");
      const content = item.querySelector(".zig-zag-content");
      const isReversed = item.classList.contains("lg:flex-row-reverse");

      // 👋 Entrance Animation (on scroll in)
      gsap.fromTo(
        media,
        {
          xPercent: isReversed ? -100 : 100,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        content,
        {
          xPercent: isReversed ? 100 : -100,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 🎯 Reverse Scroll / Parallax-style effect (on scroll out)
      gsap.to(media, {
        yPercent: isReversed ? 10 : -10, // Increased for better visibility
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "center center", // Starts when top hits middle of viewport
          end: "bottom top", // Ends after element is out of view
          scrub: 0.5, // Smooth scrub animation
          // markers: true,     // Uncomment for debugging
        },
      });

      gsap.to(content, {
        yPercent: isReversed ? -40 : 40, // Increased movement
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top center",
          end: "bottom top",
          scrub: 0.5,
          // markers: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.globalTimeline.clear();
    };
  }, [addToSectionsRef, addToBubbleRefs, addToCoralParticleRefs]);
  gsap.utils.toArray(".feature-card").forEach((card, i) => {
    // Fade-in on scroll
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    // Reverse parallax on scroll out
    gsap.to(card, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top center",
        end: "bottom top",
        scrub: 0.5,
      },
    });
  });

  return (
    <div className="w-full overflow-x-hidden text-white relative">
      {/* 🌊 Fixed Background Video */}
      <video
        src="/more.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-screen h-screen object-cover z-[-2] pointer-events-none" // Changed z-index
      />

      {/* Optional Overlay for better text visibility */}
      <div className="fixed inset-0 bg-black/40 z-[-1] pointer-events-none" />

      <HomeN />

      {/* Hero Section */}
      <section className="hero-section relative z-10 min-h-screen px-6 pt-32 pb-24 flex items-center justify-center overflow-hidden">
        {/* Remove the duplicate video here */}
        {/* Water surface effect (z-index 2) */}
        <div className="water-surface absolute inset-0 z-2"></div>
        {/* Ocean floor effect (z-index 1) */}
        <div className="ocean-floor absolute inset-0 z-1"></div>
        {/* Overlay (z-index 10 - higher to cover background but below content) */}
        <div className="absolute inset-0 bg-transparent z-10" />{" "}
        {/* Ensure this overlay is transparent or has low opacity if you want video to show */}
        {/* Content Container (z-index 20 - highest) */}
        <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between max-w-7xl w-full gap-10 text-center lg:text-left">
          {/* Left: Headline and Description */}
          <div className="w-full lg:w-1/2">
            <motion.h1
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-5xl sm:text-6xl font-extrabold   text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 leading-tight mb-6 drop-shadow-lg" // Adjusted gradient & shadow
            >
              Revolutionizing <br /> Ocean Conservation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="text-xl text-cyan-100 mb-8 max-w-lg mx-auto lg:mx-0" // Center on small screens
            >
              Harnessing biomimetic AI and cutting-edge technology to protect
              and restore our planet's marine ecosystems.
            </motion.p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(0, 200, 255, 0.5)",
              }} // Enhanced hover effect
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1" // More prominent button
            >
              Dive Into Innovation
            </motion.button>
          </div>
          {/* Right: Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 flex items-center justify-center"
          >
            <div className="w-[90%] sm:w-[80%] md:w-[115%] bg-white/10 border border-cyan-300/20 rounded-xl shadow-xl backdrop-blur-md  flex items-center justify-center overflow-hidden neon-glow">
              {" "}
              {/* Added neon glow */}
              <video
                src="/modle2.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section
        ref={addToSectionsRef}
        className="relative z-10 py-28 px-6 bg-gradient-to-b"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-400 mb-6"
          >
            Our Core Depths
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-cyan-100 mb-16 max-w-2xl mx-auto"
          >
            Blending marine biology with AI to explore and preserve the ocean's
            future.
          </motion.p>

          <div
            className="grid xl:grid-cols-3 md:grid-cols-2 gap-10 px-4"
            ref={featureGridRef}
          >
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl bg-white/5 backdrop-blur-lg border border-cyan-500/20 shadow-md shadow-cyan-300/10 p-6 hover:scale-[1.03] hover:shadow-cyan-400/30 transition-transform duration-300"
              >
                <div className="flex justify-center items-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-cyan-200 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-cyan-100 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zig-Zag Sections */}
      <section
        className="relative z-10 bg-transparent px-6 py-28 overflow-hidden" // Added overflow-hidden
      >
        <div className="max-w-6xl mx-auto space-y-28">
          {[
            {
              title: "Bio-inspired Robotics",
              desc: "We mimic the movement and intelligence of fish to explore the deepest corners of our oceans with minimal disruption. Our autonomous drones are designed for stealth and efficiency.",
              video: "/study.mp4",
            },
            {
              title: "Augmented Marine Education",
              desc: "Our platform offers immersive, real-time educational tours using AR and live data from marine drones, bringing the ocean's wonders directly to you.",
              video: "/future2.mp4",
            },
            {
              title: "Sustainable Ecosystem Mapping",
              desc: "Mapping coral reefs, thermal currents, and biodiversity hotspots with self-powered drones ensures comprehensive and eco-friendly data collection.",
              video: "/USP.mp4",
            },
          ].map((item, n) => (
            <div
              key={n}
              // Added zig-zag-item class for GSAP targeting
              className={`zig-zag-item flex flex-col lg:flex-row items-center gap-10 ${
                n % 2 === 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="zig-zag-media relative w-full lg:w-1/2 aspect-video rounded-2xl shadow-xl overflow-hidden border border-cyan-400/20 neon-glow">
                <video
                  src={item.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="zig-zag-content flex-1 text-center lg:text-left">
                <h3 className="text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 font-semibold mb-4">
                  {item.title}
                </h3>
                <p className="text-sky-100 text-lg leading-relaxed">
                  {item.desc}
                </p>
             
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
