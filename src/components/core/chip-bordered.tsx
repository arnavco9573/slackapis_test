import React from 'react';
import { cn } from '@/lib/utils';

interface ChipBorderedProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const ChipBordered = ({ children, className, ...props }: ChipBorderedProps) => {
    return (
        <div
            className={cn(
                "relative flex items-center justify-center px-3 py-1 text-xs font-medium text-text-mid transition-colors",
                className
            )}
            {...props}
        >
            <div
                className="absolute inset-0 pointer-events-none rounded-[500px]"
                style={{
                    padding: '0.5px',
                    background: 'linear-gradient(180deg, var(--Neutrals-01, rgba(255, 255, 255, 0.01)) 0%, var(--Neutrals-40, rgba(255, 255, 255, 0.40)) 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />
            <span className="relative z-10">{children}</span>
        </div>
    );
};

export default ChipBordered;
