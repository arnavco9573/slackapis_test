
export default function FundingStepperSvg({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className={className}>
            <circle cx="8.83398" cy="3" r="2.5" stroke="currentColor" />
            <circle cx="8.83464" cy="15.5002" r="1.66667" stroke="currentColor" />
            <circle cx="15.5007" cy="15.5002" r="1.66667" stroke="currentColor" />
            <circle cx="2.16667" cy="15.5002" r="1.66667" stroke="currentColor" />
            <path d="M15.5013 11.3337C15.5013 10.4132 14.5686 9.66699 13.418 9.66699H4.2513C3.10071 9.66699 2.16797 10.4132 2.16797 11.3337" stroke="currentColor" strokeLinecap="round" />
            <path d="M8.83398 8L8.83398 11.3333" stroke="currentColor" strokeLinecap="round" />
        </svg>
    );
}
