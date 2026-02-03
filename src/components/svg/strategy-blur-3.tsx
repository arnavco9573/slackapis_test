export default function StrategyBlur3({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="180"
			height="373"
			viewBox="0 0 216 373"
			fill="none"
			className={className}
		>
			<g filter="url(#filter0_if_1150_61170)">
				<path
					d="M108 107.471L108 265"
					stroke="var(--card-strategy-blur-1)"
					strokeOpacity="0.5"
					strokeWidth="61.1765"
					strokeLinecap="round"
				/>
			</g>
			<defs>
				<filter
					id="filter0_if_1150_61170"
					x="0.941521"
					y="0.412224"
					width="214.117"
					height="371.646"
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
					<feOffset dy="3.05882" />
					<feGaussianBlur stdDeviation="3.05882" />
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
						result="effect1_innerShadow_1150_61170"
					/>
					<feGaussianBlur
						stdDeviation="38.2353"
						result="effect2_foregroundBlur_1150_61170"
					/>
				</filter>
			</defs>
		</svg>
	);
}
