export default function ActiveEllipseSvg({
    className,
    rx = 40,
    ry = 8,
    width = 116,
    height = 176,
}: {
    className?: string;
    rx?: number;
    ry?: number;
    width?: number;
    height?: number;
}) {
    const cx = width / 2;
    const cy = height / 2;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            className={className}
        >
            <g filter="url(#filter0_f_40000448_19468)">
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="currentColor" fillOpacity="0.5" />
            </g>
            <defs>
                <filter
                    id="filter0_f_40000448_19468"
                    x={-width}
                    y={-height}
                    width={width * 3}
                    height={height * 3}
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
                        result="effect1_foregroundBlur_40000448_19468"
                    />
                </filter>
            </defs>
        </svg>
    );
}
