"use client"

import Image from "next/image"
import { motion } from "framer-motion"
const mastersNames = [
  "massimo vignelli",
  "Paul rand",
  "neville brody",
  "dieter rams",
  "paula scher",
  "josef muller",
  "susan kare",
  "april greiman",
  "saul bass",
  "muriel cooper"
]
export function MasterModeSection() {

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center mt-[53px] mb-[100px]">
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
        className="hidden lg:block w-[146px] h-[1440px] absolute top-[3223px] right-0 translate-y-[-44%] z-0" 
      />
      <h2 className="font-quantico font-normal text-[12px] lg:text-[20px] lg:leading-[20px] flex items-center text-center lg:tracking-[0.5em] uppercase lg:mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
        design legends inspired ai review
      </h2>
      <h3 className="font-krona-one font-normal text-[36px] lg:text-[96px] lg:leading-[86px] text-center uppercase text-[#F7EDE2]">
        master mode
      </h3>
      <h4 className="font-roboto-flex font-normal text-[11px] lg:text-[16px] lg:leading-[20px] text-center lg:tracking-[0.15em] text-[#97FFEF] lg:mt-[10px]">
        See your work reimagined through their eyes
      </h4>

      <div className="lg:hidden mt-7">
        {
          mastersNames.map((name, index) => (
            <div key={index} className="flex flex-col items-center justify-center mt-[10px]">
              <span className="font-krona-one font-normal leading-[45px] text-[20px] text-center uppercase text-[#F7EDE2]">
                {name.toUpperCase()}
              </span>
            </div>
          ))
        }
        <div className="text-center mt-10">
          <h1 className="font-krona-one font-normal text-[16px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent uppercase">
            10 MASTERS
          </h1>
          <h2 className="font-roboto-flex font-medium text-[12px] leading-[20px] tracking-[0.15em] text-white">
            each with turn-key playbooks
          </h2>
        </div>

        <div className="text-center mt-10">
          <h1 className="font-krona-one font-normal text-[16px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent uppercase">
            10 AI MENTORS
          </h1>
          <h2 className="font-roboto-flex font-medium text-[12px] leading-[20px] tracking-[0.15em] text-white">
            each with the brain of a master designer
          </h2>
        </div>
      </div>

      <div className="hidden lg:block relative">
        <div className="absolute top-56 -right-36">
          <h1 className="font-krona-one font-normal text-[24px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent uppercase">
            10 MASTERS
          </h1>
          <h2 className="font-roboto-flex font-medium text-[16px] leading-[20px] tracking-[0.15em] text-white">
            each with turn-key playbooks
          </h2>
        </div>
        <div className="absolute bottom-36 -left-48 text-right">
          <h1 className="font-krona-one font-normal text-[24px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent uppercase">
            10 AI MENTORS
          </h1>
          <h2 className="font-roboto-flex font-medium text-[16px] leading-[20px] tracking-[0.15em] text-white">
            each with the brain of a master designer
          </h2>
        </div>
        <Image 
          src="/landing-page/design-masters.png" 
          alt="Design Masters" 
          width={3292} 
          height={5172} 
          className="w-[823px] h-[1293px] mt-[100px]" 
        />
      </div>
      <Image 
        src="/landing-page/dotted-line-4.png" 
        alt="" 
        width={2342} 
        height={1049} 
        className="w-[100%] lg:w-[42%] h-auto mx-auto mt-[63px]" 
      />
    </motion.div>
  )
}
