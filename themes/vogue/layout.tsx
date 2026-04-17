"use client";

import React from "react";
import { VogueHeader } from "./components/layout/vogue-header";
import { VogueFooter } from "./components/layout/vogue-footer";

export default function VogueLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-gray-100 selection:text-gray-900">
      <VogueHeader />
      <main className="flex-grow">
        {children}
      </main>
      <VogueFooter />
    </div>
  );
}
