'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import {
    LayoutDashboard,
    ClipboardList,
    FileText,
    GraduationCap,
    Award,
    MessageSquare,
    Phone,
    Sun,
    Moon,
    Bug,
    Loader2,
    ExternalLink
} from 'lucide-react';
import ReportBugSvg from '../svg/report-bug';
import PageLoader from '../svg/page-loading';
import Logo from '../svg/logo';
import ActiveEllipseSvg from '../svg/active-ellipse';
import ActiveLineSvg from '../svg/active-line';

// Custom hook for theme management
const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [isMounted, setIsMounted] = useState(false);

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const initialTheme = savedTheme || 'dark';

        setTheme(initialTheme);
        document.body.setAttribute('data-theme', initialTheme);
        setIsMounted(true);

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
                document.body.setAttribute('data-theme', newTheme);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

    return { theme, toggleTheme, isMounted };
};

// Theme Toggle Buttons Component
export const ThemeButtons = () => {
    const { theme, toggleTheme, isMounted } = useTheme();

    // Don't render until we've determined the theme to prevent flash of incorrect theme
    if (!isMounted) return null;

    return (
        <div className="absolute items-center gap-6 flex bottom-10 left-[72px]">
            <button
                onClick={() => toggleTheme('light')}
                className={cn(
                    'flex w-7 h-7 p-1 justify-center items-center rounded-[40px] transition-colors cursor-pointer',
                    theme === 'dark'
                        ? 'bg-zinc-800 border-b border-r border-zinc-700 text-white'
                        : 'bg-zinc-100 text-zinc-400 cursor-default'
                )}
                aria-label="Switch to light mode"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => toggleTheme('dark')}
                className={cn(
                    'flex w-7 h-7 p-1 justify-center items-center rounded-[40px] transition-colors cursor-pointer',
                    theme === 'light'
                        ? 'bg-zinc-800 border-b border-r border-zinc-700 text-white'
                        : 'bg-zinc-100 text-zinc-400 cursor-default'
                )}
                aria-label="Switch to dark mode"
            >
                <Moon className="w-4 h-4" />
            </button>
        </div>
    );
};

const sidebarStates = [
    {
        id: 'dashboard',
        icon: LayoutDashboard,
        name: 'Dashboard',
        path: '/dashboard',
    },
    {
        id: 'operational-checklist',
        icon: ClipboardList,
        name: 'Operational Checklist',
        path: '/operational-checklist',
    },
    {
        id: 'document-cabinet',
        icon: FileText,
        name: 'Document Cabinet',
        path: '/document-cabinet',
    },
    {
        id: 'learn',
        icon: GraduationCap,
        name: 'Learn',
        path: '/learn',
    },
    {
        id: 'certificates',
        icon: Award,
        name: 'Certificates',
        path: '/certificates',
    },
    {
        id: 'communication',
        icon: MessageSquare,
        name: 'Communication',
        path: '/communication',
    },
    {
        id: 'book-a-call',
        icon: Phone,
        name: 'Book a call',
        path: '/book-a-call',
    },
];

