import React, { useState, useEffect } from "react";
import { 
  Zap, Sun, Layers, BatteryCharging, Info, 
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

  // Sync state hằng thay đổi
  useEffect(() => {
    localStorage.setItem("vitycalc_state_v2", JSON.stringify(appState));
  }, [appState]);

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
    <div className="min-h-screen bg-industrial-dark text-slate-800 font-sans antialiased relative">
      <div className="grid-overlay" />

      {/* Side sidebar menu */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-industrial-panel border-r border-industrial-border/60 z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          <div className="p-5 border-b border-industrial-border/50 flex justify-between items-center bg-slate-100">
            <div>
              <div className="font-display font-bold text-2xl tracking-wider text-sky-700 flex items-center gap-1.5">
                <Zap className="w-5 h-5 animate-pulse text-sky-600" />
                <span>VityCalc Pro</span>
              </div>
              <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
                Vietnam Solar & M&E EPC v2.0
              </div>
            </div>
            <button className="md:hidden text-slate-600 hover:text-slate-900" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600 block px-3 mb-2">QUẢN TRỊ TRẠM BO</span>
            
            <button 
              onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "dashboard" ? "bg-slate-200 text-sky-800 border-l-4 border-sky-600" : "text-slate-705 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              <Compass className="w-4.5 h-4.5" />
              <span>📊 Dashboard Giám Sát</span>
            </button>

            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600 block px-3 pt-4 mb-2">PHÂN TÍCH CHUYÊN SÂU</span>

            <button 
              onClick={() => { setActiveTab("m1"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "m1" ? "bg-slate-200 text-sky-800 border-l-4 border-sky-600" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              <Zap className="w-4.5 h-4.5" />
              <span>⚡ Công Suất Điện 3 Pha</span>
            </button>

            <button 
              onClick={() => { setActiveTab("m2"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "m2" ? "bg-slate-200 text-sky-800 border-l-4 border-sky-600" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              <BatteryCharging className="w-4.5 h-4.5" />
              <span>🔋 Tính Toán Tụ Bù Cosφ</span>
            </button>

            <button 
              onClick={() => { setActiveTab("m3"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "m3" ? "bg-slate-200 text-sky-800 border-l-4 border-sky-600" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              <Sun className="w-4.5 h-4.5" />
              <span>☀️ Solar Rooftop Bám Tải</span>
            </button>

            <button 
              onClick={() => { setActiveTab("m4"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "m4" ? "bg-slate-200 text-sky-800 border-l-4 border-sky-600" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              <Layers className="w-4.5 h-4.5" />
              <span>🔌 Tính Toán Cáp Điện IEC</span>
            </button>

            <button 
              onClick={() => { setActiveTab("ref"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-[14px] font-bold tracking-wide transition-all ${activeTab === "ref" ? "bg-slate-200 text-sky-800 border-l-4 border-sky-600" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              <Info className="w-4.5 h-4.5" />
              <span>📋 Bảng Chỉ Tiêu TCVN</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Engineering Signature */}
        <div className="p-4 border-t border-[#cbd5e1] bg-slate-100 text-center text-[12px] space-y-1 text-slate-700 font-bold">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
            <span className="text-emerald-700 font-bold text-[12px]">SCADA SYSTEM ONLINE</span>
          </div>
          <div>Cố vấn: NgocHieuPC</div>
          <div className="text-[11px] text-slate-500">Zalo: 0908 923 886</div>
        </div>
      </aside>

      {/* Main Container screen */}
      <div className="md:ml-64 flex flex-col min-h-screen relative z-10">
        {/* Top Header Controls bar */}
        <header className="h-16 bg-white/95 backdrop-filter backdrop-blur-md border-b border-slate-300 px-6 flex justify-between items-center sticky top-0 z-40 no-print">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-700 hover:text-slate-900 p-1" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-sans font-bold text-xl text-slate-800 tracking-wide md:block hidden">
              {currentTabTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Clock */}
            <div className="text-[12px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>UTC+7: {currentTime}</span>
            </div>

            {/* Quick action triggers */}
            <div className="flex gap-2.5">
              <button 
                onClick={handleExportExcel}
                className="bg-white border border-slate-300 text-sky-700 hover:bg-slate-50 text-[13px] font-bold py-1.5 px-3 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Xuất bảng dữ liệu XLSX sang Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Excel Report</span>
              </button>

              <button 
                onClick={handlePrint}
                className="bg-white border border-slate-300 text-emerald-700 hover:bg-slate-50 text-[13px] font-bold py-1.5 px-3 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                title="In quyết toán kỹ thuật 3 pha hụt tải"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button 
                onClick={handleResetAll}
                className="bg-white border border-red-300 text-rose-600 hover:bg-rose-50 text-[13px] font-bold py-1.5 px-2.5 rounded transition-colors"
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
        <footer className="py-6 border-t border-[#cbd5e1] bg-slate-100 text-center text-[13px] text-slate-600 font-bold no-print">
          <div>Ứng dụng Thiết kế Kỹ thuật Thiết bị Điện Trạm Biến Áp & Solar EPC Toàn Quốc</div>
          <div className="text-[12px] text-slate-600 mt-1">
            Được phát triển và cung cấp bởi <span className="text-sky-700 font-bold">NgocHieuPC (0766396699)</span> — Zalo kỹ thuật di động: <span className="text-emerald-700 font-bold">0908 923 886</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
