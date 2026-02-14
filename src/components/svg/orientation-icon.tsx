import React from 'react';

const OrientationIcon = ({ className }: { className?: string }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
            <path d="M7.50033 18.3327H12.5003C16.667 18.3327 18.3337 16.666 18.3337 12.4993V7.49935C18.3337 3.33268 16.667 1.66602 12.5003 1.66602H7.50033C3.33366 1.66602 1.66699 3.33268 1.66699 7.49935V12.4993C1.66699 16.666 3.33366 18.3327 7.50033 18.3327Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14.1663 2.0332V10.3499C14.1663 11.9915 12.9913 12.6332 11.5497 11.7665L10.4497 11.1082C10.1997 10.9582 9.79967 10.9582 9.54967 11.1082L8.44967 11.7665C7.00801 12.6249 5.83301 11.9915 5.83301 10.3499V2.0332" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default OrientationIcon;
