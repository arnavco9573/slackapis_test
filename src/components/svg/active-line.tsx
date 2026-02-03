export default function ActiveLineSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1"
            height="58"
            viewBox="0 0 1 58"
            fill="none"
            className={className}
        >
            <path
                d="M0 57L2.44784e-06 1"
                stroke="url(#paint0_radial_40000448_19473)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <defs>
                <radialGradient
                    id="paint0_radial_40000448_19473"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(0.500002 29) rotate(-90) scale(16.625 2.44177)"
                >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
}
