export default function Timer({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			className={className}
		>
			<g clipPath="url(#clip_timer_svg)">
				<path
					d="M16.1218 9.77074L18.249 7.64353L12.3564 1.75098L10.2292 3.87819C9.05513 5.05605 8.95292 7.21948 8.87984 8.88097C7.21835 8.95406 5.05492 9.05626 3.87706 10.2304L1.74984 12.3576L7.6424 18.2501L9.76961 16.1229C10.9437 14.9451 11.0459 12.7816 11.119 11.1201C12.7805 11.0471 14.9439 10.9448 16.1218 9.77074Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M11.7676 1.16113L18.8386 8.2322M1.16098 11.7677L8.23204 18.8388"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip_timer_svg">
					<rect width="20" height="20" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
