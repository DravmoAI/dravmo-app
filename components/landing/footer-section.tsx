"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function FooterSection() {
  return (
    <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="relative font-roboto-flex w-full bg-[#0F1619] py-8 px-4 lg:px-8 flex items-center justify-between z-10">
      <Image
        src="/landing-page/dotted-line-footer.png"
        alt="Check"
        width={1268}
        height={522}
        className="hidden lg:block w-[15%] absolute left-0 bottom-0"
      />
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
    </motion.footer>
  );
}
