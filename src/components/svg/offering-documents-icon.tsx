import React from "react";

const OfferingDocumentsIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={className}
        >
            <path
                d="M7.49984 18.3327H12.4998C16.6665 18.3327 18.3332 16.666 18.3332 12.4993V7.49935C18.3332 3.33268 16.6665 1.66602 12.4998 1.66602H7.49984C3.33317 1.66602 1.6665 3.33268 1.6665 7.49935V12.4993C1.6665 16.666 3.33317 18.3327 7.49984 18.3327Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.125 7.5H6.875"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.125 12.5H6.875"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default OfferingDocumentsIcon;
