export default function WarningSvg({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="17"
			viewBox="0 0 18 17"
			fill="none"
			className={className}
		>
			<path
				d="M3.18484 6.40276C5.19624 2.84365 6.20193 1.06409 7.58197 0.606001C8.34117 0.353989 9.15899 0.353989 9.9182 0.606001C11.2982 1.06409 12.3039 2.84365 14.3153 6.40276C16.3267 9.96188 17.3324 11.7414 17.0307 13.1914C16.8648 13.9892 16.4559 14.7127 15.8626 15.2584C14.7843 16.2503 12.7729 16.2503 8.75008 16.2503C4.72729 16.2503 2.71589 16.2503 1.63755 15.2584C1.04431 14.7127 0.635406 13.9892 0.469434 13.1914C0.167743 11.7414 1.17344 9.96188 3.18484 6.40276Z"
				stroke="currentColor"
				strokeWidth="0.833333"
			/>
			<path
				d="M8.74349 11.667H8.75098"
				stroke="currentColor"
				strokeWidth="0.833333"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8.75 9.16699L8.75 5.83366"
				stroke="currentColor"
				strokeWidth="0.833333"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function WarningSvg2({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={className}
		>
			<path
				d="M5.31171 10.7615C8.23007 5.58716 9.68925 3 12 3C14.3107 3 15.7699 5.58716 18.6883 10.7615L19.0519 11.4063C21.4771 15.7061 22.6897 17.856 21.5937 19.428C20.4978 21 17.7864 21 12.3637 21H11.6363C6.21356 21 3.50217 21 2.40626 19.428C1.31034 17.856 2.52291 15.7061 4.94805 11.4063L5.31171 10.7615Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M12 8V13"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<circle cx="12" cy="16" r="1" fill="currentColor" />
		</svg>
	);
}
