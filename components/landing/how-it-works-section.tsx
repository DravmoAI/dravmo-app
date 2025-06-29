"use client"

import Image from "next/image"

export function HowItWorksSection() {
  return (
    <div className="flex flex-col items-center justify-center mt-[451px]">
      <h2 className="font-quantico font-normal text-[20px] leading-[20px] flex items-center text-center tracking-[0.5em] uppercase mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
        take your design to the next level
      </h2>
      <h3 className="font-krona-one font-normal text-[96px] leading-[86px] text-center uppercase text-[#F7EDE2]">
        how it works
      </h3>
      <div className="mt-[80px] mb-[36px] flex items-center justify-center gap-x-[75px]">
        {/* Connect Figma */}
        <div
          className="w-[365px] h-[482px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pt-[20px]"
          style={{
            background: "linear-gradient(156.3deg, #91BBF2 -81.94%, rgba(13, 13, 13, 0.04) 112.13%)",
            boxShadow: "6px 12px 18px -5px rgba(91,213,175,0.14)",
            borderRadius: "30px"
          }}
        >
          <h1 className="h-24 font-krona-one font-normal text-[40px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent leading-10 ml-[34px]">
            connect figma
          </h1>
          <Image 
            src="/landing-page/Figma.png" 
            alt="Dravmo" 
            width={800} 
            height={800} 
            className="mt-[36px] mb-[111px] size-[150px] mx-auto" 
          />
          <div className="flex items-center justify-between gap-x-[51px]">
            <p className="w-[205px] font-quantico font-normal text-[16px] leading-[24px] tracking-[0.15em] text-white ml-[34px]">
              You can also upload JPG and PNG files
            </p>
            <p className="-translate-y-[15px] font-krona-one font-normal text-[96px] leading-[24px] tracking-[0.15em]" style={{ color: "rgba(91,213,175,0.16)" }}>
              1
            </p>
          </div>
        </div>

        {/* Select Project */}
        <div
          className="w-[365px] h-[482px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pt-[20px]"
          style={{
            background: "linear-gradient(156.3deg, #91BBF2 -81.94%, rgba(13, 13, 13, 0.04) 112.13%)",
            boxShadow: "6px 12px 18px -5px rgba(91,213,175,0.14)",
            borderRadius: "30px"
          }}
        >
          <h1 className="h-24 font-krona-one font-normal text-[40px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent leading-10 ml-[34px]">
            select project
          </h1>
          <Image 
            src="/landing-page/Slider.png" 
            alt="Dravmo" 
            width={800} 
            height={800} 
            className="mt-[36px] mb-[111px] size-[150px] mx-auto" 
          />
          <div className="flex items-center justify-between">
            <p className="font-quantico font-normal text-[16px] leading-[24px] tracking-[0.15em] text-white pl-[34px]">
              Add design context for personalized results
            </p>
            <p className="-translate-y-[15px] font-krona-one font-normal text-[96px] leading-[24px] tracking-[0.15em]" style={{ color: "rgba(91,213,175,0.16)" }}>
              2
            </p>
          </div>
        </div>

        {/* Analyze Design */}
        <div
          className="w-[365px] h-[482px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pt-[20px]"
          style={{
            background: "linear-gradient(156.3deg, #91BBF2 -81.94%, rgba(13, 13, 13, 0.04) 112.13%)",
            boxShadow: "6px 12px 18px -5px rgba(91,213,175,0.14)",
            borderRadius: "30px"
          }}
        >
          <h1 className="h-24 font-krona-one font-normal text-[40px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent leading-10 ml-[34px]">
            analyze design
          </h1>
          <Image 
            src="/landing-page/Monitor.png" 
            alt="Dravmo" 
            width={800} 
            height={800} 
            className="mt-[36px] mb-[111px] size-[150px] mx-auto" 
          />
          <div className="flex items-center justify-between">
            <p className="font-quantico font-normal text-[16px] leading-[24px] tracking-[0.15em] text-white ml-[34px]">
              Generate actionable design improvements
            </p>
            <p className="-translate-y-[15px] font-krona-one font-normal text-[96px] leading-[24px] tracking-[0.15em]" style={{ color: "rgba(91,213,175,0.16)" }}>
              3
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
