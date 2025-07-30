import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaInstagram, FaGithub, FaTwitter, FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { IoMdWater } from "react-icons/io";

export default function Footer() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const waveVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "backOut"
      }
    }
  };

  return (
    <footer className="relative w-full  text-cyan-200 pb-10 px-6 py-4 overflow-hidden mt-[-3em]">
      {/* Animated Wave */}
      <motion.div 
         className="absolute inset-0 w-full h-full z-0 overflow-hidden rotate-180"
  
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={waveVariants}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-32 sm:h-40 md:h-56 lg:h-64"
        >
          <path
            fill="#0F172A"
            fillOpacity="1"
            d="M0,224L48,202.7C96,181,192,139,288,149.3C384,160,480,224,576,224C672,224,768,160,864,160C960,160,1056,224,1152,229.3C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
          <path
            fill="#0EA5E9"
            fillOpacity="0.3"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,213.3C672,213,768,203,864,186.7C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
          <path
            fill="#38BDF8"
            fillOpacity="0.2"
            d="M0,256L48,240C96,224,192,192,288,170.7C384,149,480,139,576,165.3C672,192,768,256,864,272C960,288,1056,256,1152,240C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </motion.div>

      {/* Enhanced Starry Background */}
  
      {/* Main Content with Animations */}
      <motion.div 
        className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6 relative z-10 pt-16"
        initial="hidden"
        animate={controls}
        variants={contentVariants}
      >
        {/* Logo */}
          <motion.div
                 initial={{ x: "-100%", opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ type: "easeInOut", stiffness: 60 }}
                 className="flex items-center gap-3"
               >
                 <video
                   src="/fish.webm"
                   autoPlay
                   loop
                   muted
                   playsInline
                   className="w-10 h-10 rounded-full object-cover"
                 />
                 <h1 className="text-xl font-bold tracking-wide text-cyan-300">
                   MatsyaArk
                 </h1>
               </motion.div>

        {/* Navigation */}
        <motion.nav variants={itemVariants} className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-cyan-300">
          {['Home', 'DashBoard', 'Fish', 'Coral', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`/${item.toLowerCase()}`} 
              className="hover:text-white transition-all duration-300 hover:scale-105 transform px-2 py-1 rounded-md hover:bg-cyan-900/20"
            >
              {item}
            </a>
          ))}
        </motion.nav>

        {/* Social Links */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="text-cyan-400 text-lg font-medium">Follow the Current</div>
          <div className="flex gap-4 sm:gap-6 justify-center text-2xl text-cyan-300">
            {[
              { icon: <FaGithub />, label: "GitHub" },
              { icon: <FaTwitter />, label: "Twitter" },
              { icon: <FaLinkedin />, label: "LinkedIn" },
            ].map((social) => (
              <a
                key={social.label}
                href={`https://${social.label.toLowerCase()}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-all duration-300 transform hover:scale-125 p-2 rounded-full hover:bg-cyan-900/30"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div variants={itemVariants} className="text-sm text-cyan-500 mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <span>© {new Date().getFullYear()} MatsyaArk</span>
          <span className="hidden sm:inline">•</span>
          <span>All rights reserved</span>
          <span className="hidden sm:inline">•</span>
          <span>Submerged in privacy</span>
        </motion.div>
      </motion.div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-ripple {
          animation: ripple 3s infinite ease-in-out;
        }
      `}</style>
    </footer>
  );
}