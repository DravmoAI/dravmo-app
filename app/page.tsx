"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react";

export const GradientBorderWrapper = ({
  children,
  gradientDirection = "to-t",
  fromColor = "",
  toColor = "",
  borderWidth = 1,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 rounded-[30px] bg-gradient-${gradientDirection}`}
        style={{
          zIndex: 0,
          background: `linear-gradient(${gradientDirection
            .replace("to-", "")
            .split("")
            .map((c) =>
              c === "t"
                ? "to top"
                : c === "r"
                  ? "to right"
                  : c === "b"
                    ? "to bottom"
                    : c === "l"
                      ? "to left"
                      : ""
            )
            .join(" ")}, ${fromColor}), ${toColor}))`,
        }}
      >
        <div
          className="absolute bg-[#212121] rounded-[29px]"
          style={{
            inset: `${borderWidth}px`,
            borderRadius: `calc(30px - ${borderWidth}px)`,
          }}
        ></div>
      </div>
      <div className="relative w-full h-full" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const basicPlanFeatures = [
    { label: "Unlimited projects", available: true },
    { label: "20 reviews/month", available: true, note: "(daily limit 5)" },
    { label: "Design persona setup", available: true },
    { label: "Layout analysis", available: true },
    { label: "Typography review", available: true },
    { label: "Color theory feedback", available: true },
    { label: "Interactive components", available: false },
    { label: "Imagery analysis", available: false },
    { label: "Micro-interaction feedback", available: false },
    { label: "Data visualization", available: false },
    { label: "WCAG checks", available: false },
    { label: "Master mode", available: false },
    { label: "Figma integration", available: false },
    // { label: "Purchase additional reviews", available: false },
  ];
  
  const proPlanFeatures = [
    { label: "Unlimited projects", available: true },
    { label: "Unlimited", available: true, note: "(20 daily limit)" },
    { label: "Design persona setup", available: true },
    { label: "Layout analysis", available: true },
    { label: "Typography review", available: true },
    { label: "Color theory feedback", available: true },
    { label: "Interactive components", available: true },
    { label: "Imagery analysis", available: true },
    { label: "Micro-interaction feedback", available: true },
    { label: "Data visualization", available: true },
    { label: "WCAG checks", available: true },
    { label: "Master mode", available: true },
    { label: "Figma integration", available: true },
    // { label: "Purchase additional reviews", available: true },
  ];

  const litePlanFeatures = [
    { label: "Unlimited projects", available: true },
    { label: "60 reviews/month", available: true, note: "(no daily limit)" },
    { label: "Design persona setup", available: true },
    { label: "Layout analysis", available: true },
    { label: "Typography review", available: true },
    { label: "Color theory feedback", available: true },
    { label: "Interactive components", available: true },
    { label: "Imagery analysis", available: true },
    { label: "Micro-interaction feedback", available: true },
    { label: "Data visualization", available: true },
    { label: "WCAG checks", available: true },
    { label: "Master mode", available: true },
    { label: "Figma integration", available: true },
    // { label: "Purchase additional reviews", available: true },
  ];




  return (
    <div className="min-h-screen flex flex-col bg-[#0F1619]">
      <nav className="absolute top-[51px] left-1/2 transform -translate-x-1/2 z-30">
        <div className="relative">
          {/* Background rectangle */}

          {/* <GradientBorderWrapper
          fromColor="#5BD5AF"
          toColor="#84B9FF"
          gradientDirection="to-r" */}
          <div
            className="absolute w-[407px] h-[74px] bg-gradient-to-l from-[rgba(242,242,242,0.08)] to-[rgba(13,13,13,0.02)] rounded-[30px] flex justify-center items-center"
            style={{
              boxShadow: '6px 4px 7.5px -4px rgba(91, 213, 175, 0.22)',
              left: 'calc(50% - 407px/2)',
              top: 'calc(50% - 74px/2)'
            }}
          >
            {/* Navigation items */}
            <div className="flex items-center justify-center gap-x-[50px] relative z-10 py-[17px]">
              <a href="#community" className="font-quantico font-normal text-[14px] leading-[20px] text-white text-center flex items-center justify-center">
                Community
              </a>
              <a href="#features" className="font-quantico font-normal text-[14px] leading-[20px] text-white text-center flex items-center justify-center">
                Features
              </a>
              <a href="#plans" className="font-quantico font-normal text-[14px] leading-[20px] text-white text-center flex items-center justify-center">
                Plans
              </a>
            </div>
          {/* </GradientBorderWrapper> */}
          </div>
        </div>
      </nav>
      <header
        className="h-screen flex flex-col items-center justify-center text-center bg-cover bg-center bg-no-repeat relative">
        <Image src="/landing-page/dotted-line-1.png" alt="Dravmo" width={5436} height={585} className="w-[97%] h-[146px] absolute top-1/2 translate-y-[-69%] z-0" />
        <Image src="/dravmo-logo.png" alt="Dravmo" width={588} height={352} className="w-[147px] h-[88px] absolute top-[40px] left-[24px] z-20" />
        <Image src="/landing-page/header-image-main.png" alt="Dravmo" width={3066} height={1840} className="w-[767px] h-[460px] relative z-10" />
        <h1 className="text-[20px] leading-[20px] text-center tracking-[0.5em] uppercase text-[#F7EDE2] font-quantico -translate-y-32 relative z-10">AI Design Review Engine</h1>
        <div className="flex items-center justify-center gap-x-[20px] -translate-y-24 relative z-10">
          <Button variant="outline" className="w-[150px] h-[50px] bg-[#0F1619] border-[#97FFEF] border rounded-[30px] text-[#97FFEF] font-roboto-flex">
            Begin Review
          </Button>
          <Button variant="outline" className="w-[150px] h-[50px] text-[#F7EDE2] border rounded-[30px] border-[#F7EDE2] font-roboto-flex font-medium text-[14px] leading-[20px] tracking-[0.02em] bg-gradient-to-b from-[rgba(145,187,242,0.52)] to-[rgba(13,13,13,0.04)]">
            Access Dashboard
          </Button>
        </div>

        <div className="absolute bottom-0 left-[100px] right-[100px] flex justify-between items-start p-6">
          <div className="text-left">
            <h2 className="font-krona-one font-normal text-[24px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] via-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent mb-2">NOW</h2>
            <div className="font-roboto-flex font-medium text-[15px] leading-[24px] tracking-[0.15em] text-white">
              <p>every design decision</p>
              <p>you make is backed by a</p>
              <p>‘Master-level feedback’</p>
            </div>
          </div>
          <div className="text-left">
            <h2 className="font-krona-one font-normal text-[24px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] via-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent mb-2">PAY $0</h2>
            <div className="font-roboto-flex font-medium text-[15px] leading-[24px] tracking-[0.15em] text-white">
              <p>10 reviews/month</p>
            </div>

          </div>
        </div>

      </header>

      <main className="">
        <Image src="/landing-page/rotated-dotted-line.png" alt="Dravmo" width={5436} height={585} className="w-full h-auto absolute top-full translate-y-[-44%] z-0" />

        {/* how it works */}
        <div className="flex flex-col items-center justify-center mt-[451px]">
          <h2 className="font-quantico font-normal text-[20px] leading-[20px] flex items-center text-center tracking-[0.5em] uppercase mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
            take your design to the next level
          </h2>
          <h3
            className="font-krona-one font-normal text-[96px] leading-[86px] text-center uppercase text-[#F7EDE2]"
          >
            how it works
          </h3>
          <div className="mt-[80px] mb-[36px] flex items-center justify-center gap-x-[75px]">
            {/* connect figma */}
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
              <Image src="/landing-page/Figma.png" alt="Dravmo" width={800} height={800} className="mt-[36px] mb-[111px] size-[150px] mx-auto" />
              <div className="flex items-center justify-between gap-x-[51px]">
                <p className="w-[205px] font-quantico font-normal text-[16px] leading-[24px] tracking-[0.15em] text-white ml-[34px]">
                  You can also upload JPG and PNG files
                </p>
                <p className="-translate-y-[15px] font-krona-one font-normal text-[96px] leading-[24px] tracking-[0.15em]" style={{ color: "rgba(91,213,175,0.16)" }}>
                  1
                </p>
              </div>
            </div>

            {/* select project */}
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
              <Image src="/landing-page/Slider.png" alt="Dravmo" width={800} height={800} className="mt-[36px] mb-[111px] size-[150px] mx-auto" />
              <div className="flex items-center justify-between ">
                <p className="font-quantico font-normal text-[16px] leading-[24px] tracking-[0.15em] text-white pl-[34px]">
                  Add design context for personalized results
                </p>
                <p className="-translate-y-[15px] font-krona-one font-normal text-[96px] leading-[24px] tracking-[0.15em]" style={{ color: "rgba(91,213,175,0.16)" }}>
                  2
                </p>
              </div>
            </div>

            {/* analyze design */}
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
              <Image src="/landing-page/Monitor.png" alt="Dravmo" width={800} height={800} className="mt-[36px] mb-[111px] size-[150px] mx-auto" />
              <div className="flex items-center justify-between ">
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

        <Image src="/landing-page/dotted-line-2.png" alt="Dravmo" width={5436} height={585} className="w-full h-[146px] mt-12" />

        <Image src="/landing-page/features.png" alt="Features" width={5760} height={2128} className="w-auto mx-auto mt-[63px]" />
        {/* master mode */}
        <div className="flex flex-col items-center justify-center mt-[53px] mb-[100px]">
          <Image src="/landing-page/dotted-line-3.png" alt="" width={544} height={5756} className="w-[146px] h-[1440px] absolute top-[3223px] right-0 translate-y-[-44%] z-0" />
          <h2 className="font-quantico font-normal text-[20px] leading-[20px] flex items-center text-center tracking-[0.5em] uppercase mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
            design legends inspired ai review          </h2>
          <h3
            className="font-krona-one font-normal text-[96px] leading-[86px] text-center uppercase text-[#F7EDE2]"
          >
            master mode
          </h3>
          <h4
            className="font-['Roboto_Flex'] font-normal text-[16px] leading-[20px] text-center tracking-[0.15em] text-[#97FFEF] mt-[10px]"
          >
            See your work reimagined through their eyes
          </h4>

          <div className="relative">
            <div className="absolute top-56 -right-36">
              <h1 className="font-krona-one font-normal text-[24px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent uppercase">
                10 MASTERS
              </h1>
              <h2
                className="font-['Roboto_Flex'] font-medium text-[16px] leading-[20px] tracking-[0.15em] text-white"
              >
                each with turn-key playbooks
              </h2>
            </div>
            <div className="absolute bottom-36 -left-48 text-right">
              <h1 className="font-krona-one font-normal text-[24px] leading-[20px] bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent uppercase">
                10 AI MENTORS
              </h1>
              <h2
                className="font-['Roboto_Flex'] font-medium text-[16px] leading-[20px] tracking-[0.15em] text-white"
              >
                each with the brain of a master designer            </h2>
            </div>
            <Image src="/landing-page/design-masters.png" alt="Desing Masters" width={3292} height={5172} className="w-[823px] h-[1293px] mt-[100px]" />

          </div>
          <Image src="/landing-page/dotted-line-4.png" alt="" width={2342} height={1049} className="w-[42%] h-auto mx-auto mt-[63px]" />
        </div>

        {/* plans */}
        <div className="flex flex-col items-center justify-center mt-[53px] mb-[100px] font-poppins">
          <h2 className="font-quantico font-normal text-[20px] leading-[20px] flex items-center text-center tracking-[0.5em] uppercase mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
            save 20% on yearly subscription
          </h2>
          <h3
            className="font-krona-one font-normal text-[96px] leading-[116px] text-center uppercase text-[#F7EDE2] mb-[30px]"
          >
            plans
          </h3>
          <div className="mx-auto flex items-center justify-center gap-x-2">
            <span className="font-roboto-flex font-medium text-[14px] leading-[14px] text-[#97FFEF] ">Monthly</span>
           <label className="switch">
            <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(!isYearly)} />
            <span className="slider round"></span>
          </label>
            <span className="font-roboto-flex font-medium text-[14px] leading-[14px] text-[#97FFEF] ">Yearly</span>
          </div>
          <div className="relative flex items-center justify-center gap-x-[52px] mt-[62px]">
            {/* Basic */}
            <div
              className="w-[516px] h-[953px] border-[9px] border-[#84B9FF] border-solid rounded-[30px] bg-[#0D1B2A]  px-[32px]"
            >
              <div className="flex justify-between items-start w-full">
                <div className="mt-[82px]">
                  <h1 className="font-krona-one font-normal text-[48px] leading-[48px] text-[#F7EDE2]">Basic</h1>
                  <h2><i className="text-[14px] font-light">for</i> Students & Trials</h2>
                </div>
                <div className="w-auto leading-none mt-[67px]">
                  <h1
                    className="font-quantico font-bold text-[96px] text-right text-[#5BD5AF]"
                  >$0</h1>
                  <h2
                    className="font-poppins font-light text-[20px] text-right tracking-[0.02em] text-[#97FFEF]"
                  >
                    monthly
                  </h2>
                </div>
              </div>
              <ul className="mt-[70px] space-y-4 text-[18px] font-poppins font-semibold">
                {basicPlanFeatures.map((item, idx) => (
                  <li key={idx} className={`flex gap-[23px] items-start mt-[10px] text-[20px] ${item.available ? 'text-[#F7EDE2]' : 'text-[#A0AEC0]'}`}>
                    <span className={`text-xl mt-[2px] ${item.available ? 'visible' : 'invisible'}`}>
                      <Image src="/Tick-circle.png" alt="Check" width={24} height={24} />
                    </span>
                    <span>
                      {item.label}
                      {item.note && (
                        <span className="italic text-sm font-normal text-[#5BD5AF] pl-1">{item.note}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div
              className="w-[516px] h-[953px] border-[9px] border-[#97FFEF] border-solid rounded-[30px] bg-[#0F1619]  px-[32px]"
            >
              <div className="flex justify-between items-start w-full">
                <div className="mt-[82px]">
                  <h1 className="font-krona-one font-normal text-[48px] leading-[48px] text-[#F7EDE2]">{isUnlimited ? "Pro" : "Lite"}</h1>
                  <h2><i className="text-[14px] font-light">for</i> {isUnlimited ? "Design Professionals" : "Design Enthusiasts"}</h2>
                  <div className="flex items-center justify-center gap-x-5 translate-y-2">
                    <p className="italic text-base font-normal text-[#5BD5AF] -ml-3">Go Unlimited</p>
                    <div className="checkbox">
                      <input
                        className="tgl"
                        id="toggle"
                        type="checkbox"
                        checked={isUnlimited}
                        onChange={() => setIsUnlimited(!isUnlimited)}
                      />
                      <label className="tgl-btn" htmlFor="toggle"></label>
                    </div>
                  </div>
                </div>
                <div className="w-auto leading-none mt-[67px]">
                  <h1
                    className="font-quantico font-bold text-[96px] text-right text-[#5BD5AF]"
                  >
                    ${isUnlimited ? (isYearly ? 28 : 35) : (isYearly ? 12 : 15)}
                  </h1>
                  <h2
                    className="font-poppins font-light text-[20px] text-right tracking-[0.02em] text-[#97FFEF]"
                  >
                    monthly
                  </h2>
                </div>
              </div>

              {/* Feature list */}
              <ul className="mt-[70px] space-y-4 text-[18px] font-poppins font-semibold">
                {(isUnlimited ? proPlanFeatures : litePlanFeatures).map((item, idx) => (
                  <li key={idx} className={`flex gap-[23px] items-start mt-[10px] text-[20px] ${item.available ? 'text-[#F7EDE2]' : 'text-[#A0AEC0]'}`}>
                    <span className={`text-xl mt-[2px] ${item.available ? 'visible' : 'invisible'}`}>
                      <Image src="/Tick-circle.png" alt="Check" width={24} height={24} />
                    </span>
                    <span>
                      {item.label}
                      {item.note && (
                        <span className="italic text-[15px] font-normal text-[#5BD5AF] pl-1">{item.note}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </main>

      <footer className="relative font-roboto-flex w-full bg-[#0F1619] py-8 px-8 flex items-center justify-between z-10">
        <Image src="/landing-page/dotted-line-footer.png" alt="Check" width={1268} height={522} className="w-[15%] absolute left-0 bottom-0" />
        <div className="relative flex items-center min-w-[250px] h-[80px]">
          <span className="relative z-10 text-white text-[16px] ml-6">
            2025 Dravmo Inc.
          </span>
        </div>
        <div className="flex items-center gap-x-12">
          <a href="#" className="text-white text-[16px] hover:underline">Terms</a>
          <a href="#" className="text-white text-[16px] hover:underline">Privacy</a>
          <a href="#" className="text-white text-[16px] hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  )
}
