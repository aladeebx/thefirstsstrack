"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface PulseButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
}

export const PulseButton = ({ children, className, ...props }: PulseButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ boxShadow: "0 0 0 0 rgba(208, 25, 25, 0.4)" }}
            animate={{
                boxShadow: "0 0 0 10px rgba(208, 25, 25, 0)",
            }}
            transition={{
                boxShadow: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                },
                scale: {
                    type: "spring", stiffness: 400, damping: 10
                }
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};
