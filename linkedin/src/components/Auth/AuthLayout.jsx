import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col">

        <div className="w-full max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-blue-600">ProLinker</h1>

        </div>
        <div className="flex-1 flex items-center justify-center px-4 pb-10">
          {children}

        </div>
    </div>
  );
}
