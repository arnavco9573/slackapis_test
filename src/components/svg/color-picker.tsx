import * as React from "react"
import { SVGProps } from "react"

const ColorPickerSvg = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        {...props}
    >
        <path
            d="M4.08948 10.5008L1.75031 8.16162C0.968646 7.37995 0.968646 6.60411 1.75031 5.82244L5.64698 1.92578L9.93448 6.2133C10.1503 6.42914 10.1503 6.77912 9.93448 6.99495L6.42281 10.5066C5.65281 11.2766 4.87114 11.2766 4.08948 10.5008Z"
            stroke="#888888"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4.86719 1.13672L5.64885 1.91837"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1.21094 6.95334L10.0309 6.56836"
            stroke="#888888"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1.75 12.834H9.33333"
            stroke="#888888"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10.9932 8.75C10.9932 8.75 9.91406 9.92249 9.91406 10.64C9.91406 11.235 10.3982 11.7191 10.9932 11.7191C11.5882 11.7191 12.0724 11.235 12.0724 10.64C12.0724 9.92249 10.9932 8.75 10.9932 8.75Z"
            stroke="#888888"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default ColorPickerSvg
