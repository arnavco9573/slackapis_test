import { useState } from "react";
import { useAuthFlowStore } from "@/store/use-auth-flow-store";
import { verifyOtpAction } from "../actions";
import { useRouter } from "next/navigation";

export function useOtp() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { email } = useAuthFlowStore();
    const router = useRouter();

    const verify = async (otp: string) => {
        if (!email) {
            setError("Email missing. Please restart login.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await verifyOtpAction(email, otp);

            if (res?.error) {
                setError(res.error);
                return;
            }

            // Persist user details
            if (email) localStorage.setItem('userEmail', email);

            console.log("Redirecting to dashboard...");
            router.push('/dashboard');
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        verify,
        isLoading,
        error,
        email
    };
}
