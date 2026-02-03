'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { createClientBrowser } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

const TopBarProfile = () => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClientBrowser();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, [supabase]);

    const logoUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    // Fallback to email username if no full name
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

    if (loading) return null;

    return (
        <Link
            href="/profile"
            className="relative cursor-pointer hover:opacity-80 transition-opacity"
        >
            <div className="flex items-center gap-3">
                {logoUrl ? (
                    <div className="relative">
                        <Image
                            src={logoUrl}
                            width={40}
                            height={40}
                            className="rounded-full size-10 object-cover"
                            alt="user-avatar"
                        />
                    </div>
                ) : (
                    <div className="size-10 flex items-center justify-center rounded-full border border-neutral-15 bg-neutral-10">
                        <User className="text-text-mid size-5" />
                    </div>
                )}
                <div className="flex flex-col">
                    <h3 className="font-semibold text-sm leading-tight text-white">
                        {name}
                    </h3>
                    <span className="text-xs text-text-low">
                        @{name.toLowerCase().replace(/\s+/g, '')}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default TopBarProfile;
