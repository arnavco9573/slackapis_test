"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { SocketProvider } from "@/components/providers/socket-provider";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider />
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        style={{ zIndex: 99999 }}
        toastOptions={{
          style: { zIndex: 99999 }
        }}
      />
    </QueryClientProvider>
  );
}
