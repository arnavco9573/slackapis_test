import { Suspense } from "react";
import { SlackInterface } from "./_sections/slack-interface";

export default function CommunicationPage() {
    return (
        <div className="h-full w-full flex flex-col overflow-hidden p-4">
            <Suspense fallback={<div className="flex h-full items-center justify-center">Loading interface...</div>}>
                <SlackInterface />
            </Suspense>
        </div>
    );
}

