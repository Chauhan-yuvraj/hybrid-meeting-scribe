import React from "react";
import { cn } from "../../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  mode?: "light" | "incognito";
}

export const Layout = ({ children, mode = "light" }: LayoutProps) => {
  const isIncognito = mode === "incognito";

  return (
    <div className={cn(
      "min-h-screen font-sans transition-colors duration-700 ease-in-out relative overflow-x-hidden",
      isIncognito 
        ? "text-slate-100 selection:bg-emerald-900 selection:text-emerald-100 dark" 
        : "text-slate-900 selection:bg-indigo-100 selection:text-indigo-900"
    )}>
      {/* Abstract Background Shapes & Base Color */}
      <div className={cn(
        "fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700 ease-in-out",
        isIncognito ? "bg-slate-950" : "bg-slate-50"
      )}>
        <div className="absolute inset-0 transition-opacity duration-1000">
          {isIncognito ? (
            <>
              <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-900/20 blur-[120px] animate-pulse" />
              <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-slate-800/30 blur-[120px]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-emerald-950/30 blur-[100px]" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </>
          ) : (
            <>
              <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-200/40 blur-[100px] animate-float" />
              <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-200/40 blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
              <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[100px] animate-float" style={{ animationDelay: "4s" }} />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
              {/* Subtle Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </>
          )}
        </div>
      </div>
      
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center gap-12">
        {children}
      </main>
    </div>
  );
};