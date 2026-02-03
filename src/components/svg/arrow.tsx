export default function ArrowSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="10"
      viewBox="0 0 15 10"
      fill="none"
      className={className}
    >
      <path
        d="M13 4.66699L0.5 4.66699"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.6665 0.5L13.1261 3.95956C13.4594 4.29289 13.6261 4.45956 13.6261 4.66667C13.6261 4.87377 13.4594 5.04044 13.1261 5.37377L9.6665 8.83333"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDownSvg({ className }: { className?: string }) {
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
        d="M19.9181 8.94922L13.3981 15.4692C11.9981 16.8692 11.9981 16.8692 10.5981 15.4692L4.07812 8.94922"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
