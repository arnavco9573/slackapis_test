import React from 'react';
import { cn } from '@/lib/utils';

interface ChipFilledProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const ChipFilled = ({ children, className, ...props }: ChipFilledProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-center px-3 py-1 text-xs font-medium text-text-mid transition-colors",
                className
            )}
            style={{
                borderRadius: '500px',
                background: 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))',
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export default ChipFilled;
