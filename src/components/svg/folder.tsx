import { cn } from "@/lib/utils"

export default function FolderSvg({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="279" height="195" viewBox="0 0 279 195" fill="none">
            <foreignObject x="-16.8248" y="-16.8248" width="312.078" height="301.385">
                <div
                    style={{
                        backdropFilter: 'blur(8.41px)',
                        clipPath: 'url(#bgblur_0_3200_17862_clip_path)',
                        height: '100%',
                        width: '100%'
                    }}
                />
            </foreignObject>
            <g filter="url(#filter0_iii_3200_17862)" data-figma-bg-blur-radius="16.8248">
                <path d="M0 13.5665C0 6.07392 6.07392 0 13.5665 0H142.181C146.933 0 151.624 1.0698 155.906 3.13004L192.571 20.7711C195.018 21.9483 197.698 22.5597 200.414 22.5597H264.862C272.355 22.5597 278.428 28.6336 278.428 36.1261V180.549C278.428 188.042 272.355 194.116 264.862 194.116H13.5665C6.07391 194.116 0 188.042 0 180.549V13.5665Z" fill="#D9D9D9" fill-opacity="0.26" />
                <path d="M13.5664 0.56543H142.182C146.849 0.565462 151.456 1.61623 155.661 3.63965L192.326 21.2803C194.849 22.4942 197.613 23.1249 200.413 23.125H264.862C272.042 23.1252 277.863 28.9458 277.863 36.126V180.549C277.863 187.729 272.043 193.551 264.862 193.551H13.5664C6.38607 193.551 0.56543 187.729 0.56543 180.549V13.5664C0.56547 6.3861 6.3861 0.565468 13.5664 0.56543Z" stroke="white" stroke-opacity="0.4" stroke-width="1.13054" />
            </g>
            <defs>
                <filter id="filter0_iii_3200_17862" x="-16.8248" y="-16.8248" width="312.078" height="301.385" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="1.13054" />
                    <feGaussianBlur stdDeviation="0.56527" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3200_17862" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="-1.13054" />
                    <feGaussianBlur stdDeviation="0.56527" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="effect1_innerShadow_3200_17862" result="effect2_innerShadow_3200_17862" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="6.78324" dy="90.4432" />
                    <feGaussianBlur stdDeviation="45.2216" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.01 0" />
                    <feBlend mode="normal" in2="effect2_innerShadow_3200_17862" result="effect3_innerShadow_3200_17862" />
                </filter>
                <clipPath id="bgblur_0_3200_17862_clip_path" transform="translate(16.8248 16.8248)"><path d="M0 13.5665C0 6.07392 6.07392 0 13.5665 0H142.181C146.933 0 151.624 1.0698 155.906 3.13004L192.571 20.7711C195.018 21.9483 197.698 22.5597 200.414 22.5597H264.862C272.355 22.5597 278.428 28.6336 278.428 36.1261V180.549C278.428 188.042 272.355 194.116 264.862 194.116H13.5665C6.07391 194.116 0 188.042 0 180.549V13.5665Z" />
                </clipPath></defs>
        </svg>
    )
}
