"use client";

import React from "react";
import InputField from "@/components/core/input-field";
import { SelectInput } from "@/components/core/select-input";

interface CategoryFormProps {
    categoryName: string;
    setCategoryName: (value: string) => void;
    measurementType: string | null;
    setMeasurementType: (value: string | null) => void;
    marketType: string | null;
    setMarketType: (value: string | null) => void;
    readOnly?: boolean;
}

export default function CategoryForm({
    categoryName,
    setCategoryName,
    measurementType,
    setMeasurementType,
    marketType,
    setMarketType,
    readOnly = false,
}: CategoryFormProps) {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-(--Primary-White,#FFF) text-[20px] font-normal leading-[24px]">
                Add Details
            </h2>
            <div className="flex flex-col gap-6">
                <InputField
                    type="text"
                    id="category-name"
                    name="categoryName"
                    label="Category Name"
                    placeholder="Write new category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    inputClassName="h-[58px] justify-center"
                    readOnly={readOnly}
                />

                <SelectInput
                    label="Measurement Type"
                    placeholder="Select Measurement type"
                    options={[
                        { label: "Dollar", value: "dollar" },
                        { label: "Number", value: "number" },
                    ]}
                    value={measurementType}
                    onChange={setMeasurementType}
                    triggerClassName="h-[58px] justify-center"
                    readOnly={readOnly}
                />

                <SelectInput
                    label="Market Type"
                    placeholder="Select market Type"
                    options={[
                        { label: "Global", value: "global" },
                        { label: "USA", value: "usa" },
                    ]}
                    value={marketType}
                    onChange={setMarketType}
                    triggerClassName="h-[58px] justify-center"
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
}
