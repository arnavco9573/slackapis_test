export default function SuccessSvg({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="52"
			height="52"
			viewBox="0 0 52 52"
			fill="none"
			className={className}
		>
			<rect
				width="52"
				height="52"
				rx="16"
				fill="var(--system-positive)"
			/>
			<g transform="translate(10, 10) scale(0.5)">
				<circle
					cx="32.0046"
					cy="32.5007"
					r="26.6667"
					stroke="currentColor"
					strokeWidth="3.2"
				/>
				<path
					d="M22.6719 33.834L28.0052 39.1673L41.3385 25.834"
					stroke="currentColor"
					strokeWidth="3.2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}
