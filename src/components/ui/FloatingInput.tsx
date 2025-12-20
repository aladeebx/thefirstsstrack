"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface FloatingInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    startIcon?: React.ReactNode;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ className, type, label, error, startIcon, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(false);

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            props.onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            props.onBlur?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
        };

        // Initialize hasValue if value prop is present
        React.useEffect(() => {
            if (props.value && props.value.toString().length > 0) {
                setHasValue(true);
            }
        }, [props.value]);

        return (
            <div className="relative w-full mb-6 group">
                <motion.div
                    animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="relative"
                >
                    <div className="absolute left-3 top-3.5 text-gray-400 z-10 transition-colors duration-200 group-focus-within:text-primary-red">
                        {startIcon}
                    </div>

                    <input
                        type={type}
                        className={cn(
                            "peer flex h-14 w-full rounded-xl border border-gray-200 bg-white px-4 pt-5 pb-1 text-sm outline-none transition-all duration-200 focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 disabled:cursor-not-allowed disabled:opacity-50",
                            startIcon ? "pl-10" : "",
                            error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "",
                            className
                        )}
                        ref={ref}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        {...props}
                    />

                    <label
                        className={cn(
                            "pointer-events-none absolute left-4 top-4 text-gray-500 transition-all duration-200",
                            startIcon ? "left-10" : "",
                            (isFocused || hasValue || props.value)
                                ? "top-2 text-xs text-primary-red font-medium"
                                : "text-sm",
                            error ? "text-red-500" : ""
                        )}
                    >
                        {label}
                    </label>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="mt-1 text-xs text-red-500 ml-1 font-medium flex items-center"
                        >
                            <span className="w-1 h-1 rounded-full bg-red-500 mr-1.5" />
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
