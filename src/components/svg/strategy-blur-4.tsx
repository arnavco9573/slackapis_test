export default function StrategyBlur4({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="138"
			height="296"
			viewBox="0 0 138 296"
			fill="none"
			className={className}
		>
			<g filter="url(#filter0_f_1150_61171)">
				<path
					d="M69 69.4707L69 227"
					stroke="url(#paint0_linear_1150_61171)"
					strokeWidth="61.1765"
					strokeLinecap="round"
				/>
			</g>
			<defs>
				<filter
					id="filter0_f_1150_61171"
					x="0.176815"
					y="0.647518"
					width="137.646"
					height="295.176"
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
						stdDeviation="9.17647"
						result="effect1_foregroundBlur_1150_61171"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_1150_61171"
					x1="69"
					y1="6.00011"
					x2="69"
					y2="234.647"
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
						stopOpacity="0.1"
					/>
				</linearGradient>
			</defs>
		</svg>
	);
}
