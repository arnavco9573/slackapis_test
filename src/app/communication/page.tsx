import { Suspense } from "react";
import { SlackInterface } from "./_sections/slack-interface";

export default function CommunicationPage() {
    return (
        <div className="h-[calc(100vh-126px)] w-full box-border overflow-hidden">
            <Suspense fallback={<div className="flex h-full items-center justify-center">Loading interface...</div>}>
                <SlackInterface />
            </Suspense>
        </div>
    );
}

