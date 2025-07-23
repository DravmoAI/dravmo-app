"use client"

import Image from "next/image"

export function FeaturesSection() {
  return (
    <div className="mt-[63px]">
      <Image 
        src="/landing-page/features.png" 
        alt="Features" 
        width={5760} 
        height={2128} 
        className="hidden md:visible w-auto mx-auto" 
      />
      <Image 
        src="/landing-page/feature-phone.png" 
        alt="Features" 
        width={5760} 
        height={2128} 
        className="visible md:hidden w-auto mx-auto" 
      />
    </div>
  )
}
