"use client"

import Image from "next/image"
import { motion } from "framer-motion";
import { useAnimation, useInView } from "framer-motion";
import Masonry from "../Masonry";
import { useEffect, useRef, useState } from "react";

const mastersNames = [
  "Massimo Vignelli",
  "Paul Rand",
  "Neville Brody",
  "Dieter Rams",
  "Paula Scher",
  "Josef Muller Brockmann",
  "Susan Kare",
  "April Greiman",
  "Saul Bass",
  "Muriel Cooper"
]

// Assign some varying heights to showcase the masonry layout.
const heights = [450, 550, 500, 480, 520, 470, 530, 490, 510, 540];

const mastersData = mastersNames.map((name, index) => {
  const formattedName = name.toLowerCase().replace(/\s/g, '_');
  return {
    id: formattedName,
    name: name,
    // The Masonry component expects an `img` property. Encode the name for the URL.
    img: `/masters/${encodeURIComponent(name)}.jpg`,
    // The Masonry component expects a `url`, we can link to a search for the master
    url: `https://www.google.com/search?q=${name.replace(/\s/g, '+')}+design`,
    height: heights[index % heights.length],
  };
});

const MasterCard = ({ item }: { item: typeof mastersData[0] }) => {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex-shrink-0 w-[250px] h-[350px] rounded-2xl overflow-hidden group"
    >
      <Image
        src={item.img}
        alt={item.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 z-10 transition-opacity duration-300">
        <span className="font-krona-one text-[#97FFEF] transition-colors text-lg text-center uppercase leading-tight">
          {item.name}
        </span>
      </div>
    </a>
  );
};

function MasterCarousel() {
  const scrollControls = useAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth / 2;
      scrollControls.start({
        x: [0, -scrollWidth],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40, // Slower duration for a smoother scroll
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
        className="flex gap-6"
      >
        {[...mastersData, ...mastersData].map((item, index) => <MasterCard item={item} key={`${item.id}-${index}`} />)}
      </motion.div>
    </div>
  );
}

export function MasterModeSection() {

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5 }} className="relative flex flex-col items-center justify-center mt-[100px] lg:mt-[150px] mb-0 overflow-hidden">
      <Image 
        src="/landing-page/dotted-line-master-mode-phone.png" 
        alt="" 
        width={544} 
        height={5756} 
        className="lg:hidden w-full" 
      />
      <Image 
        src="/landing-page/dotted-line-3.png" 
        alt="" 
        width={544} 
        height={5756} 
        className="hidden lg:block w-[146px] h-[1440px] absolute bottom-0 right-0 translate-y-[25%] z-0" 
      />
      <h2 className="font-quantico font-normal text-[12px] lg:text-[20px] lg:leading-[20px] flex items-center text-center lg:tracking-[0.5em] uppercase lg:mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
        design legends inspired ai review
      </h2>
      <h3 className="font-krona-one font-normal text-[36px] lg:text-[96px] lg:leading-[86px] text-center uppercase text-[#F7EDE2]">
        master mode
      </h3>
      <h4 className="font-roboto-flex font-normal text-[11px] lg:text-[16px] lg:leading-[20px] text-center lg:tracking-[0.15em] text-[#97FFEF] lg:mt-[10px]">
        10 AI mentors each with turn-key playbooks and brain of a master designer
      </h4>


      {/* Masonry Grid */}
      <div className="w-full max-w-6xl mx-auto mt-10 px-4 h-[600px] hidden lg:block">
        <Masonry items={mastersData} animateFrom="bottom" />
      </div>

      <div className="w-full lg:hidden mt-4">
        <MasterCarousel />
      </div>
      
    </motion.div>
  )
}
