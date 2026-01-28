"use client";

import { useAuthFlowStore } from "@/store/use-auth-flow-store";
import { SignInView } from "@/app/(auth)/sign-in/sign-in-view";
import { OtpView } from "./otp-view";

export default function LoginPage() {
    const currentView = useAuthFlowStore(state => state.currentView());

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black transition-colors duration-500">
            {currentView === 'SIGN_IN' && <SignInView />}
            {currentView === 'OTP' && <OtpView />}
        </div>
    );
}
