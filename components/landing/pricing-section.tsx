"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";

interface PlanFeature {
  label: string;
  available: boolean;
  note?: string;
}

interface PricingSectionProps {
  basicPlanFeatures: PlanFeature[];
  proPlanFeatures: PlanFeature[];
  litePlanFeatures: PlanFeature[];
}

function AnimatedPrice({ price }: { price: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, price, {
      duration: 0.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [price, count]);

  return <motion.span>{rounded}</motion.span>;
}

const PricingCard = ({
  planName,
  description,
  price,
  billingCycle,
  features,
  isPopular = false,
}: {
  planName: string;
  description: string;
  price: number;
  billingCycle: string;
  features: PlanFeature[];
  isPopular?: boolean;
}) => {
  const cardVariants: any = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5, scale: 1.01, transition: { type: "spring", stiffness: 150 } }}
      className={`relative w-full max-w-sm rounded-3xl p-8 bg-transparent border-2 ${
        isPopular ? "border-[#97FFEF]" : "border-[#84B9FF]"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#97FFEF] text-[#0F1619] px-4 py-1 rounded-full text-sm font-bold font-quantico">
          MOST POPULAR
        </div>
      )}
      <h3 className="font-krona-one text-3xl lg:text-4xl text-[#F7EDE2]">{planName}</h3>
      <p className="font-poppins text-base text-gray-300 mt-2 h-10">{description}</p>

      <div className="mt-8 flex items-baseline">
        <span className="font-quantico font-bold text-5xl lg:text-6xl text-[#5BD5AF]">$</span>
        <div className="font-quantico font-bold text-5xl lg:text-6xl text-[#5BD5AF]">
          <AnimatedPrice price={price} />
        </div>
        <span className="text-gray-400 ml-2">/ {billingCycle}</span>
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className={`flex items-start gap-3 ${feature.available ? "text-[#F7EDE2]" : "text-gray-500"}`}>
            {feature.available ? (
              <CheckIcon className="size-5 mt-0.5 flex-shrink-0 text-[#5BD5AF]" />
            ) : (
              <XIcon className="size-5 mt-0.5 flex-shrink-0 text-gray-600" />
            )}
            <span>
              {feature.label}
              {feature.note && <span className="text-sm text-gray-400 ml-1">{feature.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export function PricingSection({
  basicPlanFeatures,
  proPlanFeatures,
  litePlanFeatures,
}: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(true);

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      id="plans"
      className="flex flex-col items-center justify-center mt-[53px] mb-[100px] font-poppins scroll-mt-28 w-full px-4"
    >
      <h2 className="font-quantico font-normal text-[12px] lg:text-[20px] lg:leading-[20px] flex items-center text-center lg:tracking-[0.5em] uppercase lg:mb-2 bg-gradient-to-t from-[#5BD5AF] to-[#84B9FF] bg-clip-text text-transparent">
        save 20% on yearly subscription
      </h2>
      <h3 className="font-krona-one font-normal text-[36px] lg:text-[96px] lg:leading-[116px] text-center uppercase text-[#F7EDE2] mb-[30px]">
        plans
      </h3>
      <div className="flex items-center justify-center gap-x-4">
        <span
          className={`font-roboto-flex font-medium text-sm lg:text-base transition-colors ${
            !isYearly ? "text-[#97FFEF]" : "text-[#F7EDE2]"
          }`}
        >
          Monthly
        </span>
        <label className="switch">
          <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(!isYearly)} />
          <span className="slider round"></span>
        </label>
        <span
          className={`font-roboto-flex font-medium text-sm lg:text-base transition-colors ${
            isYearly ? "text-[#97FFEF]" : "text-[#F7EDE2]"
          }`}
        >
          Yearly
        </span>
      </div>

      <motion.div
        variants={cardContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 max-w-6xl w-full"
      >
        <PricingCard
          planName="Basic"
          description="For students, trials, and casual use."
          price={0}
          billingCycle="month"
          features={basicPlanFeatures}
        />
        <PricingCard
          planName="Lite"
          description="For design enthusiasts and freelancers."
          price={isYearly ? 12 : 15}
          billingCycle={isYearly ? "month, billed annually" : "month"}
          features={litePlanFeatures}
          isPopular={true}
        />
        <PricingCard
          planName="Pro"
          description="For professional designers and teams."
          price={isYearly ? 28 : 35}
          billingCycle={isYearly ? "month, billed annually" : "month"}
          features={proPlanFeatures}
        />
      </motion.div>
    </motion.div>
  );
}
