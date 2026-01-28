"use client";

import { useState } from "react";
import { useSignIn } from "../hooks/use-sign-in";

export function SignInView() {
    const { signIn, isLoading, error } = useSignIn();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await signIn(email);
    };

    return (
        <div className="w-full max-w-md p-6 rounded-lg shadow bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl font-semibold mb-6 text-center text-zinc-900 dark:text-zinc-100">
                Master Login
            </h1>

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 border border-red-200 text-red-700 text-sm dark:bg-red-900/30 dark:border-red-900 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white dark:border-zinc-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Removed Password field as we are doing OTP only per prompt implication of "allow to send the otp" */}

                <button
                    type="submit"
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? "Sending OTP..." : "Continue"}
                </button>
            </form>
        </div>
    );
}
