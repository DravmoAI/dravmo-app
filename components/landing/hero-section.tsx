"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  return (
    <header className="md:h-screen flex flex-col items-center md:justify-center text-center bg-cover bg-center bg-no-repeat relative px-4">
      <Image
        src="/landing-page/dotted-line-1.png"
        alt="Dravmo"
        width={5436}
        height={585}
        className="hidden md:block w-full md:w-[97%] md:h-[146px] absolute top-1/2 translate-y-[-69%] z-0"
      />
      <Image
        src="/landing-page/dotted-line-hero-phone.png"
        alt="Dravmo"
        width={5436}
        height={585}
        className="md:hidden w-full md:w-[97%] absolute -top-6 translate-y-[-%] z-0"
      />
      <Image
        src="/dravmo-logo.png"
        alt="Dravmo"
        width={588}
        height={352}
        className="w-[100px] h-[60px] md:w-[147px] md:h-[88px] absolute top-[20px] md:top-[40px] left-1/2 md:left-[24px] -translate-x-1/2 md:translate-x-0 z-20"
      />
      <Image
        src="/landing-page/header-image-main.png"
        alt="Dravmo"
        width={3066}
        height={1840}
        className="w-[300px] h-[180px] md:w-[767px] md:h-[460px] relative z-10 mt-[102px]"
      />
      <h1 className="text-[14px] md:text-[20px] leading-[16px] md:leading-[20px] text-center tracking-[0.3em] md:tracking-[0.5em] uppercase text-[#F7EDE2] font-quantico -translate-y-16 md:-translate-y-32 relative z-10 px-4">
        AI Design Review Engine
      </h1>
      <div className="hidden md:flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-y-0 md:gap-x-[20px] -translate-y-12 md:-translate-y-24 relative z-10 px-4">
        <Button
          variant="outline"
          onClick={() => router.push("/login")}
          className="w-[150px] h-[50px] bg-[#0F1619] border-[#97FFEF] border rounded-[30px] text-[#97FFEF] font-roboto-flex"
        >
          Begin Review
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/login")}
          className="w-[150px] h-[50px] text-[#F7EDE2] border rounded-[30px] border-[#F7EDE2] font-roboto-flex font-medium text-[14px] leading-[20px] tracking-[0.02em] bg-gradient-to-b from-[rgba(145,187,242,0.52)] to-[rgba(13,13,13,0.04)]"
        >
          Access Dashboard
        </Button>
      </div>

      {/* Mobile-only navigation buttons */}
      <div className="flex md:hidden flex-col items-center justify-center gap-y-6 -translate-y-8 relative z-10 px-4">
        <Button
          variant="outline"
          onClick={() => {
            const section = document.getElementById('how-it-works');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-[250px] h-[50px] bg-transparent border-[#97FFEF] border-2 rounded-[30px] text-[#97FFEF] font-roboto-flex hover:bg-[#97FFEF] hover:text-[#0F1619] transition-colors"
        >
          How It Works
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const section = document.getElementById('features');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-[250px] h-[50px] text-[#F7EDE2] border-2 rounded-[30px] border-[#F7EDE2] font-roboto-flex font-medium text-[14px] leading-[20px] tracking-[0.02em] bg-gradient-to-b from-[rgba(145,187,242,0.52)] to-[rgba(13,13,13,0.04)] hover:bg-gradient-to-b hover:from-[rgba(145,187,242,0.7)] hover:to-[rgba(13,13,13,0.1)] transition-all"
        >
          Explore Features
        </Button>
        <Button
          onClick={() => {
            const section = document.getElementById('plans');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-[250px] h-[50px] bg-[#5BD5AF] text-[#0F1619] font-roboto-flex font-medium rounded-[30px] hover:bg-[#4BC49F] transition-colors"
        >
          See Plans
        </Button>
      </div>

      <div className="hidden md:flex absolute bottom-0 left-4 right-4 md:left-[100px] md:right-[100px] flex-col md:flex-row justify-between items-start p-6 gap-y-6 md:gap-y-0">
        <div className="text-left">
          <h2 className="font-krona-one font-normal text-[18px] md:text-[24px] leading-[18px] md:leading-[20px] bg-gradient-to-t from-[#5BD5AF] via-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent mb-2">
            NOW
          </h2>
          <div className="font-roboto-flex font-medium text-[12px] md:text-[15px] leading-[18px] md:leading-[24px] tracking-[0.15em] text-white">
            <p>every design decision</p>
            <p>you make is backed by a</p>
            <p>'Master-level feedback'</p>
          </div>
        </div>
        <div className="text-left md:text-right">
          <h2 className="font-krona-one font-normal text-[18px] md:text-[24px] leading-[18px] md:leading-[20px] bg-gradient-to-t from-[#5BD5AF] via-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent mb-2">
            PAY $0
          </h2>
          <div className="font-roboto-flex font-medium text-[12px] md:text-[15px] leading-[18px] md:leading-[24px] tracking-[0.15em] text-white">
            <p>10 reviews/month</p>
          </div>
        </div>
      </div>
    </header>
  );
}
