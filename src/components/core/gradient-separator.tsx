import { cn } from '@/lib/utils';
import React from 'react';

interface GradientSeparatorProps {
    className?: string;
    opacity?: number;
}

const GradientSeparator = ({
    className,
    opacity = 1,
}: GradientSeparatorProps) => {
    return (
        <div
            className={cn('w-full h-[1px]', className)}
            style={{
                background:
                    'linear-gradient(90deg, #1A1B1E 0%, #3F4042 50%, #1A1B1E 100%)',
                opacity: opacity,
            }}
        />
    );
};

export default GradientSeparator;
