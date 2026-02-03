import { cn } from "@/lib/utils";
import React from "react";
import ArrowSvg from "../svg/arrow";
import Button from "./button";
import EllipseBlurSvg from "../svg/ellipse-blur";

interface BackButtonProps {
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
	arrowSize?: string;
}

const BackButton = ({
	className,
	disabled,
	onClick,
	arrowSize = "size-4",
}: BackButtonProps) => {
	return (
		<div className={cn("relative inline-flex items-center justify-center", className)}>
			<EllipseBlurSvg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" />
			<Button
				className={cn(
					"rounded-[40px] border-b border-r border-solid border-neutral-25 cursor-pointer overflow-hidden relative z-10 w-10 h-10 min-w-10 px-0 py-0",
				)}
				disabled={disabled}
				onClick={onClick}
				type="button"
			>
				<ArrowSvg className={cn("rotate-180", arrowSize)} />
			</Button>
		</div>
	);
};

export default BackButton;
