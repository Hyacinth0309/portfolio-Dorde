import Header from "../Components/Header";
import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-blue-500/30">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {children}
      </main>
    </div>
  );
}