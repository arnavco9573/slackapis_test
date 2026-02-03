import React from 'react';

export default function EllipseBlurSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="180"
            height="180"
            viewBox="0 0 240 176"
            fill="none"
            className={className}
        >
            <g filter="url(#filter0_f_40001500_16934)">
                <ellipse
                    cx="120"
                    cy="88"
                    rx="40"
                    ry="8"
                    fill="currentColor"
                    fillOpacity="0.5"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_40001500_16934"
                    x="0"
                    y="0"
                    width="240"
                    height="176"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="40"
                        result="effect1_foregroundBlur_40001500_16934"
                    />
                </filter>
            </defs>
        </svg>
    );
}
