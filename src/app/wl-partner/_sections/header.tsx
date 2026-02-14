import React from "react";
import HeaderCard from "@/components/core/header-card";

export default function Header() {
    const kpis = [
        { label: "Total Partners", value: "500" },
        { label: "WL Partners", value: "450" },
        { label: "USA Based", value: "150" },
        { label: "Global", value: "300" },
        { label: "Dual Market", value: "50" },
    ];

    return (
        <section className="flex flex-col gap-8">
            <h1
                className="text-(--Primary-White,#FFF) font-medium text-[42px] leading-[46px]"
                style={{ fontStyle: 'normal' }}
            >
                Partner Overview
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {kpis.map((kpi, index) => (
                    <HeaderCard
                        key={index}
                        label={kpi.label}
                        value={kpi.value}
                    />
                ))}
            </div>
        </section>
    );
}
