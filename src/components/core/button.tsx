"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

import EllipseBlurSvg from "../svg/ellipse-blur";

interface ButtonProps {
    children: React.ReactNode;
    id?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | (() => void);
    formAction?: (formData: FormData) => Promise<void>;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    style?: React.CSSProperties;
    whileTap?: any; // Add flexible prop for motion
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    return (
        <motion.button
            ref={ref}
            type={props.type}
            formAction={props.formAction}
            id={props.id}
            onClick={props.onClick}
            style={props.style}
            className={cn(
                "relative cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-normal transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 h-[40px] px-[24px]",
                // Default State
                "rounded-[500px]",
                "border-[0.5px] border-(--Primary-700,#636363)",
                "[background:var(--System-GR-Neutral-10-01,linear-gradient(0deg,var(--Neutrals-10,rgba(255,255,255,0.10))_-0.21%,var(--Neutrals-01,rgba(255,255,255,0.01))_105.1%))]",
                "text-cta-text",

                // Hover State
                "hover:[background:var(--System-GR-Neutral-5-01,linear-gradient(0deg,rgba(255,255,255,0.05)_-0.21%,rgba(255,255,255,0.01)_105.1%))]",

                // Active (Clicked) State
                "active:[background:var(--Neutral-Neutrals-03,rgba(255,255,255,0.03))]",

                // Disabled State
                "disabled:[background:var(--Neutral-Neutrals-01,rgba(255,255,255,0.01))]",
                "",

                props.className
            )}
            whileTap={{ scale: 0.98 }}
            disabled={props.disabled}
        >
            <div className="absolute inset-0 -bottom-1 flex items-center justify-center -z-10 pointer-events-none">
                <EllipseBlurSvg className="w-[527px]! h-[346px]! text-neutral-20" />
            </div>
            <span className="relative z-10 flex items-center justify-center gap-2">
                {props.children}
            </span>
        </motion.button>
    );
});

Button.displayName = "Button";

export default Button;
