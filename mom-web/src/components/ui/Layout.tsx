import React from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 font-sans text-slate-900">
    {/* Abstract Background Shapes */}
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-200/30 blur-[100px]" />
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-200/30 blur-[100px]" />
    </div>
    
    <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center gap-12">
      {children}
    </main>
  </div>
);