'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import DangerSvg from '@/components/svg/danger';
interface TextareaFieldProps {
  label?: string;
  placeholder: string;
  id: string;
  name: string;
  error?: string;
  suggestion?: string;
  value?: string;
  defaultValue?: string;
  wrapperClassName?: string;
  wrapperStyles?: React.CSSProperties;
  inputClassName?: string;
  disabled?: boolean;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  addon?: React.ReactNode;
}

export default function TextareaField({ ...props }: TextareaFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue =
    props.value !== undefined && props.value !== null && props.value !== ''
      ? true
      : !!props.defaultValue;

  const borderGradient = props.error
    ? 'var(--input-border-error)'
    : isFocused
      ? 'var(--input-border-active)'
      : hasValue
        ? 'var(--input-border-filled)'
        : 'var(--input-border-default)';
  const inputBackground = 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))';

  return (
    <div
      className={cn('relative flex flex-col gap-1 w-full', props.wrapperClassName)}
      style={props.wrapperStyles}
    >
      <div
        className={cn(
          'relative flex flex-col items-start gap-2 self-stretch rounded-xl px-4 py-1.5',
          props.inputClassName
        )}
        style={{
          borderRadius: 'var(--input-border-radius, 8px)',
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
          <span className="text-text-low-disabled text-sm font-normal capitalize">
            {props.label}
          </span>
        )}

        {/* ${props.type === "number" ? "pl-2" : ""} */}
        <textarea
          autoComplete="off"
          className={`resize-none min-h-[19px] w-full relative bg-transparent text-base text-cta-text outline-none placeholder:text-wrap`}
          placeholder={props.placeholder}
          id={props.id}
          name={props.name}
          value={props.value}
          defaultValue={props.defaultValue}
          onChange={props.onChange}
          disabled={props.disabled}
          rows={props.rows || 2}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {props.error && (
        <div className="flex items-center gap-2">
          <DangerSvg className="text-negative size-[14px]" />
          <span className="text-negative text-xs">{props.error}</span>
        </div>
      )}
      {props.suggestion && (
        <span className="text-text-mid ml-1 text-[10px] leading-tight">
          {props.suggestion}
        </span>
      )}
    </div>
  );
}
