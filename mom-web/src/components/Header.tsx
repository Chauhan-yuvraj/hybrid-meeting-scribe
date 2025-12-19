import { Mic } from "lucide-react";

const Header = () => (
  <header className="text-center space-y-6 max-w-2xl">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 shadow-sm mb-2">
      <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
      <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">AI Powered</span>
    </div>
    
    <div className="relative inline-block">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur opacity-20"></div>
      <div className="relative bg-white p-4 rounded-2xl shadow-xl ring-1 ring-slate-900/5">
        <Mic className="w-8 h-8 text-indigo-600" />
      </div>
    </div>

    <div className="space-y-2">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
        Meeting <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Assistant</span>
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed">
        Upload your meeting audio to instantly generate accurate transcripts and structured minutes of meeting.
      </p>
    </div>
  </header>
);

export default Header;