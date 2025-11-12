"use client"

import { motion } from "framer-motion"
import { HowItWorksMobileCard } from "./HowItWorksMobileCard";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      id="how-it-works"
      className="flex flex-col items-center justify-center mt-[75px] lg:mt-[451px] scroll-mt-28 px-4 sm:px-6 lg:px-0"
    >
      {/* Section Headings */}
      <h2 className="font-quantico font-normal text-[10px] sm:text-[12px] lg:text-[20px] flex items-center text-center tracking-[0.25em] lg:tracking-[0.5em] uppercase mb-1 lg:mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(91,213,175,0.5)]">
        take your design to the next level
      </h2>

      <h3 className="font-krona-one font-normal text-[28px] sm:text-[36px] lg:text-[96px] text-center uppercase text-[#F7EDE2] leading-tight">
        how it works
      </h3>

      {/* Desktop Cards */}
      <div className="hidden md:block">
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-10 md:mt-[80px] mb-[36px] grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-16 items-center justify-items-center"
        >
          {/* Card 1 */}
          <motion.div
            variants={cardVariants}
            className="flex justify-center items-center w-full max-w-[365px] h-[482px]"
          >
            <ProfileCard
              name="Connect Figma"
              title="You can also upload JPG and PNG files"
              stepNumber={1}
              enableTilt
              centerText
              innerGradient="linear-gradient(145deg, rgba(0, 255, 255, 0.5) 0%, rgba(0, 80, 90, 0.1) 50%, #000a0f 100%)"
              iconUrl="/landing-page/Figma.png"
              showBehindGradient
            />
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={cardVariants}
            className="flex justify-center items-center w-full max-w-[365px] h-[482px]"
          >
            <ProfileCard
              name="Setup Project"
              title="Add design context for personalized results"
              stepNumber={2}
              enableTilt
              centerText
              innerGradient="linear-gradient(145deg, rgba(0, 255, 255, 0.5) 0%, rgba(0, 80, 90, 0.1) 50%, #000a0f 100%)"
              iconUrl="/landing-page/Slider.png"
              showBehindGradient
            />
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={cardVariants}
            className="flex justify-center items-center w-full max-w-[365px] h-[482px]"
          >
            <ProfileCard
              name="Analyze Design"
              title="Generate actionable design improvements"
              stepNumber={3}
              enableTilt
              centerText
              innerGradient="linear-gradient(145deg, rgba(0, 255, 255, 0.5) 0%, rgba(0, 80, 90, 0.1) 50%, #000a0f 100%)"
              iconUrl="/landing-page/Monitor.png"
              showBehindGradient
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Card */}
      <div className="md:hidden mt-10 mb-9">
        <HowItWorksMobileCard />
      </div>
    </motion.div>
  );
}
