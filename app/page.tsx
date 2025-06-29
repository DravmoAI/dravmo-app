"use client"
import Image from "next/image"
import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { MasterModeSection } from "@/components/landing/master-mode-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FooterSection } from "@/components/landing/footer-section"

export default function LandingPage() {
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
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1619]">
      <Navigation />
      <HeroSection />
      
      <main className="">
        <Image 
          src="/landing-page/rotated-dotted-line.png" 
          alt="Dravmo" 
          width={5436} 
          height={585} 
          className="w-full h-auto absolute top-full translate-y-[-44%] z-0" 
        />
        
        <HowItWorksSection />
        
        <Image 
          src="/landing-page/dotted-line-2.png" 
          alt="Dravmo" 
          width={5436} 
          height={585} 
          className="w-full h-[146px] mt-12" 
        />
        
        <FeaturesSection />
        <MasterModeSection />
        
        <PricingSection 
          basicPlanFeatures={basicPlanFeatures}
          proPlanFeatures={proPlanFeatures}
          litePlanFeatures={litePlanFeatures}
        />
      </main>

      <FooterSection />
    </div>
  )
}
