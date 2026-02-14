'use client';
import { TooltipWrapper } from '@/components/core/info-tooltip';
import DangerSvg from '@/components/svg/danger';
import EyeSvg from '@/components/svg/eye';
import EyeCloseSvg from '@/components/svg/eye-close';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface InputFieldProps {
  label?: string;
  placeholder: string;
  type: 'text' | 'password' | 'email' | 'tel' | 'number';
  inputMode?: 'text' | 'email' | 'numeric' | 'tel' | 'decimal';
  id: string;
  name: string;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
  step?: string;
  error?: string;
  suggestion?: string;
  value?: string | number;
  defaultValue?: string;
  currentPassword?: boolean;
  wrapperClassName?: string;
  wrapperStyles?: React.CSSProperties;
  inputClassName?: string;
  placeholderClassName?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addon?: React.ReactNode;
  addonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  startAdornment?: React.ReactNode;
  readOnly?: boolean;
  pattern?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ currentPassword = false, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(currentPassword);
    const [isFocused, setIsFocused] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

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
    const inputBackground =
      'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))';

    const handlePasswordVisibility = (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      setIsPasswordVisible(!isPasswordVisible);
    };

    const handleExtensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValidationMessage(e.target.validationMessage);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div
        className={cn(
          'relative flex flex-col gap-1 w-full',
          props.wrapperClassName
        )}
        style={props.wrapperStyles}
      >
        <div
          className={cn(
            'relative flex flex-col items-start gap-[2px] self-stretch rounded-xl px-4 py-1.5',
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
            <span className="text-[12px] leading-[16px] font-normal capitalize text-(--Primary-700,#636363)">
              {props.label}
            </span>
          )}

          {/* ${props.type === "number" ? "pl-2" : ""} */}
          <TooltipWrapper content={validationMessage}>
            <input
              ref={ref}
              autoComplete="off"
              type={isPasswordVisible ? 'text' : props.type}
              className={cn(
                'h-[19px] w-full relative -translate-y-px bg-transparent outline-none placeholder:text-wrap',
                'text-[16px] leading-[20px] font-normal',
                'placeholder:text-(--Primary-500,#9C9C9C) placeholder:text-[16px]',
                props.error
                  ? 'text-(--System-Negative,#FF5353)'
                  : 'text-(--Primary-White,#FFF)',
                props.disabled &&
                'text-(--Primary-500,#9C9C9C) cursor-not-allowed',
                !isPasswordVisible &&
                props.type === 'password' &&
                'tracking-widest font-bold text-lg placeholder:tracking-normal placeholder:font-normal placeholder:text-[16px]',
                props.placeholderClassName
              )}
              placeholder={props.placeholder}
              id={props.id}
              name={props.name}
              value={props.value}
              defaultValue={props.defaultValue}
              readOnly={props.readOnly}
              onChange={handleExtensionChange}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              onKeyDown={props.onKeyDown}
              maxLength={props.maxLength}
              minLength={props.minLength}
              disabled={props.disabled}
              inputMode={props.inputMode}
              pattern={props.pattern}
              max={props.max}
              min={props.min}
              step={props.step}
              title=""
            />
          </TooltipWrapper>
          {/* {props.type === "number" && (
					<div
						className={` ${
							props.value ? "text-cta-text" : "text-text-mid"
						} absolute top-[30px] left-3 cursor-pointer`}
					>
						$
					</div>
				)} */}
          {props.type === 'password' && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handlePasswordVisibility}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
            >
              {isPasswordVisible ? <EyeSvg /> : <EyeCloseSvg />}
            </button>
          )}
          {props.addon && (
            <button
              type="button"
              onClick={props.addonClick}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
            >
              {props.addon}
            </button>
          )}
          {props.startAdornment && (
            <div className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none flex items-center justify-center">
              {props.startAdornment}
            </div>
          )}
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
);

InputField.displayName = 'InputField';

export default InputField;

interface CurrencyInputProps
  extends Omit<InputFieldProps, 'onChange' | 'value'> {
  value?: number | null;
  onChange?: (value: number | null) => void;
  currencySymbol?: string;
  decimals?: number;
}

export function CurrencyInput({
  value,
  onChange,
  currencySymbol = '$',
  decimals = 0,
  ...props
}: CurrencyInputProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(
      value !== null && value !== undefined ? value.toString() : ''
    );
  }, [value]);

  const formatDisplay = (val: string) => {
    if (!val) return '';

    const hasDecimal = val.includes('.');
    const [intPart, decPart] = val.split('.');

    // Add commas to integer part
    const formatted = intPart ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

    // Return with or without decimal
    return (
      currencySymbol + formatted + (hasDecimal ? '.' + (decPart || '') : '')
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (input === '') {
      setInputValue('');
      if (onChange) onChange(null);
      return;
    }

    // Remove everything except numbers and decimal point (only if decimals allowed)
    const cleaned =
      decimals > 0 ? input.replace(/[^0-9.]/g, '') : input.replace(/\D/g, '');

    // Allow only one decimal point if decimals > 0
    const parts = cleaned.split('.');
    const newValue =
      decimals > 0 && parts.length > 1
        ? parts[0] + '.' + parts.slice(1).join('').slice(0, decimals)
        : cleaned;

    setInputValue(newValue);

    const numValue = parseFloat(newValue);
    if (onChange && !isNaN(numValue)) {
      onChange(numValue);
    } else if (onChange && newValue === '') {
      onChange(null);
    }
  };

  return (
    <InputField
      {...props}
      type="text"
      inputMode={decimals > 0 ? 'decimal' : 'numeric'}
      value={formatDisplay(inputValue)}
      onChange={handleChange}
    />
  );
}
