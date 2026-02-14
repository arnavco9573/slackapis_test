"use client"

import React from "react";

export default function DashboardPage() {
    return (
        <div className="w-full h-screen p-0 overflow-hidden bg-black flex items-center justify-center relative">
            {/* Reduced size Video Section */}
            <div className="w-[85%] h-[85%] flex items-center justify-center">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-screen object-contain"
                >
                    <source src="/Vanquish Laptop.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Subtle dark overlay */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>
    );
}
