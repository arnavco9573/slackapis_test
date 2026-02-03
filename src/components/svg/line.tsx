export function LineSvg({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1"
			height="105"
			viewBox="0 0 1 105"
			fill="none"
			className={className}
		>
			<path
				d="M1 1L0.999995 104"
				stroke="url(#paint0_linear_2912_40966)"
				strokeLinecap="round"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_2912_40966"
					x1="0.5"
					y1="1"
					x2="0.499995"
					y2="104"
					gradientUnits="userSpaceOnUse"
				>
					<stop
						stopColor="var(--card-strategy-line-1)"
						stopOpacity="0"
					/>
					<stop
						offset="0.447115"
						stopColor="var(--card-strategy-line-1)"
					/>
					<stop
						offset="0.817308"
						stopColor="var(--card-strategy-line-1)"
						stopOpacity="0"
					/>
				</linearGradient>
			</defs>
		</svg>
	);
}

export function LineSvg2({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="105"
			height="1"
			viewBox="0 0 105 1"
			fill="none"
			className={className}
		>
			<path
				d="M1 1L104 1"
				stroke="url(#paint0_linear_2912_40967)"
				strokeLinecap="round"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_2912_40967"
					x1="1"
					y1="1.5"
					x2="104"
					y2="1.5"
					gradientUnits="userSpaceOnUse"
				>
					<stop
						stopColor="var(--card-strategy-line-1)"
						stopOpacity="0"
					/>
					<stop
						offset="0.447115"
						stopColor="var(--card-strategy-line-1)"
					/>
					<stop
						offset="0.817308"
						stopColor="var(--card-strategy-line-1)"
						stopOpacity="0"
					/>
				</linearGradient>
			</defs>
		</svg>
	);
}
