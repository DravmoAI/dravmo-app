"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function FeaturesSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} id="features" className="mt-[63px]">
      <Image
        src="/landing-page/features.png"
        alt="Features"
        width={5760}
        height={2128}
        className="hidden lg:block w-auto mx-auto" 
      />
      <Image 
        src="/landing-page/feature-phone.png" 
        alt="Features" 
        width={5760} 
        height={2128} 
        className="visible lg:hidden w-auto mx-auto" 
      />
    </motion.div>
  )
}
