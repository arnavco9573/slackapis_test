"use client";

import React from "react";
import { DataTable } from "@/components/core/data-table";
import { ArrowRight } from "lucide-react";
import ArrowSvg from "@/components/svg/arrow";
import Link from "next/link";
import { useCertificateStore } from "@/store/use-certificate-store";

interface CategoryData {
    id: string;
    name: string;
    measurementType: string;
    count: number;
    date: string;
}

const CATEGORY_DATA: CategoryData[] = [
    {
        id: "1",
        name: "AUM",
        measurementType: "Dollars",
        count: 5,
        date: "5 Jan 2026",
    },
    {
        id: "2",
        name: "Performance Fees",
        measurementType: "Dollars",
        count: 2,
        date: "15 Jan 2026",
    },
    {
        id: "3",
        name: "Management Fee",
        measurementType: "Dollars",
        count: 7,
        date: "22 Jan 2026",
    },
    {
        id: "4",
        name: "Investors",
        measurementType: "Numbers",
        count: 6,
        date: "30 Jan 2026",
    },
];

export default function CategoryTable() {
    const { pushView } = useCertificateStore();
    const columns = [
        {
            header: "Name",
            accessorKey: "name",
            flex: 2,
            className: "text-center",
        },
        {
            header: "Measurement Type",
            accessorKey: "measurementType",
            flex: 2,
            className: "text-center",
        },
        {
            header: "Number of Certificates",
            accessorKey: "count",
            flex: 2,
            className: "text-center",
        },
        {
            header: "Date",
            accessorKey: "date",
            flex: 2,
            className: "text-center",
        },
        {
            header: "Actions",
            flex: 1,
            className: "text-right",
            headerClassName: "text-right mr-4",
            cell: (item: CategoryData) => (
                <button
                    className="flex items-center gap-1.5 text-text-cta hover:text-white transition-colors group h-8 ml-auto pr-4 cursor-pointer"
                    onClick={() => pushView('VIEW_EDIT', {
                        id: item.id,
                        name: item.name,
                        measurementType: item.measurementType,
                        marketType: 'Global',
                        milestones: [
                            { name: "$10 Million AUM", file: null, variables: ["WL Name", "WL Designation"] }
                        ]
                    })}
                >
                    <span className="text-sm font-normal underline">
                        View
                    </span>
                    <ArrowSvg className="size-3" />
                </button>
            ),
        },
    ];

    return (
        <div className="w-full">
            <DataTable
                title="Certificate Category"
                titleClassName="text-white"
                data={CATEGORY_DATA}
                columns={columns}
                minWidth="800px"
                className="bg-neutral-01"
            />
        </div>
    );
}
