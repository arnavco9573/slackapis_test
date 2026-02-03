export default function AreaGraphSvg({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			className={className}
		>
			<path
				d="M15.5 15.5H6.33333C3.58347 15.5 2.20854 15.5 1.35427 14.6457C0.5 13.7915 0.5 12.4165 0.5 9.66667V0.5"
				stroke="currentColor"
				strokeLinecap="round"
			/>
			<path
				d="M2.16602 14.6664C2.53216 12.0361 4.39636 5.30326 6.6895 5.30326C8.27442 5.30326 8.68487 8.52909 10.238 8.52909C12.9102 8.52909 12.5229 1.33301 15.4993 1.33301"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
