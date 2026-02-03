import React from "react";

const MarketReportSvg = ({ className }: { className?: string }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none" className={className}>
            <path d="M18.5 9.5V8.5C18.5 4.72876 18.5 2.84315 17.2595 1.67157C16.019 0.5 14.0225 0.5 10.0294 0.5L8.97059 0.5C4.97752 0.5 2.98098 0.5 1.74049 1.67157C0.500001 2.84315 0.5 4.72876 0.5 8.5L0.5 12.5C0.5 16.2712 0.5 18.1569 1.74049 19.3284C2.98098 20.5 4.97751 20.5 8.97059 20.5H9.5" stroke="currentColor" strokeLinecap="round" />
            <path d="M5.5 5.5H13.5" stroke="currentColor" strokeLinecap="round" />
            <path d="M5.5 10.5H10.5" stroke="currentColor" strokeLinecap="round" />
            <path d="M18.5 19.1471L18.5 15.5C18.5 14.0706 17.1569 12.5 15.5 12.5C13.8431 12.5 12.5 14.0706 12.5 15.5L12.5 19C12.5 19.7797 13.2326 20.5 14.1364 20.5C15.0401 20.5 15.7727 19.7797 15.7727 19L15.7727 16.2647" stroke="currentColor" strokeLinecap="round" />
        </svg>
    )
}

export default MarketReportSvg