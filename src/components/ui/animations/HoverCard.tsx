"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    scale?: number;
    lift?: number;
}

export const HoverCard = ({
    children,
    className,
    scale = 1.05,
    lift = -10,
    ...props
}: HoverCardProps) => {
    return (
        <motion.div
            whileHover={{ y: lift, scale: scale }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn("cursor-pointer", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};
