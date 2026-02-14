"use client";

import HeaderSection from "./_sections/header-section";
import CategoryTable from "./_sections/category-table";
import CreateCertificateCategoryPage from "./create-category/page";
import ViewEditCategory from "./_sections/view-edit-category";
import Leaderboard from "./_sections/leaderboard";
import { useCertificateStore } from "@/store/use-certificate-store";

export default function CertificatesPage() {
    const { viewStack } = useCertificateStore();
    const activeView = viewStack[viewStack.length - 1];

    const renderView = () => {
        switch (activeView) {
            case 'VIEW_EDIT':
                return <ViewEditCategory />;
            case 'LEADERBOARD':
                return <Leaderboard />;
            case 'LIST':
            default:
                return (
                    <>
                        <HeaderSection />
                        <CategoryTable />
                    </>
                );
        }
    };

    return (
        <div className="w-full h-full px-9 py-12 flex flex-col gap-6 overflow-auto">
            {renderView()}
        </div>
    );
}
