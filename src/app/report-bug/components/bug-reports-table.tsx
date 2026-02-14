'use client';

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Button from "@/components/core/button";
import ArrowSvg from "@/components/svg/arrow";
import InputField from "@/components/core/input-field";
import SearchSvg from "@/components/svg/search";
import { Pagination } from "@/components/core/pagination";
import { useBugReports } from "../hooks";
import BugReportDetailsModal from "./bug-report-details-modal";
import BugReportManageModal from "./bug-report-manage-modal";
import { TooltipWrapper } from "@/components/core/info-tooltip";
import TabSelector from "@/components/core/tab-selector";
import GradientSeparator from "@/components/core/gradient-separator";

type TabId = "my-reports" | "wl-reports";

const MOCK_REPORTS = [
    {
        id: "1",
        category: "UI Bug",
        reporter_name: "John Doe",
        created_at: new Date().toISOString(),
        title: "Button alignment issue",
        description: "The submit button on the login page is not aligned properly on mobile devices.",
        status: "pending",
        portal: "wl"
    },
    {
        id: "2",
        category: "Feature Request",
        reporter_name: "Jane Smith",
        created_at: new Date().toISOString(),
        title: "Dark mode support",
        description: "It would be great to have a dark mode option for the dashboard.",
        status: "resolved",
        portal: "wl"
    },
    {
        id: "3",
        category: "Performance",
        reporter_name: "Unknown",
        created_at: new Date().toISOString(),
        title: "Slow page load",
        description: "The reports page takes too long to load with large datasets.",
        status: "pending",
        portal: "master"
    }
];

