"use client";

import React, { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { useCertificateStore } from "@/store/use-certificate-store";
import { Pagination } from "@/components/core/pagination";
import { DataTable } from "@/components/core/data-table";
import BackButton from "@/components/core/back-button";

// Mock data based on provided image
const leaderboardData = [
    { rank: 1, partner: "Johan Duo", company: "Blue Moon PVT.LTD", marketType: "USA", certificates: 40 },
    { rank: 2, partner: "Maya Lin", company: "Blue Moon PVT.LTD", marketType: "Global", certificates: 37 },
    { rank: 3, partner: "Ethan Hunt", company: "Blue Moon PVT.LTD", marketType: "USA", certificates: 30 },
    { rank: 4, partner: "Sara Connor", company: "Blue Moon PVT.LTD", marketType: "USA + Global", certificates: 28 },
    { rank: 5, partner: "Felix Wong", company: "Blue Moon PVT.LTD", marketType: "USA", certificates: 27 },
    { rank: 6, partner: "Nina Petrova", company: "Blue Moon PVT.LTD", marketType: "Global", certificates: 22 },
    { rank: 7, partner: "Liam Neeson", company: "Blue Moon PVT.LTD", marketType: "Global", certificates: 22 },
    { rank: 8, partner: "Liam Neeson", company: "Blue Moon PVT.LTD", marketType: "USA", certificates: 19 },
    { rank: 9, partner: "Liam Neeson", company: "Blue Moon PVT.LTD", marketType: "USA", certificates: 16 },
    { rank: 10, partner: "Liam Neeson", company: "Blue Moon PVT.LTD", marketType: "USA", certificates: 15 },
];

import Medal1 from "@/components/svg/medal-1";
import Medal2 from "@/components/svg/medal-2";
import Medal3 from "@/components/svg/medal-3";

// Mock data remains the same...

export default function Leaderboard() {
    const { popView } = useCertificateStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 7;

    const columns = [
        {
            header: "Rank",
            flex: 0.5,
            cell: (row: any) => (
                <div className="flex items-center gap-3">
                    <span className="text-white text-sm font-medium">{row.rank}</span>
                    {row.rank === 1 && <Medal1 className="size-4" />}
                    {row.rank === 2 && <Medal2 className="size-4" />}
                    {row.rank === 3 && <Medal3 className="size-4" />}
                </div>
            )
        },
        // ... rest of the columns
        {
            header: "WL Partner",
            accessorKey: "partner",
            flex: 1,
            className: "text-[#9C9C9C] font-normal"
        },
        {
            header: "Company",
            accessorKey: "company",
            flex: 1,
            className: "text-[#9C9C9C] font-normal"
        },
        {
            header: "Market Type",
            accessorKey: "marketType",
            flex: 1,
            className: "text-[#9C9C9C] font-normal"
        },
        {
            header: "Certificates Achieved",
            accessorKey: "certificates",
            flex: 1,
            headerClassName: "text-right",
            className: "text-white font-medium text-right"
        }
    ];

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-6 w-full">
                <BackButton onClick={popView} className="self-start" />
                <h1 className="text-[#FFF] text-[32px] font-medium leading-[40px]">
                    Leaderboard
                </h1>
            </div>

            <div className="flex flex-col w-full">
                <DataTable
                    data={leaderboardData}
                    columns={columns}
                    title="Top Performers"
                    onSearch={setSearchQuery}
                    searchValue={searchQuery}
                    searchPlaceholder="Search"
                    className="rounded-[12px]"
                    footer={
                        <div className="flex justify-end items-center mt-2 pb-2 px-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    }
                />
            </div>
        </div>
    );
}
