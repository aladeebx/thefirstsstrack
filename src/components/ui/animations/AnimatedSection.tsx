"use client";

import { motion, useInView, HTMLMotionProps } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    className?: string;
    viewportOnce?: boolean;
}

export const AnimatedSection = ({
    children,
    delay = 0,
    direction = "up",
    className,
    viewportOnce = true,
    ...props
}: AnimatedSectionProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: viewportOnce, margin: "-100px" });

    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut" as any,
                delay: delay,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};
