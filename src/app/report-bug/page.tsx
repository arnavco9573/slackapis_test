"use client";

import GradientSeparator from "@/components/core/gradient-separator";
import BugReportsTable from "./components/bug-reports-table";
import Button from "@/components/core/button";
import ArrowSvg from "@/components/svg/arrow";
import { useRouter } from "next/navigation";

export default function ReportBug() {
    const router = useRouter();

    return (
        <div className="w-full flex-1 flex flex-col px-9 py-12">
            {/* Header Section */}
            <div className="mb-8 w-full flex items-center justify-between">
                <h1 className="text-[28px] font-normal text-text-highest tracking-tight">
                    Bug report
                </h1>
                <Button
                    className="h-10 px-6 text-base rounded-full flex items-center justify-center gap-2"
                    onClick={() => router.push('/report-bug/add-new')}
                >
                    Report a bug
                    <ArrowSvg className="w-4 h-4" />
                </Button>
            </div>

            {/* <GradientSeparator opacity={0.3} className="mb-8" /> */}

            {/* Table Section */}
            <BugReportsTable />
        </div>
    );
}
