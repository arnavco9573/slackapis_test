export default function StrategyBlur1({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="150"
			height="216"
			viewBox="0 0 171 216"
			fill="none"
			className={className}
		>
			<g filter="url(#filter0_if_2912_40935)">
				<path
					d="M72 -28.4102L72 117.002"
					stroke="var(--card-strategy-blur-1)"
					strokeOpacity="0.5"
					strokeWidth="56.4706"
					strokeLinecap="round"
				/>
			</g>
			<defs>
				<filter
					id="filter0_if_2912_40935"
					x="-26.8226"
					y="-127.233"
					width="197.645"
					height="343.059"
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
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="2.82353" />
					<feGaussianBlur stdDeviation="2.82353" />
					<feComposite
						in2="hardAlpha"
						operator="arithmetic"
						k2="-1"
						k3="1"
					/>
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
					/>
					<feBlend
						mode="normal"
						in2="shape"
						result="effect1_innerShadow_2912_40935"
					/>
					<feGaussianBlur
						stdDeviation="35.2941"
						result="effect2_foregroundBlur_2912_40935"
					/>
				</filter>
			</defs>
		</svg>
	);
}
