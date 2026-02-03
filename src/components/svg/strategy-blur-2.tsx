export default function StrategyBlur2({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="128"
			height="181"
			viewBox="0 0 128 181"
			fill="none"
			className={className}
		>
			<g filter="url(#filter0_f_2912_40936)">
				<path
					d="M64 -28.4102L64 117.002"
					stroke="url(#paint0_linear_2912_40936)"
					strokeWidth="56.4706"
					strokeLinecap="round"
				/>
			</g>
			<defs>
				<filter
					id="filter0_f_2912_40936"
					x="0.471508"
					y="-91.9386"
					width="127.057"
					height="272.471"
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="BackgroundImageFix"
						result="shape"
					/>
					<feGaussianBlur
						stdDeviation="8.47059"
						result="effect1_foregroundBlur_2912_40936"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_2912_40936"
					x1="64"
					y1="-86.9984"
					x2="64"
					y2="124.06"
					gradientUnits="userSpaceOnUse"
				>
					<stop
						offset="0.237586"
						stopColor="var(--card-strategy-blur-2)"
						stopOpacity="0.9"
					/>
					<stop
						offset="0.532596"
						stopColor="var(--card-strategy-blur-2)"
						stopOpacity="0.5"
					/>
					<stop
						offset="0.817308"
						stopColor="var(--card-strategy-blur-3)"
						stopOpacity="0.01"
					/>
				</linearGradient>
			</defs>
		</svg>
	);
}
