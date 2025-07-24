import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Footer from "../components/bais/Footer"; // Assuming these paths are correct
import HomeN from "../components/bais/HomeN"; // Assuming these paths are correct

gsap.registerPlugin(ScrollTrigger);

// Component for a single animated bubble
const Bubble = ({ forwardRef, style }) => (
  <div ref={forwardRef} className="bubble" style={style}></div>
);

// Component for a single animated coral particle
const CoralParticle = ({ forwardRef, style }) => (
  <div ref={forwardRef} className="coral-particle" style={style}></div>
);

export default function OceanLanding() {
  const sectionsRef = useRef([]);
  const waveRef = useRef(null);
  const transitionRef = useRef(null);
  const fishRef = useRef(null);
  const bubbleRefs = useRef([]);
  const coralParticleRefs = useRef([]);

  // Callback to add elements to refs array for scroll animations
  const addToSectionsRef = useCallback((el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  }, []);

  // Callback for bubbles
  const addToBubbleRefs = useCallback((el) => {
    if (el && !bubbleRefs.current.includes(el)) {
      bubbleRefs.current.push(el);
    }
  }, []);

  // Callback for coral particles
  const addToCoralParticleRefs = useCallback((el) => {
    if (el && !coralParticleRefs.current.includes(el)) {
      coralParticleRefs.current.push(el);
    }
  }, []);

  useEffect(() => {
    // Ensure ScrollTrigger refreshes on component mount
    ScrollTrigger.refresh();

    // Section animations (using addToSectionsRef)
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
            start: "top 80%", // Adjusted for smoother entry
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Fish animation (continuous loop across screen)
    gsap.to(fishRef.current, {
      x: "120vw", // Move completely off-screen to the right
      duration: 30,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        // Reset position to left off-screen when repeating
        gsap.set(fishRef.current, { x: "-30vw", y: gsap.utils.random(-50, 50) }); // Randomize Y for natural feel
      },
      delay: gsap.utils.random(0, 10) // Stagger starting times
    });
    // Initial fish position set (if not already via CSS or motion initial prop)
    gsap.set(fishRef.current, { x: "-30vw" }); // Ensure it starts off-screen left

    // Bubble animations (from bottom to top, then reset)
    bubbleRefs.current.forEach((bubble) => {
      gsap.fromTo(
        bubble,
        {
          y: 0, // Start at current Y (which is bottom: -50px relative to parent)
          opacity: 0.1 + Math.random() * 0.4, // Initial random opacity
          scale: 0.5 + Math.random() * 0.5, // Initial random scale
        },
        {
          y: -window.innerHeight * 1.5, // Move far off-screen upwards
          x: `+=${gsap.utils.random(-80, 80)}`, // Horizontal drift
          opacity: 0,
          scale: 0.8 + Math.random() * 0.5,
          duration: gsap.utils.random(15, 25), // Longer duration
          ease: "power1.in", // Bubbles slow down as they rise
          repeat: -1,
          delay: gsap.utils.random(0, 10), // Stagger starting times
          onRepeat: () => {
            // Reset to bottom and new random X position
            gsap.set(bubble, {
              y: 0,
              x: 0, // Reset horizontal drift
              opacity: 0.1 + Math.random() * 0.4,
              scale: 0.5 + Math.random() * 0.5,
            });
          },
        }
      );
    });

    // Coral Particle animations (floating/drifting)
    coralParticleRefs.current.forEach((coral) => {
      gsap.to(coral, {
        x: `+=${(Math.random() - 0.5) * 200}`, // Larger drift
        y: `+=${(Math.random() - 0.5) * 200}`, // Larger drift
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
        opacity: Math.random() * 0.6 + 0.3,
        duration: Math.random() * 20 + 15, // Longer duration for slower drift
        delay: Math.random() * 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Wave alignment (GSAP set is good for initial positioning)
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

    // Example ScrollTrigger for a wave transition (more complex, might need more specific SVG paths)
    // This example animates the wave fill color as you scroll into the next section
    if (waveRef.current && sectionsRef.current[0]) { // Assuming Core Values is the first section
      gsap.to(waveRef.current.querySelector('.wave-shape-fill'), {
        fill: "#01161E", // Color of the next section's background
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionsRef.current[0], // Trigger when the Core Values section starts
          start: "top 90%", // Start animating before it fully enters
          end: "top 10%", // End when the section is mostly in view
          scrub: true, // Smoothly link animation to scroll
        },
      });
    }

    if (transitionRef.current && sectionsRef.current[1]) { // Assuming Zig-Zag is the second section
      gsap.to(transitionRef.current.querySelector('.transition-shape-fill'), {
        fill: "#002D3A", // Color of the previous section's background
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionsRef.current[1], // Trigger when the Zig-Zag section starts
          start: "top 90%",
          end: "top 10%",
          scrub: true,
        },
      });
    }


    // Cleanup function for GSAP animations
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.globalTimeline.clear(); // Clear all animations
    };
  }, [addToSectionsRef, addToBubbleRefs, addToCoralParticleRefs]); // Add memoized callbacks to dependency array

  return (
    <div className="w-full overflow-x-hidden text-white bg-[#01161E] relative">
      <style jsx global>{`
        /* Keyframes from original, potentially adjusted for better integration */
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        
        .water-surface {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: linear-gradient(to bottom, rgba(8, 145, 178, 0.7), transparent);
          z-index: 2;
          pointer-events: none;
        }
        
        .ocean-floor {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: linear-gradient(to top, rgba(6, 95, 70, 0.5), transparent);
          z-index: 1;
          pointer-events: none;
        }
        
        .coral-particle {
          position: absolute;
          pointer-events: none;
          z-index: 0;
          filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.3));
          border-radius: 30%; /* Ensure this is here for the shape */
        }
        
        .bubble {
          position: absolute;
          background: rgba(255, 255, 255, 0.15); /* Slightly more visible */
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          filter: blur(1px); /* Soften the edges */
        }
        
        .pulse-text { /* Not explicitly used but good to keep */
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
          50% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.9); }
          100% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
        }
        
        .neon-glow {
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
          border-color: rgba(0, 255, 255, 0.5);
        }
        
        .wave-svg, .transition-wave {
          position: relative; /* Changed from absolute to relative to flow with content */
          width: 100%;
          overflow: hidden;
          line-height: 0;
          /* Adjusted margin-top for better visual integration with sections */
          margin-top: -1px; /* Remove any tiny gap between sections */
          z-index: 10; /* Ensure waves are above background, but below main content when relevant */
        }
        
        .wave-svg svg, .transition-wave svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 100px;
        }
        
        .wave-shape-fill {
          fill: #002D3A; /* Fill color for the wave matching the next section's background */
        }
        
        .transition-wave {
          transform: rotate(180deg); /* Flip for bottom transition */
        }
        
        .transition-shape-fill {
          fill: #01161E; /* Fill color for the transition wave matching the previous section's background */
        }
      `}</style>

      <HomeN />

      {/* Hero Section */}
      <section className="hero-section relative z-10 min-h-screen px-6 pt-32 pb-24 bg-[#01161E] flex items-center justify-center overflow-hidden">
        {/* Background video (lower opacity, z-index 0) */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover  z-5"
          src="/more.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Water surface effect (z-index 2) */}
        <div className="water-surface"></div>

        {/* Ocean floor effect (z-index 1) */}
        <div className="ocean-floor"></div>

      

        {/* Dynamic bubbles (z-index 4) */}
        {[...Array(30)].map((_, i) => ( // More bubbles
          <Bubble
            key={i}
            forwardRef={el => addToBubbleRefs(el)}
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-10px', // Start slightly off-screen
            }}
          />
        ))}

        {/* Dynamic coral particles (z-index 3) */}
        {[...Array(50)].map((_, i) => ( // More particles
          <CoralParticle
            key={i}
            forwardRef={el => addToCoralParticleRefs(el)}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              backgroundColor: `hsl(${Math.random() * 60 + 180}, 80%, 60%)`, // Varied hues of blue/green
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}


        {/* Overlay (z-index 10 - higher to cover background but below content) */}
        <div className="absolute inset-0   z-10" />

        {/* Content Container (z-index 20 - highest) */}
        <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between max-w-7xl w-full gap-10 text-center lg:text-left">
          {/* Left: Headline and Description */}
          <div className="w-full lg:w-1/2">
            <motion.h1
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 leading-tight mb-6 drop-shadow-lg" // Adjusted gradient & shadow
            >
              Revolutionizing <br /> Ocean Conservation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="text-xl text-cyan-100 mb-8 max-w-lg mx-auto lg:mx-0" // Center on small screens
            >
              Harnessing biomimetic AI and cutting-edge technology to protect and restore our planet's marine ecosystems.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 200, 255, 0.5)" }} // Enhanced hover effect
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
            <div className="w-[90%] sm:w-[80%] md:w-[115%] bg-white/10 border border-cyan-300/20 rounded-xl shadow-xl backdrop-blur-md p-6 flex items-center justify-center overflow-hidden neon-glow"> {/* Added neon glow */}
              <video
                src="/drone-demo.webm"
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
      <section ref={addToSectionsRef} className="relative z-10 py-24 px-6 bg-[#002D3A]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-300 mb-4 pulse-text" // Added pulse-text
          >
            Our Core Depths
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-cyan-100 mb-12 max-w-3xl mx-auto"
          >
            Pioneering technologies that blend marine biology with artificial intelligence
          </motion.p>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {[
              {
                title: "Coral Conservation AI",
                desc: "Machine learning models that predict bleaching events with 94% accuracy",
                icon: "🤖"
              },
              {
                title: "Real-Time Ocean Health",
                desc: "Continuous monitoring of temperature, pH, and pollution levels",
                icon: "📊"
              },
              {
                title: "Biomimetic FishBots",
                desc: "Autonomous drones that mimic marine life for non-invasive research",
                icon: "🐟"
              },
              {
                title: "Underwater AR",
                desc: "Immersive educational experiences through augmented reality",
                icon: "👓"
              },
              {
                title: "Satellite Sensors",
                desc: "Global ocean monitoring with hyperspectral imaging",
                icon: "🛰️"
              },
              {
                title: "Blockchain Data Logs",
                desc: "Tamper-proof records of marine conservation efforts",
                icon: "⛓️"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="glass-card rounded-xl p-6 shadow-xl hover:shadow-cyan-500/20"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">{item.title}</h3>
                <p className="text-sky-100 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

  

      {/* Zig-Zag Sections */}
      <section ref={addToSectionsRef} className="relative z-10 bg-[#01161E] px-6 py-28">
        <div className="max-w-6xl mx-auto space-y-28">
          {[
            {
              title: "Bio-inspired Robotics",
              desc: "We mimic the movement and intelligence of fish to explore the deepest corners of our oceans with minimal disruption. Our autonomous drones are designed for stealth and efficiency.",
              video: "/bio-robotics.webm"
            },
            {
              title: "Augmented Marine Education",
              desc: "Our platform offers immersive, real-time educational tours using AR and live data from marine drones, bringing the ocean's wonders directly to you.",
              video: "/ar-education.webm"
            },
            {
              title: "Sustainable Ecosystem Mapping",
              desc: "Mapping coral reefs, thermal currents, and biodiversity hotspots with self-powered drones ensures comprehensive and eco-friendly data collection.",
              video: "/ecosystem-mapping.webm"
            }
          ].map((item, n) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }} // Removed n*0.1 for consistent trigger with scroll
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-10 ${
                n % 2 === 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full lg:w-1/2 rounded-2xl shadow-xl overflow-hidden border border-cyan-400/20 neon-glow"> {/* Added neon glow */}
                <video
                  src={item.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 font-semibold mb-4">
                  {item.title}
                </h3>
                <p className="text-sky-100 text-lg leading-relaxed">
                  {item.desc}
                </p>
                <button className="mt-6 px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-full shadow-md hover:from-teal-400 hover:to-blue-400 transition-all duration-300 transform hover:-translate-y-1"> {/* Enhanced button */}
                  Learn More →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}