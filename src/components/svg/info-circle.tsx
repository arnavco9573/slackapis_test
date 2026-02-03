export default function InfoCircleSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className={className}
        >
            <path
                d="M17.0846 8.74998C17.0846 4.14761 13.3537 0.416646 8.7513 0.416646C4.14893 0.416646 0.417969 4.14761 0.417969 8.74998C0.417969 13.3524 4.14893 17.0833 8.7513 17.0833C13.3537 17.0833 17.0846 13.3524 17.0846 8.74998Z"
                stroke="currentColor"
                strokeWidth="0.833333"
            />
            <path
                d="M8.95443 12.9166V8.74996C8.95443 8.35712 8.95443 8.1607 8.83239 8.03866C8.71035 7.91663 8.51393 7.91663 8.12109 7.91663"
                stroke="currentColor"
                strokeWidth="0.833333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.74593 5.41663H8.75342"
                stroke="currentColor"
                strokeWidth="0.833333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
