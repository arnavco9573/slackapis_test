"use client"

import React from "react"
import { DataTable } from "@/components/core/data-table"
import ChipFilled from "@/components/core/chip-filled"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PartnerData, mockPartners } from "../data"
import { Pagination } from "@/components/core/pagination"

export default function PartnerTable() {
    const [currentPage, setCurrentPage] = React.useState(1)
    const totalPages = 7

    const columns = [
        {
            header: "Business Name",
            cell: (item: PartnerData) => (
                <div className="text-(--Primary-White,#FFF) text-sm font-normal leading-[150%]">
                    {item.businessName}
                </div>
            ),
            flex: 1.5,
        },
        {
            header: "WL Manager",
            cell: (item: PartnerData) => (
                <div className="text-(--Primary-White,#FFF) text-sm font-normal leading-[150%] text-center">
                    {item.wlManager}
                </div>
            ),
            flex: 1,
            className: "text-center",
        },
        {
            header: "Registration Date",
            cell: (item: PartnerData) => (
                <div className="text-(--Primary-White,#FFF) text-sm font-normal leading-[150%] text-center">
                    {item.registrationDate}
                </div>
            ),
            flex: 1,
            className: "text-center",
        },
        {
            header: "Onboarding Date",
            cell: (item: PartnerData) => (
                <div className="text-(--Primary-White,#FFF) text-sm font-normal leading-[150%] text-center">
                    {item.onboardingDate}
                </div>
            ),
            flex: 1,
            className: "text-center",
        },
        {
            header: "Country/City",
            cell: (item: PartnerData) => (
                <div className="text-(--Primary-White,#FFF) text-sm font-normal leading-[150%] text-center">
                    {item.countryCity}
                </div>
            ),
            flex: 1,
            className: "text-center",
        },
        {
            header: "Market Type",
            cell: (item: PartnerData) => (
                <div className="text-(--Primary-White,#FFF) text-sm font-normal leading-[150%] text-center">
                    {item.marketType}
                </div>
            ),
            flex: 1,
            className: "text-center",
        },
        {
            header: "Status",
            cell: (item: PartnerData) => (
                <div className="flex justify-center">
                    <ChipFilled
                        className={cn(
                            "px-3 py-1 text-xs",
                            item.status === "In-progress" ? "text-[#469ABB]" : "text-[#6DAB9C]"
                        )}
                    >
                        {item.status}
                    </ChipFilled>
                </div>
            ),
            flex: 1,
            className: "text-center",
        },
        {
            header: "-",
            cell: (item: PartnerData) => (
                <div className="flex items-center justify-end gap-4 w-full px-2">
                    {item.status === "In-progress" && (
                        <span className="text-[#9C9C9C] text-sm">
                            {item.progress}%
                        </span>
                    )}
                    <Link
                        href={`/wl-partner/${item.id}`}
                        className="text-(--Primary-White,#FFF) text-sm hover:underline flex items-center gap-1"
                    >
                        View{" "}
                        <svg
                            width="14"
                            height="10"
                            viewBox="0 0 14 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9 1L13 5M13 5L9 9M13 5H1"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                </div>
            ),
            flex: 1,
            className: "text-right",
        },
    ]

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-(--Primary-White,#FFF) text-lg font-medium">
                    All WL Partners
                </h2>
                <span className="text-(--Primary-700,#636363) text-sm">
                    {mockPartners.length} Partners
                </span>
            </div>
            <DataTable
                data={mockPartners}
                columns={columns}
                minWidth="1200px"
                className="bg-transparent backdrop-blur-0"
                footer={
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                }
            />
        </div>
    )
}
