"use client"

import { motion } from "framer-motion"
import ProfileCard from "../ui/profilecard/ProfileCard";

export function HowItWorksSection() {
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} id="how-it-works" className="flex flex-col items-center justify-center mt-[75px] lg:mt-[451px] scroll-mt-28">

      <h2 className="font-quantico font-normal text-[12px] lg:text-[20px] lg:leading-[20px] flex items-center text-center tracking-[0.25em] lg:tracking-[0.5em] uppercase lg:mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(91,213,175,0.5)]">
        take your design to the next level
      </h2>
      <h3 className="font-krona-one font-normal text-[36px] lg:text-[96px] lg:leading-[86px] text-center uppercase text-[#F7EDE2]">
        how it works
      </h3>
      <motion.div
        variants={cardContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mt-5 md:mt-[80px] mb-[36px] flex flex-col md:flex-row flex-wrap items-center justify-center gap-x-[75px] gap-y-[43px]"
      >

        {/* Connect Figma */}
        <motion.div variants={cardVariants} className="w-[276px] lg:w-[365px] h-[365px] lg:h-[482px]">
          <ProfileCard
            name="Connect Figma"
            title="You can also upload JPG and PNG files"
            stepNumber={1}
            enableTilt={true}
            centerText={true}
            innerGradient="linear-gradient(145deg, rgba(0, 255, 255, 0.5) 0%, rgba(0, 80, 90, 0.1) 50%, #000a0f 100%)"

            iconUrl="/landing-page/Figma.png" // Ensure iconUrl is passed
            showBehindGradient={true} /* Enabled for background glow */
          />
        </motion.div>
        {/* Select Project */}
        <motion.div variants={cardVariants} className="w-[276px] lg:w-[365px] h-[365px] lg:h-[482px]">
          <ProfileCard
            name="Setup Project"
            title="Add design context for personalized results"
            stepNumber={2}
            enableTilt={true}
            centerText={true}
            innerGradient="linear-gradient(145deg, rgba(0, 255, 255, 0.5) 0%, rgba(0, 80, 90, 0.1) 50%, #000a0f 100%)"

            iconUrl="/landing-page/Slider.png" // Ensure iconUrl is passed
            showBehindGradient={true} /* Enabled for background glow */
          />
        </motion.div>
        {/* Analyze Design */}
        <motion.div variants={cardVariants} className="w-[276px] lg:w-[365px] h-[365px] lg:h-[482px] lg:col-span-2 lg:mx-auto">
          <ProfileCard
            name="Analyze Design"
            title="Generate actionable design improvements"
            stepNumber={3}
            enableTilt={true}
            centerText={true}
            innerGradient="linear-gradient(145deg, rgba(0, 255, 255, 0.5) 0%, rgba(0, 80, 90, 0.1) 50%, #000a0f 100%)"

            iconUrl="/landing-page/Monitor.png" // Ensure iconUrl is passed
            showBehindGradient={true} /* Enabled for background glow */
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
