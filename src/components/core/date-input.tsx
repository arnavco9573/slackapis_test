'use client';
import { cn } from '@/lib/utils';
import DangerSvg from '@/components/svg/danger';
import { useState } from 'react';
import CalendarSvg from '../svg/calendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateInputFieldProps {
  label?: string;
  placeholder: string;
  id: string;
  name: string;
  error?: string;
  suggestion?: string;
  value?: string;
  defaultValue?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  onChange?: (date: string) => void;
  // onChange?: (date: Date | undefined) => void;
}

export default function DateInputField({
  value,
  onChange,
  disablePast = false,
  disableFuture = false,
  ...props
}: DateInputFieldProps) {
  const [selected, setSelected] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [isOpen, setIsOpen] = useState(false);

  const hasValue = !!selected;
  const borderGradient = props.error
    ? 'var(--input-border-error)'
    : isOpen
      ? 'var(--input-border-active)'
      : hasValue
        ? 'var(--input-border-filled)'
        : 'var(--input-border-default)';
  const inputBackground = 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))';

  // In date-input.tsx
  const handleDaySelect = (value: any) => {
    if (value) {
      const selectedDate = dayjs(value).toDate();
      setSelected(selectedDate);
      // Format date as YYYY-MM-DD in local timezone
      const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
      onChange?.(formattedDate);
    } else {
      setSelected(undefined);
      onChange?.('');
    }
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', props.wrapperClassName)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild disabled={props.disabled} className="w-full">
          <div
            className={cn(
              'relative flex flex-col items-start gap-[2px] self-stretch rounded-xl px-4 py-1.5 overflow-hidden',
              props.disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer',
              props.inputClassName
            )}
            style={{
              borderRadius: '8px',
              background: inputBackground,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit]"
              style={{
                padding: '1px',
                background: borderGradient,
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
            {props.label && (
              <span className="text-[12px] leading-[16px] font-normal capitalize text-(--Primary-700,#636363) mr-auto">
                {props.label}
              </span>
            )}

            <div className="flex h-5 w-full items-center justify-between">
              <span
                className={cn(
                  "text-[16px] leading-[20px] font-normal",
                  props.error
                    ? "text-(--System-Negative,#FF5353)"
                    : !selected
                      ? "text-(--Primary-500,#9C9C9C)"
                      : "text-(--Primary-White,#FFF)",
                  props.disabled && "text-(--Primary-500,#9C9C9C)"
                )}
              >
                {selected ? format(selected, 'PPP') : props.placeholder}
              </span>

              <input
                type="hidden"
                name={props.name}
                value={selected ? dayjs(selected).format('YYYY-MM-DD') : ''}
              />

              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
                disabled={props.disabled}
                tabIndex={-1}
              >
                <CalendarSvg className="size-4" />
              </button>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 overflow-hidden rounded-[12px]" align="start" sideOffset={8}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selected ? dayjs(selected) : null}
              disablePast={disablePast}
              disableFuture={disableFuture}
              onChange={handleDaySelect}
              sx={{
                '& .MuiPickersCalendarHeader-root': {
                  color: 'white',
                  '& .MuiIconButton-root': {
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',

                    },
                  },
                },
                '& .MuiDayCalendar-header span': {
                  color: '#888889',
                },
                '& .MuiPickersDay-root': {
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                  '&.Mui-disabled': {
                    color: '#888889',
                  },
                  '&.Mui-disabled:not(.Mui-selected)': {
                    color: 'rgba(255,255,255,0.25)',
                  },
                },
                '& .MuiPickersCalendarHeader-label': {
                  color: 'white',
                  fontWeight: 500,
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  color: '#888889',
                },
                '& .MuiPickersFadeTransitionGroup-root': {
                  color: 'white',
                },
                '& .MuiPickersYear-yearButton': {
                  color: 'white',
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                },
                '& .MuiPickersDay-today': {
                  border: '1px solid var(--Primary-700)',
                  backgroundColor: 'transparent',
                },
                backgroundColor: 'var(--background)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                fontFamily: 'var(--font-primary)',
                overflow: 'hidden',
              }}
            />
          </LocalizationProvider>
        </PopoverContent>
      </Popover>

      {
        props.error && (
          <div className="flex items-center gap-2 mt-2">
            <DangerSvg className="text-negative size-[14px]" />
            <span className="text-negative text-xs">{props.error}</span>
          </div>
        )
      }
      {
        props.suggestion && (
          <span className="text-secondary-text text-xs leading-tight">
            {props.suggestion}
          </span>
        )
      }
    </div >
  );
}
