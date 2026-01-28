"use client";

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import {
    LayoutDashboard,
    ClipboardList,
    FolderOpen,
    GraduationCap,
    Award,
    MessageSquare,
    Phone,
    Sun,
    Moon,
    Bug,
    Loader2,
    Rocket
} from 'lucide-react';

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

    if (!isMounted) return null;

    return (
        <div className="absolute items-center gap-6 flex bottom-10 left-[72px]">
            <button
                onClick={() => toggleTheme('light')}
                className={cn(
                    'flex w-7 h-7 p-1 justify-center items-center rounded-[40px] transition-colors cursor-pointer',
                    theme === 'dark'
                        ? 'bg-cta-fill-bottom100 border-b border-r border-neutral-25 text-cta-text'
                        : 'bg-neutral-05 text-text-low-disabled cursor-default'
                )}
                aria-label="Switch to light mode"
            >
                <Sun className="size-4" />
            </button>
            <button
                onClick={() => toggleTheme('dark')}
                className={cn(
                    'flex w-7 h-7 p-1 justify-center items-center rounded-[40px] transition-colors cursor-pointer',
                    theme === 'light'
                        ? 'bg-cta-fill-bottom100 border-b border-r border-neutral-25 text-cta-text'
                        : 'bg-neutral-05 text-text-low-disabled cursor-default'
                )}
                aria-label="Switch to dark mode"
            >
                <Moon className="size-4" />
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
        icon: FolderOpen,
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

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const { isMounted } = useTheme();

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

    if (!isMounted) return null;

    return (
        <aside
            onMouseLeave={handleMouseLeave}
            className={cn(
                'bg-(--Primary-900) fixed top-0 left-0 z-50 h-svh max-h-svh w-20 transition-all duration-300 ease-in-out flex flex-col py-8 items-center gap-12 overflow-hidden shadow-xl border-r border-gray-100 dark:border-gray-800',
                isExpanded ? 'w-56 shadow-2xl' : ''
            )}
        >
            <div
                onMouseEnter={handleMouseEnter}
                className={cn(
                    'w-full flex justify-center transition-all',
                    isExpanded ? 'px-6' : 'px-4'
                )}
            >
                {/* Placeholder Logo using generic image or icon if env missing */}
                <img
                    src={process.env.NEXT_PUBLIC_LOGO_URL || 'https://placehold.co/100x100?text=Logo'}
                    alt="Logo"
                    className="w-10 h-10 object-contain transition-all duration-300 rounded mb-2"
                />
            </div>

            <div
                onMouseEnter={handleMouseEnter}
                className={cn(
                    'flex flex-col w-full gap-3 transition-all',
                    isExpanded ? 'items-start px-6' : 'items-center px-3'
                )}
            >
                {sidebarStates.map((item) => {
                    // Robust active check: use exact match for paths with similar prefixes
                    // For paths like /communication, /communication-comet, /communication-sendbird
                    const isActive = pathname === item.path ||
                        (pathname.startsWith(item.path + '/') && item.path !== '/communication');
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
                                'relative py-2 flex min-h-[44px] h-auto tracking-wide items-center rounded-xl transition-all cursor-pointer w-full group',
                                isExpanded ? 'justify-start pl-5 pr-6 gap-2' : 'justify-center',
                                isActive
                                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 font-semibold'
                                    : 'text-gray-500 dark:text-gray-400 font-normal hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                            disabled={isLoading === item.id}
                        >
                            {isActive && (
                                <div
                                    className={cn(
                                        'absolute top-1/2 -translate-y-1/2 transition-all h-8 w-1 bg-blue-600 rounded-r-md',
                                        isExpanded ? '-left-6' : '-left-3'
                                    )}
                                />
                            )}

                            <div className="relative flex justify-center items-center shrink-0 z-10">
                                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300")} />
                            </div>

                            <span
                                className={cn(
                                    'text-sm leading-[18px] break-keep text-left overflow-hidden whitespace-normal transition-all duration-300 delay-150 z-10',
                                    isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'
                                )}
                            >
                                {item.name}
                            </span>

                            {isLoading === item.id && (
                                <div
                                    className={cn(
                                        'absolute right-2 top-1/2 -translate-y-1/2 transition-opacity',
                                        isExpanded ? 'opacity-100' : 'opacity-0'
                                    )}
                                >
                                    <Loader2 size={16} className="animate-spin text-blue-500" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div
                className={cn(
                    "absolute bottom-8 left-0 w-full transition-all duration-300 flex flex-col gap-4 items-center"
                )}
            >
                <div
                    className={cn(
                        "flex flex-col items-center w-full transition-all duration-300",
                        isExpanded ? "px-6" : "px-0"
                    )}
                >
                    <div className={cn("w-full h-px bg-gray-200 dark:bg-gray-800 mb-2 transition-all", isExpanded ? "opacity-100" : "opacity-0 w-0")} />

                    <button
                        onClick={() => router.push("/report-bug")}
                        className={cn(
                            "relative py-2 flex h-11 tracking-wide items-center rounded-xl transition-all cursor-pointer w-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400",
                            isExpanded ? "justify-start px-5 gap-2.5" : "justify-center"
                        )}
                        title="Report a Bug"
                    >
                        <div className="relative flex items-center justify-center shrink-0 z-10">
                            <Bug className="h-5 w-5" />
                        </div>

                        <span
                            className={cn(
                                "text-sm leading-[18px] break-keep text-left overflow-hidden whitespace-nowrap transition-all duration-300 delay-150 z-10",
                                isExpanded ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
                            )}
                        >
                            Report a Bug
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
