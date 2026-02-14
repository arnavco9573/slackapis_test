'use client';

import React, { useEffect, useState } from 'react';
import Bell from '@/components/svg/bell';
import GradientSeparator from '@/components/core/gradient-separator';
import TopBarProfile from '@/components/core/top-bar-profile';
import { createClientBrowser } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';

const TopBar = () => {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClientBrowser();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase]);

    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

    return (
        <nav className="z-49 w-[calc(100%-80px)] left-20 fixed bg-[var(--Primary-800)] h-[126px]">
            <section className="flex justify-between items-center h-full px-[36px]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-medium text-white">
                        Welcome back, {name}!
                    </h1>
                    <p className="text-sm text-text-mid">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>

                <div className="flex justify-end items-center gap-3">
                    <button
                        className="relative p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-text-mid hover:text-white"
                        aria-label="Toggle notifications"
                    >
                        <Bell className="size-5" />
                    </button>

                    <TopBarProfile />
                </div>
            </section>
            <GradientSeparator opacity={0.9} />
        </nav>
    );
};

export default TopBar;
