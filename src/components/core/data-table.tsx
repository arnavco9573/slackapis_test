"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface Column<T> {
    header: string
    accessorKey?: keyof T | string
    cell?: (item: T) => React.ReactNode
    className?: string
    headerClassName?: string
    flex?: number
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    title?: string
    titleClassName?: string
    className?: string
    minWidth?: string
    onRowClick?: (item: T) => void
    footer?: React.ReactNode
    onSearch?: (query: string) => void
    searchPlaceholder?: string
    searchValue?: string
}

export function DataTable<T>({
    data,
    columns,
    title,
    titleClassName,
    className,
    minWidth = "1000px",
    onRowClick,
    footer,
    onSearch,
    searchPlaceholder = "Search",
    searchValue,
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
            {(title || onSearch) && (
                <div className="flex justify-between items-center w-full">
                    {title && (
                        <h2 className={cn("text-base font-medium text-(--Primary-700,#636363) leading-5", titleClassName)}>
                            {title}
                        </h2>
                    )}
                    {onSearch && (
                        <div className="relative group">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white/70 transition-colors" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="7.33333" cy="7.33333" r="5.33333" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M14 14L11.3333 11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearch?.(e.target.value)}
                                className="h-10 w-[300px] pl-10 pr-4 rounded-[90px] border-[0.5px] border-white/5 bg-white/3 text-white text-sm outline-none focus:border-white/20 transition-all shadow-sm"
                                style={{
                                    background: "rgba(255, 255, 255, 0.03)",
                                    border: "0.5px solid rgba(255, 255, 255, 0.05)"
                                }}
                            />
                        </div>
                    )}
                </div>
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
                                "text-sm font-normal text-(--Primary-600,#888) tracking-wider leading-[18px]",
                                column.headerClassName || column.className
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
                                    "grid gap-4 bg-(--Neutral-Neutrals-03,rgba(255,255,255,0.03)) hover:bg-[rgba(255,255,255,0.06)] transition-colors rounded-lg px-4 py-3 items-center min-h-[58px]",
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
                                            "text-sm font-normal text-(--Primary-White,#FFF) leading-[150%] truncate",
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

            {footer && (
                <div>
                    {footer}
                </div>
            )}
        </div>
    )
}
