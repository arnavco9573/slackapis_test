export default function ProgressDotSvg({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="36"
			viewBox="0 0 22 36"
			fill="none"
			className={className}
		>
			<g filter="url(#filter0_f_194_79138)">
				<circle cx="11" cy="25" r="7" fill="currentColor" fillOpacity="0.15" />
			</g>
			<circle
				cx="11"
				cy="25"
				r="5"
				fill="url(#paint0_radial_194_79138)"
			/>
			<defs>
				<filter
					id="filter0_f_194_79138"
					x="0"
					y="14"
					width="22"
					height="22"
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
						stdDeviation="2"
						result="effect1_foregroundBlur_194_79138"
					/>
				</filter>
				<radialGradient
					id="paint0_radial_194_79138"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(11 24.5) rotate(127.875) scale(5.70088 6.06318)"
				>
					<stop offset="0.287923" stopColor="#101012" />
					<stop offset="1" stopColor="white" />
				</radialGradient>
			</defs>
		</svg>
	);
}
