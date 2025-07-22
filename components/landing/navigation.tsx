"use client"

import Image from "next/image"

export function Navigation() {
  return (
    <nav className="absolute top-[51px] left-1/2 transform -translate-x-1/2 z-30 hidden md:block">
      <div className="relative">
        <div
          className="absolute w-[407px] h-[74px] bg-gradient-to-l from-[rgba(242,242,242,0.08)] to-[rgba(13,13,13,0.02)] rounded-[30px] flex justify-center items-center"
          style={{
            boxShadow: '6px 4px 7.5px -4px rgba(91, 213, 175, 0.22)',
            left: 'calc(50% - 407px/2)',
            top: 'calc(50% - 74px/2)'
          }}
        >
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
        </div>
      </div>
    </nav>
  )
}
