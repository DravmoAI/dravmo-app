"use client";

import Image from "next/image";
import { useState } from "react";

interface PlanFeature {
  label: string;
  available: boolean;
  note?: string;
}

interface PricingSectionProps {
  basicPlanFeatures: PlanFeature[];
  proPlanFeatures: PlanFeature[];
  litePlanFeatures: PlanFeature[];
}

export function PricingSection({
  basicPlanFeatures,
  proPlanFeatures,
  litePlanFeatures,
}: PricingSectionProps) {
  const [isPro, setIsPro] = useState(false);
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div id="plans" className="flex flex-col items-center justify-center mt-[53px] mb-[100px] font-poppins">
      <h2 className="font-quantico font-normal text-[12px] lg:text-[20px] lg:leading-[20px] flex items-center text-center lg:tracking-[0.5em] uppercase lg:mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
        save 20% on yearly subscription
      </h2>
      <h3 className="font-krona-one font-normal text-[36px] lg:text-[96px] lg:leading-[116px] text-center uppercase text-[#F7EDE2] mb-[30px]">
        plans
      </h3>
      <div className="mx-auto flex items-center justify-center gap-x-2">
        <span className="font-roboto-flex font-medium text-[12px] lg:text-[14px] leading-[14px] text-[#F7EDE2]">
          Monthly
        </span>
        <label className="switch">
          <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(!isYearly)} />
          <span className="slider round"></span>
        </label>
        <span className="font-roboto-flex font-medium text-[12px] lg:text-[14px] leading-[14px] text-[#97FFEF]">
          Yearly
        </span>
      </div>

      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-x-[52px] gap-y-[45px] lg:gap-y-0 mt-[62px]">
        {/* Basic Plan */}
        <div className="w-[330px] h-[609px] lg:w-[516px] lg:h-[953px] border-[9px] border-[#84B9FF] border-solid rounded-[30px] bg-[#0D1B2A] px-[32px]">
          <div className="flex justify-between items-start w-full">
            <div className="mt-[52px] lg:mt-[82px]">
              <h1 className="font-krona-one font-normal text-[32px] lg:text-[48px] lg:leading-[48px] text-[#F7EDE2]">
                Basic
              </h1>
              <h2 className="font-poppins text-[14px] ">
                <i className="text-[14px] lg:text-[14px] font-light">for</i> Students & Trials
              </h2>
            </div>
            <div className="w-auto leading-none mt-[59px] lg:mt-[67px]">
              <h1 className="font-quantico font-bold text-[48px] lg:text-[96px] text-right text-[#5BD5AF]">$0</h1>
              <h2 className="font-poppins font-light text-[12px] lg:text-[20px] text-right tracking-[0.02em] text-[#97FFEF]">
                monthly
              </h2>
            </div>
          </div>
          <ul className="mt-[44px] lg:mt-[70px] space-y-3 lg:space-y-4 text-[18px] font-poppins font-semibold">
            {basicPlanFeatures.map((item, idx) => (
              <li
                key={idx}
                className={`flex gap-[15px] lg:gap-[23px] items-start lg:mt-[10px] text-[12px] lg:text-[20px] ${
                  item.available ? "text-[#F7EDE2]" : "text-[#A0AEC0]"
                }`}
              >
                <span className={`text-xl mt-[2px] ${item.available ? "visible" : "invisible"}`}>
                  <Image src="/Tick-Circle.png" alt="Check" width={24} height={24} className="size-[15px] lg:size-[24px]" />
                </span>
                <span>
                  {item.label}
                  {item.note && (
                    <span className="italic text-sm font-normal text-[#5BD5AF] pl-1">
                      {item.note}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro/Lite Plan */}
        <div className="w-[337px] h-[609px] lg:w-[516px] lg:h-[953px] border-[9px] border-[#97FFEF] border-solid rounded-[30px] bg-[#0F1619] px-[20px] lg:px-[32px]">
          <div className="flex justify-between items-start w-full">
            <div className="mt-[52px] lg:mt-[82px]">
              <h1 className="font-krona-one font-normal text-[32px] lg:text-[48px] lg:leading-[48px] text-[#F7EDE2]">
                {isPro ? "Pro" : "Lite"}
              </h1>
              <h2 className="font-poppins text-[14px] ">
                <i className="text-[14px] font-light mr-1">for</i>{" "}
                {isPro ? "Design Professionals" : "Design Enthusiasts"}
              </h2>
              <div className="flex items-center justify-start gap-x-3 lg:gap-x-5 translate-y-2">
                <p className="italic text-sm lg:text-base font-normal text-[#5BD5AF]">
                  {isPro ? "Go Lite" : "Go Pro"}
                </p>
                <div className="checkbox select-none">
                  <input
                    className="tgl select-none"
                    id="toggle"
                    type="checkbox"
                    checked={isPro}
                    onChange={() => setIsPro(!isPro)}
                  />
                  <label className="tgl-btn" htmlFor="toggle"></label>
                </div>
              </div>
            </div>
            <div className="w-auto leading-none mt-[59px] lg:mt-[67px]">
              <h1 className="font-quantico font-bold text-[48px] lg:text-[96px] text-right text-[#5BD5AF]">
                ${isPro ? (isYearly ? 28 : 35) : isYearly ? 12 : 15}
              </h1>
              <h2 className="font-poppins font-light text-[12px] lg:text-[20px] text-right tracking-[0.02em] text-[#97FFEF]">
                monthly
              </h2>
            </div>
          </div>

          <ul className="mt-[44px] lg:mt-[70px] space-y-3 lg:space-y-4 text-[18px] font-poppins font-semibold">
            {(isPro ? proPlanFeatures : litePlanFeatures).map((item, idx) => (
              <li
                key={idx}
                className={`flex gap-[15px] lg:gap-[23px] items-start lg:mt-[10px] text-[12px] lg:text-[20px] ${
                  item.available ? "text-[#F7EDE2]" : "text-[#A0AEC0]"
                }`}
              >
                <span className={`text-xl mt-[2px] ${item.available ? "visible" : "invisible"}`}>
                  <Image src="/Tick-Circle.png" alt="Check" width={24} height={24} className="size-[15px] lg:size-[24px]" />
                </span>
                <span>
                  {item.label}
                  {item.note && (
                    <span className="italic text-sm lg:text-[15px] font-normal text-[#5BD5AF] pl-1">
                      {item.note}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
