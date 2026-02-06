'use client';
import React, {
    useCallback,
    useState,
    forwardRef,
    useEffect,
    useRef,
    useMemo,
} from 'react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

// utils
import { cn } from '@/lib/utils';

// assets
import { ChevronDown, CheckIcon, Globe } from 'lucide-react';
import { CircleFlag } from 'react-circle-flags';

// data
import { Country } from 'country-state-city';
import DangerSvg from '../svg/danger';

// Country interface
export interface CountryType {
    isoCode: string;
    name: string;
    phonecode: string;
    flag: string;
    currency: string;
    latitude: string;
    longitude: string;
    timezones?: Array<{
        zoneName: string;
        gmtOffset: number;
        gmtOffsetName: string;
        abbreviation: string;
        tzName: string;
    }>;
}

// Dropdown props
interface CountryDropdownProps {
    options?: any[]; // Using any to avoid strict type issues with country-state-city types if they differ slightly
    onChange?: (country: CountryType) => void;
    defaultValue?: string;
    disabled?: boolean;
    placeholder?: string;
    slim?: boolean;
    label?: string;
    error?: string;
}

const CountryDropdownComponent = (
    {
        options: propOptions,
        onChange,
        defaultValue,
        disabled = false,
        placeholder = 'Select a country',
        slim = false,
        label,
        error,
        ...props
    }: CountryDropdownProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) => {
    const [open, setOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<
        CountryType | undefined
    >(undefined);

    const [search, setSearch] = useState('');
    const firstResultRef = useRef<HTMLDivElement | null>(null);

    const hasValue = !!selectedCountry;

    const borderGradient = error
        ? 'var(--input-border-error)'
        : isFocused || open
            ? 'var(--input-border-active)'
            : hasValue
                ? 'var(--input-border-filled)'
                : 'var(--input-border-default)';
    const inputBackground =
        'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))';

    const options = useMemo(() => {
        if (propOptions) return propOptions;
        return (Country.getAllCountries() as unknown as CountryType[]).filter(
            (country: CountryType) => country.isoCode !== 'KP'
        );
    }, [propOptions]);

    useEffect(() => {
        if (defaultValue) {
            const initialCountry = options.find(
                (country) => country.name === defaultValue
            );
            if (initialCountry) {
                setSelectedCountry(initialCountry);
            } else {
                // Reset selected country if defaultValue is not found
                setSelectedCountry(undefined);
            }
        } else {
            // Reset selected country if defaultValue is undefined or null
            setSelectedCountry(undefined);
        }
    }, [defaultValue, options]);

    const handleSelect = useCallback(
        (country: CountryType) => {
            setSelectedCountry(country);
            onChange?.(country);
            setOpen(false);
        },
        [onChange]
    );

    // filter based on search
    const filteredOptions = options.filter((x) =>
        x.name?.toLowerCase().includes(search?.toLowerCase())
    );

    // scroll first result into view when search changes
    useEffect(() => {
        if (firstResultRef.current) {
            firstResultRef.current.scrollIntoView({ block: 'nearest' });
        }
    }, [search]);

    const triggerClasses = cn(
        'relative flex flex-col items-start gap-[2px] self-stretch rounded-xl px-4 py-1.5 w-full cursor-pointer h-auto',
        slim === true && 'w-20'
    );

    return (
        <div className='relative w-full group'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    ref={ref}
                    className={triggerClasses}
                    disabled={disabled}
                    onClick={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        background: inputBackground,
                    }}
                    {...props}
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

                    {label && (
                        <span className="text-[12px] leading-[16px] font-normal capitalize text-(--Primary-700,#636363) z-10">
                            {label}
                        </span>
                    )}

                    <div className="flex items-center justify-between w-full z-10">
                        {selectedCountry ? (
                            <div className="flex items-center grow w-0 gap-2 overflow-hidden h-7">
                                <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                                    <CircleFlag
                                        countryCode={selectedCountry.isoCode?.toLowerCase()}
                                        height={20}
                                    />
                                </div>
                                {slim === false && (
                                    <span className="overflow-hidden text-white text-ellipsis whitespace-nowrap text-[16px] leading-[20px]">
                                        {selectedCountry.name}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-500 text-[16px] leading-[20px] h-7 flex items-center">
                                {slim === false ? placeholder : <Globe size={20} />}
                            </span>
                        )}
                        <ChevronDown size={16} className="text-gray-500 shrink-0" />
                    </div>
                </PopoverTrigger>
                {error && (
                    <div className="flex items-center gap-2 mt-2">
                        <DangerSvg className="text-red-500 size-[14px]" />
                        <span className="text-red-500 text-xs">
                            {error}
                        </span>
                    </div>
                )}
                <PopoverContent
                    collisionPadding={10}
                    side="bottom"
                    className="w-(--radix-popper-anchor-width) min-w-(--radix-popper-anchor-width) p-0 rounded-xl overflow-hidden bg-[#1D1E21] border-white/10"
                >
                    <Command
                        shouldFilter={false}
                        className="w-full max-h-[200px] sm:max-h-[270px] bg-transparent"
                    >
                        <CommandList className="custom-scrollbar">
                            <CommandInput
                                placeholder="Search country..."
                                value={search}
                                onValueChange={setSearch}
                                className="border-none focus:ring-0"
                            />
                            <CommandEmpty className="py-6 text-center text-sm text-gray-500">No country found.</CommandEmpty>
                            <CommandGroup>
                                {filteredOptions
                                    .filter((x) => x.name)
                                    .map((option, key: number) => (
                                        <CommandItem
                                            className="flex items-center cursor-pointer w-full gap-2 px-2 py-1.5 hover:bg-white/5 data-[selected=true]:bg-white/5"
                                            key={key}
                                            onSelect={() => handleSelect(option)}
                                        >
                                            <div className="flex w-full items-center justify-start gap-2 text-left sm:gap-3 sm:px-1 sm:py-1">
                                                <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                                                    <CircleFlag
                                                        countryCode={option.isoCode?.toLowerCase()}
                                                        height={20}
                                                    />
                                                </div>

                                                <span className="truncate text-xs sm:text-sm text-white">
                                                    {option.name}
                                                </span>
                                            </div>
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto h-4 w-4 shrink-0 text-white',
                                                    option.name === selectedCountry?.name
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

CountryDropdownComponent.displayName = 'CountryDropdownComponent';

export const CountryDropdown = forwardRef(CountryDropdownComponent);
