import React, { useState, useEffect } from "react";
import { 
  Zap, Sun, Moon, Home, Layers, BatteryCharging, Info, 
  Download, Printer, FileSpreadsheet, RotateCcw,
  CheckCircle2, AlertTriangle, Clock, Menu, X, Landmark, Compass
} from "lucide-react";

import { FullAppState, Module1State, Module2State, Module3State, Module4State, INITIAL_STATE } from "./types";
import { calculateModule1, calculateModule2, calculateModule3, calculateCable } from "./utils/calculator";
import { exportToExcel } from "./utils/exporter";

import { DashboardPanel } from "./components/DashboardPanel";
import { Module1Panel } from "./components/Module1Panel";
import { Module2Panel } from "./components/Module2Panel";
import { Module3Panel } from "./components/Module3Panel";
import { Module4Panel } from "./components/Module4Panel";
import { QuickRefPanel } from "./components/QuickRefPanel";

export default function App() {
  // Local session persistence
  const [appState, setAppState] = useState<FullAppState>(() => {
    const saved = localStorage.getItem("vitycalc_state_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to restore previous state, fallback to initial");
      }
    }
    return INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<"dashboard" | "m1" | "m2" | "m3" | "m4" | "ref">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("--:--:--");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Sync state hằng thay đổi
  useEffect(() => {
    localStorage.setItem("vitycalc_state_v2", JSON.stringify(appState));
  }, [appState]);

  // Synchronize dynamic active theme
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (t: "light" | "dark") => {
      if (t === "dark") {
        root.setAttribute("data-theme", "dark");
        root.classList.add("dark");
      } else {
        root.setAttribute("data-theme", "light");
        root.classList.remove("dark");
      }
    };

    if (appState.theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches ? "dark" : "light");

      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    } else {
      applyTheme(appState.theme || "light");
    }
  }, [appState.theme]);

  // Show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Real-time tick clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0")
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Structural computed values shared across pages hằng thay đổi
  const m1Res = calculateModule1(appState.module1);
  const m2Res = calculateModule2(appState.module2);
  const m3Res = calculateModule3(appState.module3, m1Res.apparentPowerKva);
  const m4Res = calculateCable(appState.module4);

  // Expose Excel Export
  const handleExportExcel = () => {
    exportToExcel(appState, m1Res, m2Res, m3Res, m4Res);
  };

  // Modern browser-native print trigger with clean black and white layouts
  const handlePrint = () => {
    window.print();
  };

  const handleResetAll = () => {
    if (window.confirm("Bạn có thực sự muốn khôi phục toàn bộ các trường thông số của 4 Module về trạng thái mặc định ban đầu?")) {
      setAppState(INITIAL_STATE);
    }
  };

  const setM1 = (update: Partial<Module1State>) => {
    setAppState(prev => ({ ...prev, module1: { ...prev.module1, ...update } }));
  };

  const setM2 = (update: Partial<Module2State>) => {
    setAppState(prev => ({ ...prev, module2: { ...prev.module2, ...update } }));
  };

  const setM3 = (update: Partial<Module3State>) => {
    setAppState(prev => ({ ...prev, module3: { ...prev.module3, ...update } }));
  };

  const setM4 = (update: Partial<Module4State>) => {
    setAppState(prev => ({ ...prev, module4: { ...prev.module4, ...update } }));
  };

  const currentTabTitle = {
    dashboard: "Tổng Quan Sức Khỏe Trạm Biến Áp & Solar",
    m1: "Tính Toán Công Suất Điện 3 Pha",
    m2: "Tính Toán Tụ Bù Cosφ & C/K Relay",
    m3: "Quy Hoạch Solar Rooftop Bám Tải",
    m4: "Sizing Tiết Diện Cáp & Sụt Áp IEC",
    ref: "Bảng Tra Cứu Chỉ Tiêu Kỹ Thuật"
  }[activeTab];

  return (
    <div className="min-h-screen bg-industrial-dark text-[#0f172a] dark:text-[#f8fafc] font-sans antialiased relative selection:bg-sky-500/30">
      <div className="grid-overlay" />

      {/* Side sidebar menu */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-industrial-panel dark:bg-[#0e1726] border-r border-[#cbd5e1] dark:border-[#23354e] z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          <div className="p-5 border-b border-[#cbd5e1] dark:border-[#23354e] flex justify-between items-center bg-slate-100 dark:bg-[#111a2e]">
            <div>
              <div className="font-display font-bold text-2xl tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                <Zap className="w-5 h-5 animate-pulse text-sky-650 text-[#00d4ff]" />
                <span>VityCalc Pro</span>
              </div>
              <div className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                Vietnam Solar & M&E EPC v2.0
              </div>
            </div>
            <button className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 block px-3 mb-2">QUẢN TRỊ TRẠM BO</span>
            
            <button 
              onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "dashboard" ? "bg-slate-200 dark:bg-[#1a2f4c] text-sky-850 dark:text-[#00d4ff] border-l-4 border-sky-600" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#152238]"}`}
            >
              <Compass className="w-4.5 h-4.5" />
              <span>📊 Dashboard Giám Sát</span>
            </button>

            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 block px-3 pt-4 mb-2">PHÂN TÍCH CHUYÊN SÂU</span>

            <button 
              onClick={() => { setActiveTab("m1"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "m1" ? "bg-slate-200 dark:bg-[#1a2f4c] text-sky-850 dark:text-[#00d4ff] border-l-4 border-sky-600" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#152238]"}`}
            >
              <Zap className="w-4.5 h-4.5" />
              <span>⚡ Công Suất Điện 3 Pha</span>
            </button>

            <button 
              onClick={() => { setActiveTab("m2"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "m2" ? "bg-slate-200 dark:bg-[#1a2f4c] text-sky-850 dark:text-[#00d4ff] border-l-4 border-sky-600" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#152238]"}`}
            >
              <BatteryCharging className="w-4.5 h-4.5" />
              <span>🔋 Tính Toán Tụ Bù Cosφ</span>
            </button>

            <button 
              onClick={() => { setActiveTab("m3"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "m3" ? "bg-slate-200 dark:bg-[#1a2f4c] text-sky-850 dark:text-[#00d4ff] border-l-4 border-sky-600" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#152238]"}`}
            >
              <Sun className="w-4.5 h-4.5" />
              <span>☀️ Solar Rooftop Bám Tải</span>
            </button>

            <button 
              onClick={() => { setActiveTab("m4"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "m4" ? "bg-slate-200 dark:bg-[#1a2f4c] text-sky-850 dark:text-[#00d4ff] border-l-4 border-sky-600" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#152238]"}`}
            >
              <Layers className="w-4.5 h-4.5" />
              <span>🔌 Tính Toán Cáp Điện IEC</span>
            </button>

            <button 
              onClick={() => { setActiveTab("ref"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "ref" ? "bg-slate-200 dark:bg-[#1a2f4c] text-sky-850 dark:text-[#00d4ff] border-l-4 border-sky-600" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#152238]"}`}
            >
              <Info className="w-4.5 h-4.5" />
              <span>📋 Bảng Chỉ Tiêu TCVN</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Engineering Signature */}
        <div className="p-4 border-t border-[#cbd5e1] dark:border-[#23354e] bg-slate-100 dark:bg-[#0f1b2d] text-center text-[12px] space-y-1 text-slate-700 dark:text-slate-300 font-bold">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
            <span className="text-emerald-750 dark:text-emerald-450 font-bold text-[12px]">SCADA SYSTEM ONLINE</span>
          </div>
          <div>Cố vấn: NgocHieuPC</div>
          <div className="text-[11px] text-slate-550 dark:text-slate-400">Zalo: 0908 923 886</div>
        </div>
      </aside>

      {/* Main Container screen */}
      <div className="md:ml-64 flex flex-col min-h-screen relative z-10">
        {/* Top Header Controls bar */}
        <header className="h-16 bg-white/95 dark:bg-[#0e1726]/95 backdrop-filter backdrop-blur-md border-b border-slate-300 dark:border-[#23354e] px-6 flex justify-between items-center sticky top-0 z-40 no-print">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-sans font-bold text-xl text-slate-800 dark:text-slate-100 tracking-wide md:block hidden">
              {currentTabTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Selector Toggle Group */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-300 dark:border-[#2d3e5e]">
              <button
                onClick={() => setAppState(prev => ({ ...prev, theme: "light" }))}
                className={`p-1.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${appState.theme === "light" ? "bg-white dark:bg-[#152238] text-amber-600 shadow-sm border border-slate-200 dark:border-[#2d3e5e]" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"}`}
                title="Giao diện sáng (Light Mode)"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setAppState(prev => ({ ...prev, theme: "dark" }))}
                className={`p-1.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${appState.theme === "dark" ? "bg-white dark:bg-[#152238] text-sky-400 shadow-sm border border-slate-200 dark:border-[#2d3e5e]" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"}`}
                title="Giao diện tối (Dark Mode)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setAppState(prev => ({ ...prev, theme: "auto" }))}
                className={`px-2 py-0.5 rounded-md flex items-center justify-center transition-all cursor-pointer text-[9px] font-bold tracking-wider ${appState.theme === "auto" ? "bg-white dark:bg-[#152238] text-emerald-500 shadow-sm border border-slate-200 dark:border-[#2d3e5e]" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"}`}
                title="Tự động đồng bộ cài đặt thiết bị (Auto Mode)"
              >
                AUTO
              </button>
            </div>

            {/* Clock */}
            <div className="text-[12px] font-bold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-3 py-1 rounded flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>UTC+7: {currentTime}</span>
            </div>

             {/* Quick action triggers */}
            <div className="flex gap-2.5">
              <button 
                onClick={handleExportExcel}
                className="bg-white dark:bg-[#152238] border border-slate-300 dark:border-[#23354e] text-sky-700 dark:text-sky-400 hover:bg-slate-50 dark:hover:bg-[#1d2d46] text-[13px] font-bold py-1.5 px-3 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Xuất bảng dữ liệu XLSX sang Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Excel Report</span>
              </button>

              <button 
                onClick={handlePrint}
                className="bg-white dark:bg-[#152238] border border-slate-300 dark:border-[#23354e] text-emerald-700 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-[#1d2d46] text-[13px] font-bold py-1.5 px-3 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                title="In quyết toán kỹ thuật 3 pha hụt tải"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button 
                onClick={handleResetAll}
                className="bg-white dark:bg-[#152238] border border-red-300 dark:border-red-900/60 text-rose-650 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-[#1d2d46] text-[13px] font-bold py-1.5 px-2.5 rounded transition-colors"
                title="Khôi phục toàn bộ 4 Module về gốc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic page container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DashboardPanel 
              state={appState}
              m1={m1Res}
              m2={m2Res}
              m3={m3Res}
              m4={m4Res}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "m1" && (
            <Module1Panel 
              state={appState.module1} 
              onChange={setM1} 
            />
          )}

          {activeTab === "m2" && (
            <Module2Panel 
              state={appState.module2} 
              onChange={setM2} 
            />
          )}

          {activeTab === "m3" && (
            <Module3Panel 
              state={appState.module3} 
              onChange={setM3} 
              module1AvgKva={m1Res.apparentPowerKva}
            />
          )}

          {activeTab === "m4" && (
            <Module4Panel 
              state={appState.module4} 
              onChange={setM4} 
            />
          )}

          {activeTab === "ref" && (
            <QuickRefPanel />
          )}
        </main>

        {/* Global Footer Signature */}
        <footer className="py-6 border-t border-[#cbd5e1] dark:border-[#23354e] bg-slate-100 dark:bg-[#0f1b2d] text-center text-[13px] text-slate-600 dark:text-slate-400 no-print">
          <div>Ứng dụng Thiết kế Kỹ thuật Thiết bị Điện Trạm Biến Áp & Solar EPC Toàn Quốc</div>
          <div className="text-[12px] text-slate-600 dark:text-slate-400 mt-1">
            Được phát triển và cung cấp bởi <span className="text-sky-700 dark:text-sky-400 font-bold">NgocHieuPC (0766396699)</span> — Zalo kỹ thuật di động: <span className="text-emerald-700 dark:text-emerald-400 font-bold">0908 923 886</span>
          </div>
        </footer>

        {/* Floating back-to-top HOME button next to scrollbar */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-sky-600 hover:bg-sky-700 text-white p-3.5 rounded-full shadow-xl z-50 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center border border-white/20 animate-bounce no-print"
            title="Quay về Đầu Trang"
          >
            <Home className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
