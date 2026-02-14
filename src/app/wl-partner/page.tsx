"use client"

import React, { useState } from "react";
import Header from "./_sections/header";
import { WLFilterDropdown } from "./_components/wl-filter-dropdown";
import { WLSortDropdown } from "./_components/wl-sort-dropdown";
import InputField from "@/components/core/input-field";
import SearchSvg from "@/components/svg/search";

import Link from "next/link";
import PartnerTable from "./_sections/partner-table";

export default function WlPartnerPage() {
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [filters, setFilters] = useState({
        marketType: "",
        progress: [],
        approvalStatus: "",
        onboardingMonth: "",
        onboardingYear: "",
        country: "",
    });

    return (
        <div className="flex flex-col gap-10 p-8 min-h-screen bg-transparent px-10">
            <Header />

            <div className="flex items-center justify-between gap-4 mt-[30px]">
                <div className="w-[400px]">
                    <InputField
                        id="search"
                        name="search"
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        startAdornment={<SearchSvg className="text-(--Primary-500,#9C9C9C) size-5 ml-1" />}
                        inputClassName="rounded-full h-[40px] px-10 justify-center"
                        wrapperClassName="w-full"
                        placeholderClassName="mt-0.5"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <WLFilterDropdown
                        filters={filters}
                        onFilterChange={setFilters}
                    />
                    <WLSortDropdown
                        sortOrder={sortOrder}
                        onSortChange={setSortOrder}
                    />
                </div>
            </div>

            <div className="mt-4">
                <PartnerTable />
            </div>
        </div>
    );
}
