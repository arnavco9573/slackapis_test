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

            // Success - Now login to CometChat
            console.log("✅ OTP verified, logging into CometChat...");

            // Persist user details for other components (like SendBird)
            if (email) localStorage.setItem('userEmail', email);
            if (res.sendbirdUid) localStorage.setItem('sendbirdUid', res.sendbirdUid);

            if (res.cometChatUid) {
                try {
                    const { CometChatUIKit } = await import("@cometchat/chat-uikit-react");
                    const loggedInUser = await CometChatUIKit.getLoggedinUser();

                    if (!loggedInUser) {
                        const user = await CometChatUIKit.login(res.cometChatUid);
                        console.log("✅ CometChat Login Successful:", {
                            uid: user.getUid(),
                            name: user.getName(),
                        });
                    } else {
                        console.log("ℹ️ Already logged into CometChat");
                    }
                } catch (cometError: any) {
                    console.error("⚠️ CometChat login warning:", cometError);
                    // Continue to dashboard even if CometChat fails
                }
            }

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
