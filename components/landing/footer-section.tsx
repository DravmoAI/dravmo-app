"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export function FooterSection() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
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
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="relative font-roboto-flex w-full py-8 px-4 lg:px-8 flex items-center justify-between z-20">
      <div className="relative flex items-center lg:min-w-[250px] lg:h-[80px]">
        <span className="relative z-10 text-white text-[12px] lg:text-[16px] ml-2 lg:ml-6">
          2025{" "}
          <a href="/" className="hover:underline text-primary transition-colors">
            Dravmo
          </a>{" "}
          Inc.
        </span>
      </div>
      <div className="flex items-center gap-x-12">
        <a href="/terms" className="text-white text-[12px] lg:text-[16px] hover:underline">
          Terms
        </a>
        <a href="/privacy" className="text-white text-[12px] lg:text-[16px] hover:underline">
          Privacy
        </a>
        {/* <a href="#" className="text-white text-[12px] lg:text-[16px] hover:underline">
          Contact
        </a> */}
      </div>
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
    </motion.footer>
  );
}
