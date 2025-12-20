"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    delayChildren?: number;
    staggerChildren?: number;
    className?: string;
}

export const StaggerContainer = ({
    children,
    delayChildren = 0,
    staggerChildren = 0.1,
    className,
    ...props
}: StaggerContainerProps) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                delayChildren: delayChildren,
                staggerChildren: staggerChildren,
            },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children, className, ...props }: HTMLMotionProps<"div">) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 200 } as any
        },
    };

    return (
        <motion.div variants={itemVariants} className={className} {...props}>
            {children}
        </motion.div>
    );
};
