export default function InfoSvg({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="21"
			viewBox="0 0 20 21"
			fill="none"
			className={className}
		>
			<circle
				cx="10.0003"
				cy="10.4998"
				r="8.33333"
				stroke="currentColor"
				strokeWidth="1.25"
			/>
			<path
				d="M10 14.6665V9.6665"
				stroke="currentColor"
				strokeWidth="1.25"
				strokeLinecap="round"
			/>
			<circle
				cx="0.833333"
				cy="0.833333"
				r="0.833333"
				transform="matrix(1 0 0 -1 9.16699 8)"
				fill="currentColor"
			/>
		</svg>
	);
}
