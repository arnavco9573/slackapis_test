export default function Bell({ className }: { className?: string }) {
	return (
		<svg
			width="20"
			height="22"
			viewBox="0 0 20 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M0.529922 13.7696C0.317268 15.1636 1.268 16.1312 2.43205 16.6134C6.89481 18.4622 13.1052 18.4622 17.5679 16.6134C18.732 16.1312 19.6827 15.1636 19.4701 13.7696C19.3394 12.9129 18.6932 12.1995 18.2144 11.5029C17.5873 10.5793 17.525 9.57183 17.5249 8.5C17.5249 4.35786 14.1559 1 10 1C5.84413 1 2.47513 4.35786 2.47513 8.5C2.47503 9.57183 2.41272 10.5793 1.78561 11.5029C1.30684 12.1995 0.660612 12.9129 0.529922 13.7696Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6 18C6.45849 19.7252 8.07553 21 10 21C11.9245 21 13.5415 19.7252 14 18"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