export default function BugReportsTable() {
    const [activeTab, setActiveTab] = useState<TabId>("wl-reports");
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState<'pending' | 'resolved'>('pending');
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    const pageSize = 10;

    // Handle search debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setCurrentPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // // Tab-specific queries (Commented out for dummy UI)
    // const masterReportsQuery = useBugReports({
    //     portal: 'master',
    //     search: debouncedSearch,
    //     status: status,
    //     page: currentPage,
    //     pageSize: pageSize,
    //     enabled: activeTab === 'my-reports'
    // });

    // const wlReportsQuery = useBugReports({
    //     portal: 'wl',
    //     search: debouncedSearch,
    //     status: status,
    //     page: currentPage,
    //     pageSize: pageSize,
    //     enabled: activeTab === 'wl-reports'
    // });

    // const currentQuery =
    //     activeTab === "my-reports" ? masterReportsQuery :
    //         wlReportsQuery;

    // const { data, isLoading } = currentQuery;
    // const reports = data?.data || [];
    // const totalCount = data?.count || 0;
    // const totalPages = Math.ceil(totalCount / pageSize);

    // Dummy data logic
    const filteredReports = MOCK_REPORTS.filter(r => {
        const matchesTab = activeTab === 'my-reports' ? r.portal === 'master' : r.portal === 'wl';
        const matchesStatus = r.status === status;
        const matchesSearch = r.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            r.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            r.reporter_name.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesTab && matchesStatus && matchesSearch;
    });

    const isLoading = false;
    const reports = filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalCount = filteredReports.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        try {
            return format(new Date(dateString), "dd MMM yyyy");
        } catch (e) {
            return dateString;
        }
    };

    const handleViewDetails = (report: any) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const handleTabChange = (tabId: TabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);
        setSearchInput("");
        setStatus('pending');
    };

    const gridCols = activeTab === 'my-reports'
        ? "grid-cols-[1.5fr_1fr_2fr_3fr_1fr_0.8fr]"
        : "grid-cols-[1.2fr_1.2fr_1fr_1.8fr_2.5fr_1fr_0.8fr]";

    return (
        <section className="flex gap-3 flex-col h-full w-full">
            <div className="flex justify-between items-center w-full">
                <TabSelector
                    tabs={[
                        { id: "wl-reports", label: "WL Reports" },
                        { id: "my-reports", label: "My Reports" },
                    ]}
                    activeTab={activeTab}
                    onTabChange={(id) => handleTabChange(id as TabId)}
                    className="gap-10"
                />
            </div>

            <GradientSeparator opacity={0.9} className="my-6" />

            <div className="flex justify-between items-center gap-4 mb-2">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => { setStatus('pending'); setCurrentPage(1); }}
                        className={cn(
                            'h-8 px-4 rounded-full text-sm font-normal transition-all',
                            status === 'pending'
                                ? ''
                                : 'bg-none border-none bg-transparent! hover:bg-none! text-text-highest shadow-none'
                        )}
                    >
                        Pending
                    </Button>
                    <Button
                        onClick={() => { setStatus('resolved'); setCurrentPage(1); }}
                        className={cn(
                            'h-8 px-4 rounded-full text-sm font-normal transition-all',
                            status === 'resolved'
                                ? ''
                                : 'bg-none border-none bg-transparent! hover:bg-none! text-text-highest shadow-none'
                        )}
                    >
                        Resolved
                    </Button>
                </div>

                <InputField
                    placeholder="Search by title, description or name..."
                    type="text"
                    id="search"
                    name="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    wrapperClassName="w-[360px]"
                    startAdornment={<SearchSvg className="size-6 text-text-low-disabled" />}
                    inputClassName="px-[16px] py-[8px] pl-12 h-[40px] justify-center items-center text-[16px]"
                />
            </div>

            <div className="bg-neutral-01 section-border mt-[16px] p-6 h-full w-full rounded-xl flex flex-col gap-4 flex-1 justify-between min-h-[400px]">
                <div className="flex flex-col gap-4">

                    {/* Table Header */}
                    <div className={cn(
                        "grid gap-4 px-6 py-1 text-(--Primary-600) text-sm font-normal",
                        gridCols
                    )}>
                        <div className="text-left">Category</div>
                        {activeTab !== 'my-reports' && (
                            <div className="text-left">
                                WL Partner
                            </div>
                        )}
                        <div className="text-left">Date</div>
                        <div className="text-left">Title</div>
                        <div className="text-left">Description</div>
                        <div className="text-center">Status</div>
                        <div className="text-right">-</div>
                    </div>

                    {/* Table Body */}
                    <div className="flex flex-col gap-3 w-full">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <span className="text-text-mid animate-pulse">Loading reports...</span>
                            </div>
                        ) : reports.length > 0 ? (
                            reports.map((report: any) => (
                                <div
                                    key={report.id}
                                    className={cn(
                                        "grid gap-4 bg-neutral-03 hover:bg-neutral-05 transition-all duration-300 text-text-high items-center text-sm min-h-[48px] rounded-[8px] px-2 py-2",
                                        gridCols
                                    )}
                                >
                                    <div className="flex justify-start items-center truncate">
                                        {report.category}
                                    </div>
                                    {activeTab !== 'my-reports' && (
                                        <div className="flex justify-start items-center text-text-highest truncate font-medium">
                                            <TooltipWrapper content={report.reporter_name}>
                                                <span className="truncate">{report.reporter_name}</span>
                                            </TooltipWrapper>
                                        </div>
                                    )}
                                    <div className="flex justify-start items-center text-text-highest">
                                        {formatDate(report.created_at)}
                                    </div>
                                    <div className="flex justify-start items-center text-text-highest truncate">
                                        <TooltipWrapper content={report.title}>
                                            <span className="truncate">{report.title}</span>
                                        </TooltipWrapper>
                                    </div>
                                    <div className="flex justify-start items-center text-text-highest truncate">
                                        <TooltipWrapper content={report.description}>
                                            <span className="truncate">{report.description}</span>
                                        </TooltipWrapper>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full bg-neutral-03",
                                            report.status === 'pending' ? "text-negative" :
                                                report.status === 'resolved' ? "text-system-positive" :
                                                    "text-text-mid"
                                        )}>
                                            {(report.status || 'Pending').charAt(0).toUpperCase() + (report.status || 'Pending').slice(1).toLowerCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-end items-center">
                                        <button
                                            onClick={() => {
                                                if (status === 'pending') {
                                                    setSelectedReport(report);
                                                    setIsManageModalOpen(true);
                                                } else {
                                                    handleViewDetails(report);
                                                }
                                            }}
                                            className="flex items-center gap-1.5 text-text-cta hover:text-white transition-colors group h-8 px-3 rounded-lg hover:bg-neutral-08 cursor-pointer"
                                        >
                                            <span className="text-sm font-normal hover:underline">
                                                {status === 'pending' ? 'Manage' : 'View'}
                                            </span>
                                            <ArrowSvg className="size-3 -rotate-45" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-neutral-03/50 border border-dashed border-neutral-10 rounded-[12px] w-full px-6 py-12 flex flex-col items-center justify-center gap-2">
                                <p className="text-text-high text-center text-lg font-medium">
                                    {searchInput
                                        ? "No results found"
                                        : status === 'pending'
                                            ? "No pending reports"
                                            : "No resolved reports"}
                                </p>
                                <p className="text-text-low-disabled text-sm text-center">
                                    {searchInput
                                        ? "Try a different search term"
                                        : status === 'pending'
                                            ? "The submitted bug reports will appear here"
                                            : "You don't have any resolved bug reports yet"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 pt-6 border-t border-neutral-05/30">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            <BugReportDetailsModal
                report={selectedReport}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <BugReportManageModal
                report={selectedReport}
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
                portal={activeTab === 'wl-reports' ? 'wl' : 'master'}
                status={status}
            />
        </section>
    );
}
