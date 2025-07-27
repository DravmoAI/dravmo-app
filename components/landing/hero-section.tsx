"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  return (
    <header className="lg:h-screen flex flex-col items-center lg:justify-center text-center bg-cover bg-center bg-no-repeat relative px-4">
      <Image
        src="/landing-page/dotted-line-1.png"
        alt="Dravmo"
        width={5436}
        height={585}
        className="hidden lg:block w-full lg:w-[97%] lg:h-[146px] absolute top-1/2 translate-y-[-69%] z-0"
      />
      <Image
        src="/landing-page/dotted-line-hero-phone.png"
        alt="Dravmo"
        width={5436}
        height={585}
        className="lg:hidden w-full lg:w-[97%] absolute -top-6 translate-y-[-%] z-0"
      />
      <Image
        src="/dravmo-logo.png"
        alt="Dravmo"
        width={588}
        height={352}
        className="w-[100px] h-[60px] lg:w-[147px] lg:h-[88px] absolute top-[20px] lg:top-[40px] left-1/2 lg:left-[24px] -translate-x-1/2 lg:translate-x-0 z-20"
      />
      <Image
        src="/landing-page/header-image-main.png"
        alt="Dravmo"
        width={3066}
        height={1840}
        className="w-[300px] h-[180px] lg:w-[767px] lg:h-[460px] relative z-10 mt-[102px]"
      />
      <h1 className="text-[14px] lg:text-[20px] leading-[16px] lg:leading-[20px] text-center tracking-[0.3em] lg:tracking-[0.5em] uppercase text-[#F7EDE2] font-quantico -translate-y-16 lg:-translate-y-32 relative z-10 px-4 mt-3">
        AI Design Review Engine
      </h1>
      <div className="hidden lg:flex flex-col lg:flex-row items-center justify-center gap-y-4 lg:gap-y-0 lg:gap-x-[20px] -translate-y-12 lg:-translate-y-24 relative z-10 px-4">
        <Button
          variant="outline"
          onClick={() => router.push("/login")}
          className="w-[150px] h-[50px] bg-[#0F1619] border-[#97FFEF] border rounded-[30px] text-[#97FFEF] hover:bg-[#97FFEF] hover:text-[#0F1619] font-roboto-flex"
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

      {/* Mobile & Tablet navigation buttons */}
      <div className="flex lg:hidden flex-col items-center justify-center gap-y-6 -translate-y-8 relative z-10 px-4">
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

      <div className="hidden lg:flex absolute bottom-0 left-4 right-4 lg:left-[100px] lg:right-[100px] flex-col lg:flex-row justify-between items-start p-6 gap-y-6 lg:gap-y-0">
        <div className="text-left">
          <h2 className="font-krona-one font-normal text-[18px] lg:text-[24px] leading-[18px] lg:leading-[20px] bg-gradient-to-t from-[#5BD5AF] via-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent mb-2">
            NOW
          </h2>
          <div className="font-roboto-flex font-medium text-[12px] lg:text-[15px] leading-[18px] lg:leading-[24px] tracking-[0.15em] text-white">
            <p>every design decision</p>
            <p>you make is backed by a</p>
            <p>'Master-level feedback'</p>
          </div>
        </div>
        <div className="text-left lg:text-right">
          <h2 className="font-krona-one font-normal text-[18px] lg:text-[24px] leading-[18px] lg:leading-[20px] bg-gradient-to-t from-[#5BD5AF] via-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent mb-2">
            PAY $0
          </h2>
          <div className="font-roboto-flex font-medium text-[12px] lg:text-[15px] leading-[18px] lg:leading-[24px] tracking-[0.15em] text-white">
            <p>10 reviews/month</p>
          </div>
        </div>
      </div>
    </header>
  );
}
