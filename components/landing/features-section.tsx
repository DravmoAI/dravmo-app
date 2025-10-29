"use client";

import { motion, useAnimation, Variants, useInView } from "framer-motion";
import { FaBrain, FaUserAstronaut, FaBolt, FaFigma, FaUniversalAccess} from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { useEffect, useRef, useState } from "react";

const cardItems = [
  { text: "master mode", bg: "bg-transparent", textC: "text-white", icon: FaBrain, border: "border-[#65D5B2]" }, // Keep green
  { text: "design persona", bg: "bg-transparent", textC: "text-white", icon: IoIosColorPalette, border: "border-[#84B9FF]" }, // New blue
  { text: "instant design analysis", bg: "bg-transparent", textC: "text-white", icon: FaBolt, border: "border-[#A0DCFF]" }, // Existing light blue
  { text: "figma integration", bg: "bg-transparent", textC: "text-white", icon: FaFigma, border: "border-[#97FFEF]" }, // New cyan
  { text: "WCAG checks", bg: "bg-transparent", textC: "text-white", icon: FaUniversalAccess, border: "border-[#A0DCFF]" }, // Existing light blue
];

const floatingEmoji: Variants = {
  float: {
    y: [0, -6, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Card = ({ item }: { item: typeof cardItems[0] }) => {
  const cardControls = useAnimation();

  const handleHoverStart = () => {
    cardControls.start("hover");
  };

  const handleHoverEnd = () => {
    cardControls.start("rest");
  };

  return (
    <motion.div
      className={`flex flex-shrink-0 items-center justify-center p-6 lg:p-8 w-[250px] lg:w-auto lg:min-w-[220px] h-[100px] lg:h-[140px] rounded-2xl border-2 ${item.bg} ${item.border}`}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-3 lg:gap-5">
        <span
          className={`font-krona-one uppercase text-left lg:text-center text-lg lg:text-2xl lg:whitespace-nowrap ${item.textC}`}
        >
          {item.text}
        </span>
        <motion.span
          className="text-3xl lg:text-4xl origin-center"
          animate={cardControls}
          initial="initial"
          variants={{
            initial: { ...floatingEmoji.float },
            rest: { scale: 1, rotate: 0 },
            hover: {
              scale: 1.5,
              rotate: [0, 15, -15, 0, 0],
              transition: {
                rotate: { duration: 0.5, times: [0, 0.25, 0.5, 0.75, 1] },
              },
            },
          }}
        >
          <item.icon />
        </motion.span>
      </div>
    </motion.div>
  );
};

function InfiniteScroller() {
  const scrollControls = useAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth / 2;
      setWidth(scrollWidth);
      scrollControls.start({
        x: [0, -scrollWidth],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        },
      });
    }
  }, [scrollControls]);

  return (
    <div className="w-full overflow-hidden py-8">
      <motion.div
        ref={scrollRef}
        animate={scrollControls}
        className="flex gap-6 lg:gap-10"
      >
        {[...cardItems, ...cardItems].map((item, index) => <Card item={item} key={index} />)}
      </motion.div>
    </div>
  );
}

function StaticCards() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6 py-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {cardItems.map((item, index) => <motion.div key={index} variants={cardVariants}><Card item={item} /></motion.div>)}
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      id="features"
      className="flex flex-col items-center justify-center mt-[63px] w-full scroll-mt-28"
    >
      <h2 className="font-quantico font-normal text-[12px] lg:text-[20px] lg:leading-[20px] flex items-center text-center tracking-[0.25em] lg:tracking-[0.5em] uppercase lg:mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(91,213,175,0.5)]">
        Upload and Analyze. It's that simple!
      </h2>
      <h3 className="font-krona-one font-normal text-[36px] lg:text-[96px] lg:leading-[86px] text-center uppercase text-[#F7EDE2]">
        Features
      </h3>
      <div className="w-full hidden lg:block">
        <InfiniteScroller />
      </div>
      <div className="w-full lg:hidden">
        <StaticCards />
      </div>
    </motion.div>
  );
}
