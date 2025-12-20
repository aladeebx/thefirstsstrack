"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, Zap, Crown, Building2 } from "lucide-react";
import { PulseButton } from "@/components/ui/animations/PulseButton";
import { HoverCard } from "@/components/ui/animations/HoverCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/animations/StaggerContainer";
import { cn } from "@/lib/utils";

interface PricingPlan {
    name: string;
    price: number;
    customers: string;
    shipments: string;
    features: string;
    support: string;
    highlighted: boolean;
    icon: any;
}

export default function PricingContent({
    plans,
    monthlyText,
    yearlyText,
    startTrialText,
    choosePlanText,
    mostPopularText
}: {
    plans: PricingPlan[],
    monthlyText: string,
    yearlyText: string,
    startTrialText: string,
    choosePlanText: string,
    mostPopularText: string
}) {
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

    return (
        <div className="container mx-auto px-4">
            {/* Toggle */}
            <div className="flex justify-center mb-16">
                <div className="bg-gray-100 p-1 rounded-full flex items-center relative">
                    <motion.div
                        className="absolute bg-white shadow-sm rounded-full h-10 w-32"
                        animate={{ x: billing === "monthly" ? 0 : 128 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                        onClick={() => setBilling("monthly")}
                        className={cn(
                            "relative z-10 w-32 h-10 rounded-full font-medium text-sm transition-colors duration-200",
                            billing === "monthly" ? "text-soft-black" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {monthlyText}
                    </button>
                    <button
                        onClick={() => setBilling("yearly")}
                        className={cn(
                            "relative z-10 w-32 h-10 rounded-full font-medium text-sm transition-colors duration-200",
                            billing === "yearly" ? "text-soft-black" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {yearlyText}
                    </button>
                </div>
            </div>

            {/* Grid */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {plans.map((plan, index) => {
                    const price = billing === "monthly" ? plan.price : Math.round(plan.price * 12 * 0.8);
                    const period = billing === "monthly" ? "/mo" : "/yr";
                    const isHighlighted = plan.highlighted;

                    return (
                        <StaggerItem key={index} className={cn("relative", isHighlighted ? "z-10 md:-mt-4" : "z-0")}>
                            <HoverCard
                                scale={isHighlighted ? 1.02 : 1.02}
                                className={cn(
                                    "bg-white rounded-[2rem] p-8 border transition-all duration-300 flex flex-col h-full",
                                    isHighlighted
                                        ? "border-primary-red/20 shadow-xl ring-1 ring-primary-red/10"
                                        : "border-gray-100 shadow-subtle hover:shadow-lg"
                                )}
                            >
                                {isHighlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-red text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                                        {mostPopularText}
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isHighlighted ? 'bg-primary-red/10 text-primary-red' : 'bg-gray-50 text-gray-600'}`}>
                                    {index === 0 && <Zap className="w-6 h-6" />}
                                    {index === 1 && <Crown className="w-6 h-6" />}
                                    {index === 2 && <Building2 className="w-6 h-6" />}
                                </div>

                                <h3 className="text-2xl font-bold text-soft-black mb-2">{plan.name}</h3>

                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-bold text-soft-black">${price}</span>
                                    <span className="text-gray-500 ml-1">{period}</span>
                                </div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    {[plan.customers, plan.shipments, plan.features, plan.support].map((feature, i) => (
                                        <li key={i} className="flex items-start text-gray-600 text-sm">
                                            <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <PulseButton className={cn(
                                    "w-full py-3 rounded-xl font-semibold transition-colors",
                                    isHighlighted
                                        ? "bg-primary-red text-white hover:bg-red-700"
                                        : "bg-gray-50 text-soft-black hover:bg-gray-100"
                                )}>
                                    {plan.price === 0 ? startTrialText : choosePlanText}
                                </PulseButton>
                            </HoverCard>
                        </StaggerItem>
                    );
                })}
            </StaggerContainer>
        </div>
    );
}
