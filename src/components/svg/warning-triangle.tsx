import React from 'react';

const WarningTriangleSvg = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            className={className}
        >
            <path
                d="M3.18411 6.40276C5.1955 2.84365 6.2012 1.06409 7.58123 0.606001C8.34044 0.353989 9.15826 0.353989 9.91747 0.606001C11.2975 1.06409 12.3032 2.84365 14.3146 6.40276C16.326 9.96188 17.3317 11.7414 17.03 13.1914C16.864 13.9892 16.4551 14.7127 15.8619 15.2584C14.7835 16.2503 12.7721 16.2503 8.74935 16.2503C4.72656 16.2503 2.71516 16.2503 1.63682 15.2584C1.04358 14.7127 0.634674 13.9892 0.468702 13.1914C0.167011 11.7414 1.17271 9.96188 3.18411 6.40276Z"
                stroke="white"
                strokeWidth="0.833333"
            />
            <path
                d="M8.74203 11.667H8.74951"
                stroke="white"
                strokeWidth="0.833333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.75 9.16699L8.75 5.83366"
                stroke="white"
                strokeWidth="0.833333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default WarningTriangleSvg;
