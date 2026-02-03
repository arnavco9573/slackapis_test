import React from "react";

const PageLoader = ({ size }: { size: number }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			className="animate-spin animate-spin-reverse"
		>
			<g
				clipPath="url(#paint0_angular_1127_17460_clip_path)"
				data-figma-skip-parse="true"
			>
				<g transform="matrix(0 0.012 -0.012 0 12 12)">
					<foreignObject
						x="-1015.15"
						y="-1015.15"
						width="2030.3"
						height="2030.3"
					>
						<div
							className="loader-spin"
							style={{
								background:
									"conic-gradient(from 90deg,var(--cta-text) 0deg,var(--neutral-25) 226.731deg,var(--container-border-bottom100) 360deg)",
								height: "100%",
								width: "100%",
								opacity: 1,
							}}
						></div>
					</foreignObject>
				</g>
			</g>
			<path
				d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM1.2 12C1.2 17.9647 6.03533 22.8 12 22.8C17.9647 22.8 22.8 17.9647 22.8 12C22.8 6.03533 17.9647 1.2 12 1.2C6.03533 1.2 1.2 6.03533 1.2 12Z"
				data-figma-gradient-fill='{"type":"GRADIENT_ANGULAR","stops":[{"color":{"r":1.0,"g":1.0,"b":1.0,"a":1.0},"position":0.0},{"color":{"r":1.0,"g":1.0,"b":1.0,"a":0.250},"position":0.62980771064758301},{"color":{"r":1.0,"g":1.0,"b":1.0,"a":0.0},"position":1.0}],"stopsVar":[{"color":{"r":1.0,"g":1.0,"b":1.0,"a":1.0},"position":0.0},{"color":{"r":1.0,"g":1.0,"b":1.0,"a":0.250},"position":0.62980771064758301},{"color":{"r":1.0,"g":1.0,"b":1.0,"a":0.0},"position":1.0}],"transform":{"m00":1.4695762231022014e-15,"m01":-24.0,"m02":24.0,"m10":24.0,"m11":2.5837918434033595e-15,"m12":-2.0266840861923397e-15},"opacity":1.0,"blendMode":"NORMAL","visible":true}'
			/>
			<defs>
				<clipPath id="paint0_angular_1127_17460_clip_path">
					<path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM1.2 12C1.2 17.9647 6.03533 22.8 12 22.8C17.9647 22.8 22.8 17.9647 22.8 12C22.8 6.03533 17.9647 1.2 12 1.2C6.03533 1.2 1.2 6.03533 1.2 12Z" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default PageLoader;