const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const { theme, toggleTheme, isMounted } = useTheme();

    // Reset loading state when pathname changes
    useEffect(() => {
        setIsLoading(null);
    }, [pathname]);

    const [isExpanded, setIsExpanded] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, 300);
    };

    // Don't render until we've determined the theme to prevent flash of incorrect theme
    if (!isMounted) return null;

    return (
        <aside
            onMouseLeave={handleMouseLeave}
            className={cn(
                'bg-[var(--Primary-900)] fixed top-0 left-0 z-41 h-[100svh] max-h-[100svh] w-20 transition-all duration-300 ease-in-out flex flex-col py-8 items-center gap-12  border-container-border-mid50/10 overflow-hidden shadow-xl',
                isExpanded ? 'w-56 shadow-2xl' : '',
                theme === 'dark' ? 'dark' : 'light'
            )}
        >
            <div
                onMouseEnter={handleMouseEnter}
                className={cn(
                    'w-full flex justify-center transition-all',
                    isExpanded ? 'px-6' : 'px-4'
                )}
            >
                <Logo className="w-12 h-12 transition-all duration-300" />
            </div>

            <div
                onMouseEnter={handleMouseEnter}
                className={cn(
                    'flex flex-col w-full gap-3 transition-all',
                    isExpanded ? 'items-start px-6' : 'items-center px-3'
                )}
            >
                {sidebarStates.map((item) => {
                    const isActive = pathname.split('/')[1] === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (isLoading !== item.id && pathname !== item.path) {
                                    setIsLoading(item.id);
                                    router.push(item.path);
                                }
                            }}
                            className={cn(
                                'relative py-2 flex min-h-[44px] h-auto tracking-wide items-center rounded-xl transition-all cursor-pointer w-full',
                                isExpanded ? 'justify-start pl-5 pr-6 gap-2' : 'justify-center',
                                isActive
                                    ? 'text-cta-text font-semibold'
                                    : 'text-text-mid font-normal hover:bg-neutral-03/50'
                            )}
                            disabled={isLoading === item.id}
                        >
                            {isActive && (
                                <div
                                    className={cn(
                                        'absolute top-1/2 -translate-y-1/2 transition-all',
                                        isExpanded ? '-left-6' : '-left-3'
                                    )}
                                >
                                    <ActiveLineSvg />
                                </div>
                            )}

                            <div className="relative flex justify-center items-center flex-shrink-0 z-10">
                                {isActive && !isExpanded && (
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">
                                        <ActiveEllipseSvg />
                                    </div>
                                )}
                                <item.icon className="h-5 w-5" />
                            </div>

                            <span
                                className={cn(
                                    'text-base leading-[18px] break-keep text-left overflow-hidden whitespace-normal transition-all duration-300 delay-150 z-10',
                                    isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
                                )}
                            >
                                {item.name}
                            </span>
                            {isActive && (
                                <span
                                    className={cn(
                                        'w-20 h-[18px] absolute bg-neutral-50 blur-2xl top-[15px] left-[47px] pointer-events-none transition-opacity',
                                        isExpanded ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                            )}
                            {isLoading === item.id && (
                                <div
                                    className={cn(
                                        'absolute right-2 top-1/2 -translate-y-1/2 transition-opacity',
                                        isExpanded ? 'opacity-100' : 'opacity-0'
                                    )}
                                >
                                    <PageLoader size={20} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div
                className={cn(
                    'absolute bottom-8 left-0 w-full transition-all duration-300 flex flex-col gap-4 items-center'
                )}
            >
                <div
                    className={cn(
                        'flex items-center transition-all duration-300',
                        isExpanded ? 'flex-row gap-6' : 'flex-col gap-4'
                    )}
                >
                    {/* <button
            onClick={() => toggleTheme('dark')}
            className={cn(
              'flex w-7 h-7 p-1 justify-center items-center rounded-full transition-all cursor-pointer border',
              theme === 'dark'
                ? 'text-cta-text border-[#636363]'
                : 'text-text-mid border-transparent hover:text-cta-text/70'
            )}
            style={
              theme === 'dark'
                ? {
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.00) 105.1%)',
                }
                : {}
            }
            aria-label="Switch to dark mode"
          >
            <MoonSvg className="size-4" />
          </button> */}
                    {/* <button
            onClick={() => toggleTheme('light')}
            className={cn(
              'flex w-7 h-7 p-1 justify-center items-center rounded-full transition-all cursor-pointer border',
              theme === 'light'
                ? 'text-cta-text border-[#636363]'
                : 'text-text-mid border-transparent hover:text-cta-text/70'
            )}
            style={
              theme === 'light'
                ? {
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.10) -0.21%, rgba(255, 255, 255, 0.00) 105.1%)',
                }
                : {}
            }
            aria-label="Switch to light mode"
          >
            <SunSvg className="size-4" />
          </button> */}
                </div>

                <div
                    className={cn(
                        'flex flex-col items-center w-full transition-all duration-300',
                        isExpanded ? 'px-6' : 'px-0'
                    )}
                >
                    <div
                        className={cn(
                            'w-full h-px bg-neutral-05 mb-2',
                            isExpanded ? 'opacity-100' : 'opacity-0 w-0'
                        )}
                    />

                    {/* <button
            onClick={() => router.push('/report-bug')}
            className={cn(
              'relative py-2 flex h-11 tracking-wide items-center rounded-xl transition-all cursor-pointer w-full text-text-mid font-normal hover:bg-neutral-03/50',
              isExpanded ? 'justify-start px-5 gap-2.5' : 'justify-center'
            )}
          >
            <div className="relative flex items-center justify-center flex-shrink-0 z-10">
              <ReportBugSvg className="h-5 w-5" />
            </div>

            <span
              className={cn(
                'text-base leading-[18px] break-keep text-left overflow-hidden whitespace-nowrap transition-all duration-300 delay-150 z-10',
                isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
              )}
            >
              Report a Bug
            </span>
          </button> */}
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
