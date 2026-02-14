import React from 'react';

const StrategySelectionIcon = ({ className }: { className?: string }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
            <path d="M7.50033 18.3327H5.83366C2.50033 18.3327 1.66699 17.4993 1.66699 14.166V5.83268C1.66699 2.49935 2.50033 1.66602 5.83366 1.66602H7.08366C8.33366 1.66602 8.60868 2.03269 9.08368 2.66603L10.3337 4.33269C10.6503 4.74936 10.8337 4.99935 11.667 4.99935H14.167C17.5003 4.99935 18.3337 5.83268 18.3337 9.16602V10.8327" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.4668 15.267C9.50846 15.4087 9.50846 18.242 11.4668 18.3836H16.1001C16.6585 18.3836 17.2085 18.1753 17.6168 17.8003C18.9918 16.6003 18.2584 14.2003 16.4501 13.9753C15.8001 10.067 10.1501 11.5503 11.4835 15.2753" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default StrategySelectionIcon;
