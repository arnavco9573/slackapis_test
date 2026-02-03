export default function RingSvg({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="96"
			height="96"
			viewBox="0 0 96 96"
			fill="none"
			className={className}
		>
			<path
				d="M96 48C96 74.5097 74.5097 96 48 96C21.4903 96 0 74.5097 0 48C0 21.4903 21.4903 0 48 0C74.5097 0 96 21.4903 96 48ZM14.4 48C14.4 66.5568 29.4432 81.6 48 81.6C66.5568 81.6 81.6 66.5568 81.6 48C81.6 29.4432 66.5568 14.4 48 14.4C29.4432 14.4 14.4 29.4432 14.4 48Z"
				fill="var(--card-strategy-blur-2)"
				fillOpacity="0.05"
			/>
			<path
				d="M96 48C96 74.5097 74.5097 96 48 96C21.4903 96 0 74.5097 0 48C0 21.4903 21.4903 0 48 0C74.5097 0 96 21.4903 96 48ZM14.4 48C14.4 66.5568 29.4432 81.6 48 81.6C66.5568 81.6 81.6 66.5568 81.6 48C81.6 29.4432 66.5568 14.4 48 14.4C29.4432 14.4 14.4 29.4432 14.4 48Z"
				fill="url(#paint0_linear_2912_40938)"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_2912_40938"
					x1="17.6"
					y1="21.6"
					x2="90.3928"
					y2="70.0282"
					gradientUnits="userSpaceOnUse"
				>
					<stop
						stopColor="var(--card-strategy-blur-2)"
						stopOpacity="0"
					/>
					<stop
						offset="0.164289"
						stopColor="var(--card-strategy-blur-2)"
						stopOpacity="0.1"
					/>
					<stop
						offset="0.5625"
						stopColor="var(--card-strategy-blur-2)"
						stopOpacity="0.3"
					/>
					<stop
						offset="0.927274"
						stopColor="var(--card-strategy-blur-4)"
					/>
				</linearGradient>
			</defs>
		</svg>
	);
}
