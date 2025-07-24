"use client"

import Image from "next/image"

export function HowItWorksSection() {
  return (
    <div id="how-it-works" className="flex flex-col items-center justify-center mt-[75px] md:mt-[451px]">

      <h2 className="font-quantico font-normal text-[12px] md:text-[20px] md:leading-[20px] flex items-center text-center tracking-[0.25em] md:tracking-[0.5em] uppercase md:mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
        take your design to the next level
      </h2>
      <h3 className="font-krona-one font-normal text-[36px] md:text-[96px] md:leading-[86px] text-center uppercase text-[#F7EDE2]">
        how it works
      </h3>
      <div className="mt-5 md:mt-[80px] mb-[36px] flex flex-col md:flex-row items-center justify-center gap-x-[75px] gap-y-[43px] md:gap-y-0">
        {/* Connect Figma */}
        <div
          className="w-[276px] md:w-[365px] h-[365px] md:h-[482px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pt-[20px]"
          style={{
            background: "linear-gradient(156.3deg, #91BBF2 -81.94%, rgba(13, 13, 13, 0.04) 112.13%)",
            boxShadow: "6px 12px 18px -5px rgba(91,213,175,0.14)",
            borderRadius: "30px"
          }}
        >
          <h1 className="w-32 md:w-auto h-24 font-krona-one font-normal text-[24px] md:text-[40px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent leading-7 md:leading-10 ml-[22px] md:ml-[34px]">
            connect figma
          </h1>
          <Image 
            src="/landing-page/Figma.png" 
            alt="Dravmo" 
            width={800} 
            height={800} 
            className="md:mt-[36px] mb-[69px] md:mb-[111px] size-[100px] md:size-[150px] mx-auto" 
          />
          <div className="flex items-center justify-between gap-x-[51px]">
            <p className="w-32 md:w-[205px] font-quantico font-normal text-[12px] md:text-[16px] md:leading-[24px] md:tracking-[0.15em] text-white ml-[22px] md:ml-[34px]">
              You can also upload JPG and PNG files
            </p>
            <p className="md:-translate-y-[15px] font-krona-one font-normal text-[64px] md:text-[96px] text-[96px] leading-[24px] md:tracking-[0.15em] mr-4 md:mr-0" style={{ color: "rgba(91,213,175,0.16)" }}>
              1
            </p>
          </div>
        </div>

        {/* Select Project */}
        <div
          className="w-[276px] md:w-[365px] h-[365px] md:h-[482px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pt-[20px]"
          style={{
            background: "linear-gradient(156.3deg, #91BBF2 -81.94%, rgba(13, 13, 13, 0.04) 112.13%)",
            boxShadow: "6px 12px 18px -5px rgba(91,213,175,0.14)",
            borderRadius: "30px"
          }}
        >
          <h1 className="w-32 md:w-auto h-24 font-krona-one font-normal text-[24px] md:text-[40px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent leading-7 md:leading-10 ml-[22px] md:ml-[34px]">
            select project
          </h1>
          <Image 
            src="/landing-page/Figma.png" 
            alt="Dravmo" 
            width={800} 
            height={800} 
            className="md:mt-[36px] mb-[69px] md:mb-[111px] size-[100px] md:size-[150px] mx-auto" 
          />
          <div className="w-full flex items-center justify-between md:gap-x-[51px]">
            <p className="w-36 flex-1 md:w-[238px] font-quantico font-normal text-[12px] md:text-[16px] md:leading-[24px] md:tracking-[0.15em] text-white ml-[22px] md:ml-[34px]">
              Add design context for personalized results
            </p>
            <p className="md:-translate-y-[15px] font-krona-one font-normal text-[64px] md:text-[96px] md:leading-[24px] md:tracking-[0.15em] mr-4 md:mr-0" style={{ color: "rgba(91,213,175,0.16)" }}>
              2
            </p>
          </div>
        </div>
        {/* Analyze Design */}
         <div
          className="w-[276px] md:w-[365px] h-[365px] md:h-[482px] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pt-[20px]"
          style={{
            background: "linear-gradient(156.3deg, #91BBF2 -81.94%, rgba(13, 13, 13, 0.04) 112.13%)",
            boxShadow: "6px 12px 18px -5px rgba(91,213,175,0.14)",
            borderRadius: "30px"
          }}
        >
          <h1 className="w-32 md:w-auto h-24 font-krona-one font-normal text-[24px] md:text-[40px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent leading-7 md:leading-10 ml-[22px] md:ml-[34px]">
            analyze design
          </h1>
          <Image 
            src="/landing-page/Figma.png" 
            alt="Dravmo" 
            width={800} 
            height={800} 
            className="md:mt-[36px] mb-[69px] md:mb-[111px] size-[100px] md:size-[150px] mx-auto" 
          />
          <div className="flex items-center justify-between gap-x-[51px]">
            <p className="w-32 md:w-[205px] font-quantico font-normal text-[12px] md:text-[16px] md:leading-[24px] md:tracking-[0.15em] text-white ml-[22px] md:ml-[34px]">
              Generate actionable design improvements
            </p>
            <p className="md:-translate-y-[15px] font-krona-one font-normal text-[64px] md:text-[96px] leading-[24px] md:tracking-[0.15em] mr-4 md:mr-0" style={{ color: "rgba(91,213,175,0.16)" }}>
              3
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
