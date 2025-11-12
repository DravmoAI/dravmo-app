"use client";

import Image from "next/image";
import { FaArrowDown } from "react-icons/fa";

const Step = ({
  iconUrl,
  name,
  title,
}: {
  iconUrl: string;
  name: string;
  title: string;
}) => (
  <div className="flex items-center gap-4 w-full">
    <div className="flex-shrink-0">
      <Image src={iconUrl} alt={name} width={40} height={40} />
    </div>
    <div>
      <h4 className="font-krona-one text-lg text-white">{name}</h4>
      <p className="text-gray-300 text-sm">{title}</p>
    </div>
  </div>
);

export function HowItWorksMobileCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl p-6 sm:p-8 bg-transparent border-2 border-[#84B9FF] shadow-[0_0_20px_5px_rgba(132,185,255,0.2)]">
      <div className="flex flex-col items-center gap-6">
        <Step
          name="Connect Figma"
          title="You can also upload JPG and PNG files"
          iconUrl="/landing-page/Figma.png"
        />
        <FaArrowDown className="text-[#5BD5AF] w-6 h-6" />
        <Step
          name="Setup Project"
          title="Add design context for personalized results"
          iconUrl="/landing-page/Slider.png"
        />
        <FaArrowDown className="text-[#5BD5AF] w-6 h-6" />
        <Step
          name="Analyze Design"
          title="Generate actionable design improvements"
          iconUrl="/landing-page/Monitor.png"
        />
      </div>
    </div>
  );
}