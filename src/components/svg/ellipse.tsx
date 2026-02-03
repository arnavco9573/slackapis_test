type EllipseVariant =
	| "primary"
	| "secondary"
	| "black"
	| "blue"
	| "green"
	| "white"
	| "violet"
	| "yellow"
	| "pink"
	| "purple"
	| "tertiary"
	| "x"
	| "y";

export default function Ellipse({
	className,
	variant = "primary",
}: {
	className?: string;
	variant?: EllipseVariant;
}) {
	switch (variant) {
		case "primary":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="13"
					viewBox="0 0 12 13"
					fill="none"
				>
					<circle
						cx="6"
						cy="6.5"
						r="5.5"
						stroke="url(#paint0_linear_1671_28309)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_1671_28309"
							x1="-1.49012e-08"
							y1="4"
							x2="6"
							y2="12.5"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="var(--ellipse-1)" />
							<stop offset="1" stopColor="var(--cta-text)" />
						</linearGradient>
					</defs>
				</svg>
			);

		case "secondary":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={className}
				>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="url(#paint0_linear_1_15954)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_1_15954"
							x1="12"
							y1="12"
							x2="12"
							y2="0"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#A8A5FF" stopOpacity="0.01" />
							<stop offset="1" stopColor="#A8A5FF" />
						</linearGradient>
					</defs>
				</svg>
			);

		case "blue":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={className}
				>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="url(#paint0_linear_794_28818)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_794_28818"
							x1="12.2123"
							y1="-0.420302"
							x2="-3.65383"
							y2="4.0876"
							gradientUnits="userSpaceOnUse"
						>
							<stop offset="0.456731" stopColor="#31477E" />
							<stop
								offset="1"
								stopColor="#31477E"
								stopOpacity="0.5"
							/>
						</linearGradient>
					</defs>
				</svg>
			);

		case "black":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					className={className}
					fill="currentColor"
				>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="url(#paint0_linear_1_4846)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_1_4846"
							x1="12"
							y1="2"
							x2="-1.25487e-05"
							y2="9.99998"
							gradientUnits="userSpaceOnUse"
						>
							<stop
								stopColor="var(--cta-text)"
								stopOpacity="0.8"
							/>
							<stop
								offset="1"
								stopColor="var(--cta-text)"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>
				</svg>
			);

		case "green":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={className}
				>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="url(#paint0_linear_794_28823)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_794_28823"
							x1="12.2123"
							y1="-0.420302"
							x2="-3.65383"
							y2="4.0876"
							gradientUnits="userSpaceOnUse"
						>
							<stop offset="0.456731" stopColor="#3F773C" />
							<stop
								offset="1"
								stopColor="#3F773C"
								stopOpacity="0.5"
							/>
						</linearGradient>
					</defs>
				</svg>
			);

		case "violet":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={className}
				>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="url(#paint0_linear_1_15594)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_1_15594"
							x1="9.75"
							y1="3"
							x2="-0.92274"
							y2="4.69711"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="var(--bg-mobile-top100)" />
							<stop
								offset="1"
								stopColor="var(--bg-mobile-top100)"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>
				</svg>
			);

		case "white":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={className}
				>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="url(#paint0_linear_1_1715)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_1_1715"
							x1="12.1037"
							y1="0.201399"
							x2="-1.97538"
							y2="3.89591"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="var(--cta-text)" />
							<stop
								offset="1"
								stopColor="var(--cta-text)"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>
				</svg>
			);

		case "yellow":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={className}
				>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="url(#paint0_linear_794_28813)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_794_28813"
							x1="12"
							y1="12"
							x2="12"
							y2="0"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#2C211A" />
							<stop offset="1" stopColor="#845436" />
						</linearGradient>
					</defs>
				</svg>
			);

		case "pink":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={className}
				>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="url(#paint0_linear_1_6288)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_1_6288"
							x1="12.2123"
							y1="-0.420302"
							x2="-3.65383"
							y2="4.0876"
							gradientUnits="userSpaceOnUse"
						>
							<stop offset="0.456731" stopColor="#752F80" />
							<stop
								offset="1"
								stopColor="#752F80"
								stopOpacity="0.5"
							/>
						</linearGradient>
					</defs>
				</svg>
			);

		case "purple":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className={className}
				>
					<circle
						cx="6"
						cy="6"
						r="6"
						fill="url(#paint0_linear_1_16081)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_1_16081"
							x1="12"
							y1="0"
							x2="2"
							y2="12"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#A8A5FF" />
							<stop offset="1" stopColor="#656399" />
						</linearGradient>
					</defs>
				</svg>
			);

		case "tertiary":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="13"
					viewBox="0 0 12 13"
					fill="none"
					className={className}
				>
					<circle
						cx="6"
						cy="6.5"
						r="6"
						fill="url(#paint0_radial_157_9981)"
					/>
					<defs>
						<radialGradient
							id="paint0_radial_157_9981"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(8.4 4.7) rotate(135) scale(9.33381 9.927)"
						>
							<stop offset="0.287923" stopColor="#101012" />
							<stop offset="1" stopColor="white" />
						</radialGradient>
					</defs>
				</svg>
			);

		case "x":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="15"
					viewBox="0 0 14 15"
					fill="none"
					className={className}
				>
					<circle
						cx="7.11845"
						cy="7.58037"
						r="6.82353"
						fill="url(#paint0_linear_194_78906)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_194_78906"
							x1="14.1834"
							y1="0.278846"
							x2="-3.86041"
							y2="5.40548"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#A5EEFF" />
							<stop
								offset="1"
								stopColor="#A5EEFF"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>
				</svg>
			);

		case "y":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="15"
					viewBox="0 0 14 15"
					fill="none"
					className={className}
				>
					<circle
						cx="6.92509"
						cy="7.58037"
						r="6.82353"
						fill="url(#paint0_linear_194_78909)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_194_78909"
							x1="13.99"
							y1="0.278846"
							x2="-4.05377"
							y2="5.40548"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#FFA5A5" />
							<stop
								offset="1"
								stopColor="#FFA5A5"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>
				</svg>
			);
	}
}
