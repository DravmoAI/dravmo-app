"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [heroHeight, setHeroHeight] = useState(0);

  const toggleVisibility = () => {
    // Show button if scrolled past half of the hero section's height
    if (heroHeight > 0 && window.pageYOffset > heroHeight / 2) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const heroElement = document.getElementById("hero-section");
    if (heroElement) {
      setHeroHeight(heroElement.offsetHeight);
    }

    const handleResize = () => {
      if (heroElement) setHeroHeight(heroElement.offsetHeight);
    };

    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, [heroHeight, toggleVisibility]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#97FFEF] text-[#0F1619] shadow-[0_0_10px_3px_rgba(151,255,239,0.4)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
        >
          <FaArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}