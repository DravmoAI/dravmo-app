"use client"

import Image from "next/image"
import { useState } from "react"

interface PlanFeature {
  label: string
  available: boolean
  note?: string
}

interface PricingSectionProps {
  basicPlanFeatures: PlanFeature[]
  proPlanFeatures: PlanFeature[]
  litePlanFeatures: PlanFeature[]
}

export function PricingSection({ basicPlanFeatures, proPlanFeatures, litePlanFeatures }: PricingSectionProps) {
  const [isUnlimited, setIsUnlimited] = useState(false)
  const [isYearly, setIsYearly] = useState(true)

  return (
    <div className="flex flex-col items-center justify-center mt-[53px] mb-[100px] font-poppins">
      <h2 className="font-quantico font-normal text-[20px] leading-[20px] flex items-center text-center tracking-[0.5em] uppercase mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
        save 20% on yearly subscription
      </h2>
      <h3 className="font-krona-one font-normal text-[96px] leading-[116px] text-center uppercase text-[#F7EDE2] mb-[30px]">
        plans
      </h3>
      <div className="mx-auto flex items-center justify-center gap-x-2">
        <span className="font-roboto-flex font-medium text-[14px] leading-[14px] text-[#97FFEF]">Monthly</span>
        <label className="switch">
          <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(!isYearly)} />
          <span className="slider round"></span>
        </label>
        <span className="font-roboto-flex font-medium text-[14px] leading-[14px] text-[#97FFEF]">Yearly</span>
      </div>
      
      <div className="relative flex items-center justify-center gap-x-[52px] mt-[62px]">
        {/* Basic Plan */}
        <div className="w-[516px] h-[953px] border-[9px] border-[#84B9FF] border-solid rounded-[30px] bg-[#0D1B2A] px-[32px]">
          <div className="flex justify-between items-start w-full">
            <div className="mt-[82px]">
              <h1 className="font-krona-one font-normal text-[48px] leading-[48px] text-[#F7EDE2]">Basic</h1>
              <h2><i className="text-[14px] font-light">for</i> Students & Trials</h2>
            </div>
            <div className="w-auto leading-none mt-[67px]">
              <h1 className="font-quantico font-bold text-[96px] text-right text-[#5BD5AF]">$0</h1>
              <h2 className="font-poppins font-light text-[20px] text-right tracking-[0.02em] text-[#97FFEF]">monthly</h2>
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

        {/* Pro/Lite Plan */}
        <div className="w-[516px] h-[953px] border-[9px] border-[#97FFEF] border-solid rounded-[30px] bg-[#0F1619] px-[32px]">
          <div className="flex justify-between items-start w-full">
            <div className="mt-[82px]">
              <h1 className="font-krona-one font-normal text-[48px] leading-[48px] text-[#F7EDE2]">
                {isUnlimited ? "Pro" : "Lite"}
              </h1>
              <h2>
                <i className="text-[14px] font-light">for</i> {isUnlimited ? "Design Professionals" : "Design Enthusiasts"}
              </h2>
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
              <h1 className="font-quantico font-bold text-[96px] text-right text-[#5BD5AF]">
                ${isUnlimited ? (isYearly ? 28 : 35) : (isYearly ? 12 : 15)}
              </h1>
              <h2 className="font-poppins font-light text-[20px] text-right tracking-[0.02em] text-[#97FFEF]">monthly</h2>
            </div>
          </div>

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
  )
}
