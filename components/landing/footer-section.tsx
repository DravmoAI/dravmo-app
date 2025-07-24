"use client"

import Image from "next/image"

export function FooterSection() {
  return (
    <footer className="relative font-roboto-flex w-full bg-[#0F1619] py-8 px-4 md:px-8 flex items-center justify-between z-10">
      <Image 
        src="/landing-page/dotted-line-footer.png" 
        alt="Check" 
        width={1268} 
        height={522} 
        className="hidden md:block w-[15%] absolute left-0 bottom-0" 
      />
      <div className="relative flex items-center md:min-w-[250px] md:h-[80px]">
        <span className="relative z-10 text-white text-[12px] md:text-[16px] ml-2 md:ml-6">
          2025 Dravmo Inc.
        </span>
      </div>
      <div className="flex items-center gap-x-12">
        <a href="#" className="text-white text-[12px] md:text-[16px] hover:underline">Terms</a>
        <a href="#" className="text-white text-[12px] md:text-[16px] hover:underline">Privacy</a>
        <a href="#" className="text-white text-[12px] md:text-[16px] hover:underline">Contact</a>
      </div>
    </footer>
  )
}
