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
        className="w-auto mx-auto" 
      />
    </div>
  )
}
