import { useState } from "react";
import { useAuthFlowStore } from "@/store/use-auth-flow-store";
import { signInWithEmailAction } from "../actions";

export function useSignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { push, setEmail } = useAuthFlowStore();

    const signIn = async (email: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await signInWithEmailAction(email);

            if (res.error) {
                setError(res.error);
                return;
            }

            // Success
            setEmail(email);
            push('OTP');
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signIn,
        isLoading,
        error
    };
}
