"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function HowItWorksSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} id="how-it-works" className="flex flex-col items-center justify-center mt-[75px] lg:mt-[451px]">

      <h2 className="font-quantico font-normal text-[12px] lg:text-[20px] lg:leading-[20px] flex items-center text-center tracking-[0.25em] lg:tracking-[0.5em] uppercase lg:mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
        take your design to the next level
      </h2>
      <h3 className="font-krona-one font-normal text-[36px] lg:text-[96px] lg:leading-[86px] text-center uppercase text-[#F7EDE2]">
        how it works
      </h3>
      <div className="mt-5 md:mt-[80px] mb-[36px] flex flex-col md:flex-row flex-wrap items-center justify-center gap-x-[75px] gap-y-[43px]">

        {/* Connect Figma */}
        <div
          className="w-[276px] lg:w-[365px] h-[365px] lg:h-[482px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pt-[20px] justify-self-center"
          style={{
            background: "linear-gradient(156.3deg, #91BBF2 -81.94%, rgba(13, 13, 13, 0.04) 112.13%)",
            boxShadow: "6px 12px 18px -5px rgba(91,213,175,0.14)",
            borderRadius: "30px"
          }}
        >
          <h1 className="w-32 lg:w-auto h-24 font-krona-one font-normal text-[24px] lg:text-[40px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent leading-7 lg:leading-10 ml-[22px] lg:ml-[34px]">
            connect figma
          </h1>
          <Image 
            src="/landing-page/Figma.png" 
            alt="Dravmo" 
            width={800} 
            height={800} 
            className="lg:mt-[36px] mb-[69px] lg:mb-[111px] size-[100px] lg:size-[150px] mx-auto" 
          />
          <div className="flex items-center justify-between gap-x-[51px]">
            <p className="w-32 lg:w-[205px] font-quantico font-normal text-[12px] lg:text-[16px] lg:leading-[24px] lg:tracking-[0.15em] text-white ml-[22px] lg:ml-[34px]">
              You can also upload JPG and PNG files
            </p>
            <p className="lg:-translate-y-[15px] font-krona-one font-normal text-[64px] lg:text-[96px] leading-[24px] lg:tracking-[0.15em] mr-4 lg:mr-0" style={{ color: "rgba(91,213,175,0.16)" }}>
              1
            </p>
          </div>
        </div>
        {/* Select Project */}
        <div
          className="w-[276px] lg:w-[365px] h-[365px] lg:h-[482px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pt-[20px] justify-self-center"
          style={{
            background: "linear-gradient(156.3deg, #91BBF2 -81.94%, rgba(13, 13, 13, 0.04) 112.13%)",
            boxShadow: "6px 12px 18px -5px rgba(91,213,175,0.14)",
            borderRadius: "30px"
          }}
        >
          <h1 className="w-32 lg:w-auto h-24 font-krona-one font-normal text-[24px] lg:text-[40px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent leading-7 lg:leading-10 ml-[22px] lg:ml-[34px]">
            setup project
          </h1>
          <Image 
            src="/landing-page/Slider.png" 
            alt="Dravmo" 
            width={800} 
            height={800} 
            className="lg:mt-[36px] mb-[69px] lg:mb-[111px] size-[100px] lg:size-[150px] mx-auto" 
          />
          <div className="w-full flex items-center justify-between">
            <p className="w-36 flex-1 lg:w-[238px] font-quantico font-normal text-[12px] lg:text-[16px] lg:leading-[24px] lg:tracking-[0.15em] text-white ml-[22px] lg:ml-[34px]">
              Add design context for personalized results
            </p>
            <p className="lg:-translate-y-[15px] font-krona-one font-normal text-[64px] lg:text-[96px] lg:leading-[24px] lg:tracking-[0.15em] mr-4 lg:mr-0" style={{ color: "rgba(91,213,175,0.16)" }}>
              2
            </p>
          </div>
        </div>
        {/* Analyze Design */}
        <div
          className="w-[276px] lg:w-[365px] h-[365px] lg:h-[482px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pt-[20px] justify-self-center lg:col-span-2 lg:mx-auto"
          style={{
            background: "linear-gradient(156.3deg, #91BBF2 -81.94%, rgba(13, 13, 13, 0.04) 112.13%)",
            boxShadow: "6px 12px 18px -5px rgba(91,213,175,0.14)",
            borderRadius: "30px"
          }}
        >
          <h1 className="w-32 lg:w-auto h-24 font-krona-one font-normal text-[24px] lg:text-[40px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent leading-7 lg:leading-10 ml-[22px] lg:ml-[34px]">
            analyze design
          </h1>
          <Image 
            src="/landing-page/Monitor.png" 
            alt="Dravmo" 
            width={800} 
            height={800} 
            className="lg:mt-[36px] mb-[69px] lg:mb-[111px] size-[100px] lg:size-[150px] mx-auto" 
          />
          <div className="w-full flex items-center justify-between">
            <p className="w-32 lg:w-[235px] font-quantico font-normal text-[12px] lg:text-[16px] lg:leading-[24px] lg:tracking-[0.15em] text-white ml-[22px] lg:ml-[34px]">
              Generate actionable design improvements
            </p>
            <p className="lg:-translate-y-[15px] font-krona-one font-normal text-[64px] lg:text-[96px] leading-[24px] lg:tracking-[0.15em] mr-4 lg:mr-0" style={{ color: "rgba(91,213,175,0.16)" }}>
              3
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
