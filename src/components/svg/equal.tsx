export function EqualSvg({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={className}
		>
			<path d="M20 7L4 7" stroke="currentColor" strokeLinecap="round" />
			<path d="M20 12L4 12" stroke="currentColor" strokeLinecap="round" />
			<path
				d="M20 17L4 17"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
}
