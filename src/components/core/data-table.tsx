"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface Column<T> {
    header: string
    accessorKey?: keyof T | string
    cell?: (item: T) => React.ReactNode
    className?: string
    flex?: number
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    title?: string
    className?: string
    minWidth?: string
    onRowClick?: (item: T) => void
}

export function DataTable<T>({
    data,
    columns,
    title,
    className,
    minWidth = "1000px",
    onRowClick,
}: DataTableProps<T>) {
    return (
        <div
            className={cn(
                "flex flex-col gap-6 p-6 w-full rounded-xl border-0 overflow-hidden",
                "bg-neutral-01 backdrop-blur-[10px]",
                className
            )}
            style={{
                background: "var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))",
                boxShadow: "6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset",
            }}
        >
            {title && (
                <h2 className="text-base font-medium text-(--Primary-700,#636363) leading-5">
                    {title}
                </h2>
            )}

            <div
                className="w-full overflow-x-auto"
                style={{ minWidth }}
            >
                {/* Header */}
                <div
                    className="grid gap-4 px-4 pb-2"
                    style={{
                        gridTemplateColumns: columns.map(col => `${col.flex || 1}fr`).join(' ')
                    }}
                >
                    {columns.map((column, index) => (
                        <div
                            key={index}
                            className={cn(
                                "text-left text-sm font-medium text-(--Primary-700,#636363) tracking-wider",
                                column.className
                            )}
                        >
                            {column.header}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div className="flex flex-col gap-2">
                    {data.length > 0 ? (
                        data.map((item, rowIndex) => (
                            <div
                                key={rowIndex}
                                className={cn(
                                    "grid gap-4 bg-(--Neutral-Neutrals-03,rgba(255,255,255,0.03)) hover:bg-[rgba(255,255,255,0.06)] transition-colors rounded-lg px-4 py-3 items-center",
                                    onRowClick && "cursor-pointer"
                                )}
                                style={{
                                    gridTemplateColumns: columns.map(col => `${col.flex || 1}fr`).join(' ')
                                }}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((column, colIndex) => (
                                    <div
                                        key={colIndex}
                                        className={cn(
                                            "text-sm text-text-high",
                                            column.className
                                        )}
                                    >
                                        {column.cell
                                            ? column.cell(item)
                                            : (item[column.accessorKey as keyof T] as React.ReactNode)}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-text-mid italic bg-(--Neutral-Neutrals-03,rgba(255,255,255,0.03)) rounded-lg">
                            No data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
