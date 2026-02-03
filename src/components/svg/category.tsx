import { cn } from "@/lib/utils"

export default function SortSvg({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="15"
            viewBox="0 0 16 15"
            fill="none"
            className={cn(className)}
        >
            <path d="M0.5 3H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0.5 11.332H5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 11.332L15.5 11.332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.5 3L15.5 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 3C3 2.22343 3 1.83515 3.12687 1.52886C3.29602 1.12048 3.62048 0.796024 4.02886 0.626867C4.33515 0.5 4.72343 0.5 5.5 0.5C6.27657 0.5 6.66485 0.5 6.97114 0.626867C7.37952 0.796024 7.70398 1.12048 7.87313 1.52886C8 1.83515 8 2.22343 8 3C8 3.77657 8 4.16485 7.87313 4.47114C7.70398 4.87952 7.37952 5.20398 6.97114 5.37313C6.66485 5.5 6.27657 5.5 5.5 5.5C4.72343 5.5 4.33515 5.5 4.02886 5.37313C3.62048 5.20398 3.29602 4.87952 3.12687 4.47114C3 4.16485 3 3.77657 3 3Z" stroke="currentColor" />
            <path d="M8 11.332C8 10.5555 8 10.1672 8.12687 9.86089C8.29602 9.45251 8.62048 9.12806 9.02886 8.9589C9.33515 8.83203 9.72343 8.83203 10.5 8.83203C11.2766 8.83203 11.6649 8.83203 11.9711 8.9589C12.3795 9.12806 12.704 9.45251 12.8731 9.86089C13 10.1672 13 10.5555 13 11.332C13 12.1086 13 12.4969 12.8731 12.8032C12.704 13.2116 12.3795 13.536 11.9711 13.7052C11.6649 13.832 11.2766 13.832 10.5 13.832C9.72343 13.832 9.33515 13.832 9.02886 13.7052C8.62048 13.536 8.29602 13.2116 8.12687 12.8032C8 12.4969 8 12.1086 8 11.332Z" stroke="currentColor" />
        </svg>
    )
}
