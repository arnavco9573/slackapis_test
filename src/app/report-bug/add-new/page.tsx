"use client";

import BackButton from "@/components/core/back-button";
import BugReportForm from "../components/bug-report-form";
import { useRouter } from "next/navigation";

export default function AddNewBugReport() {
    const router = useRouter();

    return (
        <>
            {/* Title Section */}
            <div className="mb-8 w-full max-w-[664px] flex flex-col items-start gap-4">
                <BackButton onClick={() => router.push('/report-bug')} className="size-10 my-6" />
                <div className="flex flex-col gap-1">
                    <h1 className="text-[28px] font-normal text-text-highest tracking-tight leading-tight">Report a bug</h1>
                    {/* <p className="text-sm text-text-mid font-normal">Please provide details about the issue you encountered.</p> */}
                </div>
            </div>

            <BugReportForm />
        </>
    );
}
