"use client"

import Image from "next/image"

export function MasterModeSection() {
  return (
    <div className="flex flex-col items-center justify-center mt-[53px] mb-[100px]">
      <Image 
        src="/landing-page/dotted-line-3.png" 
        alt="" 
        width={544} 
        height={5756} 
        className="w-[146px] h-[1440px] absolute top-[3223px] right-0 translate-y-[-44%] z-0" 
      />
      <h2 className="font-quantico font-normal text-[20px] leading-[20px] flex items-center text-center tracking-[0.5em] uppercase mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
        design legends inspired ai review
      </h2>
      <h3 className="font-krona-one font-normal text-[96px] leading-[86px] text-center uppercase text-[#F7EDE2]">
        master mode
      </h3>
      <h4 className="font-['Roboto_Flex'] font-normal text-[16px] leading-[20px] text-center tracking-[0.15em] text-[#97FFEF] mt-[10px]">
        See your work reimagined through their eyes
      </h4>

      <div className="relative">
        <div className="absolute top-56 -right-36">
          <h1 className="font-krona-one font-normal text-[24px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent uppercase">
            10 MASTERS
          </h1>
          <h2 className="font-['Roboto_Flex'] font-medium text-[16px] leading-[20px] tracking-[0.15em] text-white">
            each with turn-key playbooks
          </h2>
        </div>
        <div className="absolute bottom-36 -left-48 text-right">
          <h1 className="font-krona-one font-normal text-[24px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent uppercase">
            10 AI MENTORS
          </h1>
          <h2 className="font-['Roboto_Flex'] font-medium text-[16px] leading-[20px] tracking-[0.15em] text-white">
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
        className="w-[42%] h-auto mx-auto mt-[63px]" 
      />
    </div>
  )
}
