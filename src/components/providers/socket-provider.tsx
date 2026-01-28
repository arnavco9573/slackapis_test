"use client";

import { useSlackSocket } from "@/hooks/use-slack-socket";
import { useEffect } from "react";

/**
 * This component initializes the global socket connection.
 * It must be rendered inside QueryClientProvider.
 */
export function SocketProvider() {
    console.log('🔌 [SocketProvider] Component rendering...');

    useEffect(() => {
        console.log('🔌 [SocketProvider] Component mounted!');
    }, []);

    useSlackSocket();

    // Return an actual element (hidden) instead of null
    // This ensures React commits the component and runs effects
    return <div style={{ display: 'none' }} data-socket-provider="true" />;
}
