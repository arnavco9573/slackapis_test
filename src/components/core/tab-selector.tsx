'use client';

import { cn } from '@/lib/utils';
import { InfoTooltip } from '../core/info-tooltip';

interface TabSelectorProps<T extends string> {
  tabs: {
    id: T;
    label: string;
    tooltip?: string;
  }[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  className?: string;
}

const TabSelector = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabSelectorProps<T>) => {
  const baseButtonClasses =
    'section-title relative font-normal tracking-wide cursor-pointer';
  const inactiveClasses = 'text-text-mid';
  const activeIndicatorClasses =
    'w-[55px] h-8 absolute left-1/2 -translate-x-1/2 bg-inner-gred-graph-2 blur-[20px]';
  const underlineClasses =
    'absolute -bottom-2 left-0 h-0.5 w-[50px] -translate-x-1/2 left-1/2 bg-cta-text/70 mask-r-from-50% mask-l-from-50%';

  return (
    <div className={cn('flex gap-4', className)}>
      {tabs.map((tab) => (
        <div key={tab.id} className='flex items-center gap-2'>
          <button
            onClick={() => onTabChange(tab.id)}
            className={cn(
              baseButtonClasses,
              activeTab !== tab.id && inactiveClasses,
              'relative'
            )}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <>
                <span className={activeIndicatorClasses} />
                <span className={underlineClasses} />
              </>
            )}
          </button>
          {tab.tooltip && <InfoTooltip content={tab.tooltip} />}
        </div>
      ))}
    </div>
  );
};

export default TabSelector;
