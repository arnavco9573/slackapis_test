export default function CircleCheckSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle
        cx="11.999"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8.49951 12.5L10.4995 14.5L15.4995 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CircleCheckSvg2({ className }: { className?: string }) {
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
        d="M12.916 1.53168C11.6903 0.822638 10.2672 0.416829 8.74935 0.416829C4.14698 0.416829 0.416016 4.14779 0.416016 8.75016C0.416016 13.3525 4.14698 17.0835 8.74935 17.0835C13.3517 17.0835 17.0827 13.3525 17.0827 8.75016C17.0827 8.17939 17.0253 7.62201 16.916 7.0835"
        stroke="currentColor"
        strokeWidth="0.833333"
        strokeLinecap="round"
      />
      <path
        d="M5.41602 9.16699C5.41602 9.16699 6.66602 9.16699 8.33268 12.0837C8.33268 12.0837 12.965 4.44477 17.0827 2.91699"
        stroke="currentColor"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
