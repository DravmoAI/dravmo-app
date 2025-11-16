"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaDiscord, FaTwitter, FaGithub } from "react-icons/fa";

export default function MaintenancePage() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1619] relative overflow-hidden">
      {/* Background decorative elements */}
      <Image
        src="/landing-page/dotted-line-1.png"
        alt="Dravmo"
        width={5436}
        height={585}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-auto opacity-20 z-0"
      />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/dravmo-logo.png"
            alt="Dravmo"
            width={588}
            height={352}
            className="w-[120px] h-[72px] lg:w-[147px] lg:h-[88px] mx-auto"
          />
        </div>

        {/* Main content */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-6xl font-krona-one font-normal mb-6 bg-gradient-to-t from-[#5BD5AF] via-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
            UNDER MAINTENANCE
          </h1>
          
          <p className="text-[#F7EDE2] text-lg lg:text-xl font-roboto mb-8 max-w-2xl mx-auto leading-relaxed">
            We're currently performing website maintenance to improve your experience. 
            We'll be back online shortly with enhanced features and performance.
          </p>


          {/* Status updates */}
          <div className="bg-[#0F1619] border border-[#5BD5AF]/30 rounded-[20px] p-6 mb-8">
            <h4 className="text-[#5BD5AF] font-quantico text-sm tracking-[0.2em] uppercase mb-6 text-center">
              What We're Working On
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-4">
              <div className="bg-[#5BD5AF]/10 border border-[#5BD5AF]/30 rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#5BD5AF] rounded-full animate-pulse"></div>
                <span className="text-[#F7EDE2] font-roboto text-sm">Database optimization</span>
              </div>
              <div className="bg-[#5BD5AF]/10 border border-[#5BD5AF]/30 rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#5BD5AF] rounded-full animate-pulse delay-500"></div>
                <span className="text-[#F7EDE2] font-roboto text-sm">Payment system updates</span>
              </div>
              <div className="bg-[#5BD5AF]/10 border border-[#5BD5AF]/30 rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#5BD5AF] rounded-full animate-pulse delay-1000"></div>
                <span className="text-[#F7EDE2] font-roboto text-sm">Figma integration</span>
              </div>
              <div className="bg-[#5BD5AF]/10 border border-[#5BD5AF]/30 rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#5BD5AF] rounded-full animate-pulse delay-1500"></div>
                <span className="text-[#F7EDE2] font-roboto text-sm">Performance enhancements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 mb-12">
          <Button
            onClick={() => window.location.reload()}
            className="w-[200px] h-[50px] bg-[#5BD5AF] text-[#0F1619] font-roboto-flex font-medium rounded-[30px] hover:bg-[#4BC49F] transition-colors"
          >
            Check Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("https://discord.gg/6XEZDwCDSk", "_blank")}
            className="w-[200px] h-[50px] text-[#F7EDE2] border-2 rounded-[30px] border-[#F7EDE2] font-roboto-flex font-medium bg-gradient-to-b from-[rgba(145,187,242,0.52)] to-[rgba(13,13,13,0.04)] hover:from-[rgba(145,187,242,0.7)] hover:to-[rgba(13,13,13,0.1)] transition-all"
          >
            <FaDiscord className="inline-block mr-2" />
            Join Discord
          </Button>
        </div>

        {/* Footer text */}
        <div className="text-center pb-8">
          <p className="text-[#F7EDE2]/60 font-roboto text-sm">
            Thank you for your patience. We're working hard to bring you the best experience.
          </p>
          <p className="text-[#5BD5AF] font-roboto text-sm mt-2">
            Contact us at{" "}
            <a href="mailto:support@dravmo.com" className="hover:underline">
              support@dravmo.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
