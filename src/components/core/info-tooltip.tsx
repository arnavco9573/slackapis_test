'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import React from 'react';

const TooltipArrow = React.forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<'svg'>>((props, ref) => (
  <svg
    {...props}
    ref={ref}
    width="28"
    height="10"
    viewBox="0 0 28 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.90245 7.31794L10.5488 1.84104C12.183 -0.613679 15.817 -0.613679 17.4512 1.84104L21.0976 7.31793C22.628 9.61672 25.2211 11 28 11H0C2.77889 11 5.372 9.61673 6.90245 7.31794Z"
      fill="white"
      fillOpacity="0.1"
    />
  </svg>
));
TooltipArrow.displayName = 'TooltipArrow';

export const TooltipWrapper = ({
  content,
  children,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        {content && (
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-1000 max-w-xs px-3 py-1.5 backdrop-blur-2xl wrap-break-word"
              style={{
                borderRadius: '8px',
                background: 'var(--Neutral-Neutrals-10, rgba(255, 255, 255, 0.10))',
                fontSize: '16px',
                lineHeight: '20px',
                color: 'var(--text-text-highest, #FFF)',
              }}
              sideOffset={4}
              side="bottom"
              onPointerDownOutside={(event: unknown) => {
                (event as Event).preventDefault();
              }}
            >
              {content}
              <Tooltip.Arrow asChild width={28} height={10}>
                <TooltipArrow className="mt-0 rotate-180" />
              </Tooltip.Arrow>
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export const InfoTooltip = ({ content }: { content: string }) => {
  return (
    <TooltipWrapper content={content}>
      <button
        className="w-fit text-neutral-70 hover:text-cta-text transition-colors focus:outline-none z-49"
        aria-label="More information"
      >
        <Info className="h-4 w-4" />
      </button>
    </TooltipWrapper>
  );
};
