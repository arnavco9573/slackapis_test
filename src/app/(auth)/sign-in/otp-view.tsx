"use client";

import { useAuthFlowStore } from "@/store/use-auth-flow-store";
import { useOtp } from "@/app/(auth)/hooks/use-otp";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function OtpView() {
    const { pop } = useAuthFlowStore();
    const { verify, isLoading, error, email } = useOtp();
    const [otp, setOtp] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await verify(otp);
        router.push('/dashboard');
    };

    return (
        <div className="w-full max-w-md p-6 rounded-lg shadow bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="mb-6 text-center">
                <button
                    onClick={() => pop()}
                    className="mb-4 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                    ← Back to Login
                </button>
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Verify OTP
                </h1>
                <p className="text-sm text-zinc-500 mt-2">
                    Enter the code sent to {email}
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 border border-red-200 text-red-700 text-sm dark:bg-red-900/30 dark:border-red-900 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <input
                        type="text"
                        placeholder="000000"
                        maxLength={8}
                        className="w-full text-center text-2xl tracking-[0.5em] border rounded px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white dark:border-zinc-700"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                </button>
            </form>
        </div>
    );
}
