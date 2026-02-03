export default function BarGraphSvg({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="17"
			height="17"
			viewBox="0 0 17 17"
			fill="none"
			className={className}
		>
			<path
				d="M4.25 12.5833L4.25 9.25"
				stroke="currentColor"
				strokeLinecap="round"
			/>
			<path
				d="M8.41602 12.5833L8.41602 4.25"
				stroke="currentColor"
				strokeLinecap="round"
			/>
			<path
				d="M12.582 12.584L12.582 7.58398"
				stroke="currentColor"
				strokeLinecap="round"
			/>
			<path
				d="M0.5 8.41667C0.5 4.68471 0.5 2.81874 1.65937 1.65937C2.81874 0.5 4.68471 0.5 8.41667 0.5C12.1486 0.5 14.0146 0.5 15.174 1.65937C16.3333 2.81874 16.3333 4.68471 16.3333 8.41667C16.3333 12.1486 16.3333 14.0146 15.174 15.174C14.0146 16.3333 12.1486 16.3333 8.41667 16.3333C4.68471 16.3333 2.81874 16.3333 1.65937 15.174C0.5 14.0146 0.5 12.1486 0.5 8.41667Z"
				stroke="currentColor"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
