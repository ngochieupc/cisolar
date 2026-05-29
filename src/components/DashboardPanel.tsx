import React from "react";
import { MetricGauge } from "./MetricGauge";
import { Line, Doughnut } from "react-chartjs-2";
import { 
  Zap, Sun, ShieldAlert, BadgePercent, Coins, HelpCircle, AlertTriangle, CheckCircle2, TrendingUp, Info
} from "lucide-react";
import { Module1Results, Module2Results, Module3Results, CableResult } from "../utils/calculator";
import { FullAppState } from "../types";

interface DashboardPanelProps {
  state: FullAppState;
  m1: Module1Results;
  m2: Module2Results;
  m3: Module3Results;
  m4: CableResult;
  setActiveTab: (tab: "dashboard" | "m1" | "m2" | "m3" | "m4") => void;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({
  state,
  m1,
  m2,
  m3,
  m4,
  setActiveTab,
}) => {
  // Compute whole system alerts
  const alerts: { type: "green" | "amber" | "red" | "cyan"; text: string; actionTab?: "m1" | "m2" | "m3" | "m4" }[] = [];

  // PF verification
  if (m1.powerFactor < 0.85) {
    alerts.push({
      type: "red",
      text: `PF hiện tại quá thấp: ${m1.powerFactor.toFixed(2)} (< 0.85). EVN sẽ phạt bổ sung công suất phản kháng tiền điện hằng tháng.`,
      actionTab: "m2"
    });
  } else if (m1.powerFactor < 0.90) {
    alerts.push({
      type: "amber",
      text: `PF hiện tại: ${m1.powerFactor.toFixed(2)} — Đạt phạt tối thiểu nhưng chưa tối ưu tổn hao cáp. Khuyến nghị bù cải thiện lên ≥ 0.92`,
      actionTab: "m2"
    });
  } else {
    alerts.push({
      type: "green",
      text: `PF hiện tại: ${m1.powerFactor.toFixed(2)} — Đạt yêu cầu kỹ thuật lưới EVN. Không bị phạt.`
    });
  }

  // MBA transformer verification
  if (state.module1.transformerKva > 0) {
    if (m1.transformerLoadPercent > 95) {
      alerts.push({
        type: "red",
        text: `MBA trạm tải quá cao: ${m1.transformerLoadPercent.toFixed(1)}%. Nguy hiểm nghiêm trọng về bảo vệ rơ le quá tải và sinh phát nhiệt dây quấn!`,
        actionTab: "m1"
      });
    } else if (m1.transformerLoadPercent > 80) {
      alerts.push({
        type: "amber",
        text: `MBA tải cảnh báo: ${m1.transformerLoadPercent.toFixed(1)}% — Cần xem xét luân phiên dãn tải đỉnh sản xuất hằng ngày.`,
        actionTab: "m1"
      });
    } else {
      alerts.push({
        type: "green",
        text: `Tải trạm MBA máy biến áp ổn định: ${m1.transformerLoadPercent.toFixed(1)}%. Ở ngưỡng khai thác an toàn.`
      });
    }
  }

  // Solar Rooftop verification
  if (m3.recSolarPowerKwp > 10) {
    alerts.push({
      type: "green",
      text: `Solar đề xuất lắp: ${m3.recSolarPowerKwp.toFixed(1)} kWp giúp giảm đến ${(m3.annualElectricitySavedVnd / 1e6).toFixed(1)} triệu VNĐ tiền điện hằng năm.`,
      actionTab: "m3"
    });

    if (m3.hasEvnFeedinRisk) {
      alerts.push({
        type: "red",
        text: "Hệ thống Solar có nguy cơ phát ngược điện EVN vào ngày nghỉ lễ/Tải thấp! Hãy bật Zero Export hoặc cài đặt bám tải bảo vệ.",
        actionTab: "m3"
      });
    }

    if (m3.lowPfRiskAfterSolar) {
      alerts.push({
        type: "amber",
        text: "Mối đe dọa drop Cosphi: Công suất phát Solar lớn kéo giảm tải thực grid làm tụ sụt hệ số công suất chung. Cần cảm biến bù linh động.",
        actionTab: "m2"
      });
    }
  }

  // Cable voltage drop verification
  if (m4.voltageDropPercent > state.module4.allowableDropPercent) {
    alerts.push({
      type: "red",
      text: `Sụt áp cáp nguồn vượt giới hạn cho phép: ${m4.voltageDropPercent.toFixed(2)}% > ${state.module4.allowableDropPercent}%. Phát sinh tổn thất hụt tải và rủi ro điện áp không đủ cuối nguồn!`,
      actionTab: "m4"
    });
  } else if (m4.voltageDropPercent > 2.5) {
    alerts.push({
      type: "amber",
      text: `Sụt áp cáp: ${m4.voltageDropPercent.toFixed(2)}% có cảnh báo. Tuyến cáp khá dài hoặc tiết diện sát ngưỡng.`,
      actionTab: "m4"
    });
  } else {
    alerts.push({
      type: "green",
      text: `Sụt áp trên đường dẫn: ${m4.voltageDropPercent.toFixed(2)}% nằm trong giới hạn thiết kế của quy chuẩn IEC.`
    });
  }

  // Doughnut Chart data for P vs Q
  const doughnutData = {
    labels: ["Tải tác dụng P (kW)", "Tải phản kháng Q (kVAr)"],
    datasets: [
      {
        data: [m1.activePowerKw || 1, m1.reactivePowerKvar || 0.1],
        backgroundColor: ["#00d4ff", "#ffb020"],
        borderColor: ["#0d1520", "#0d1520"],
        borderWidth: 2,
        hoverOffset: 6,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#7aa3c8",
          font: { family: "JetBrains Mono", size: 11 },
          padding: 12
        }
      },
      tooltip: {
        backgroundColor: "#111c2a",
        borderColor: "#1e3248",
        borderWidth: 1,
        titleColor: "#e8f4ff",
        bodyColor: "#7aa3c8",
        bodyFont: { family: "JetBrains Mono" }
      }
    }
  };

  // Solar vs Load bell curve profile (Hourly)
  // Generation starting from 06h to 18h typical
  const hourlyLabels = ["06h","07h","08h","09h","10h","11h","12h","13h","14h","15h","16h","17h","18h"];
  const solarFactors = [0.05, 0.2, 0.45, 0.75, 0.9, 0.98, 1.0, 0.95, 0.85, 0.65, 0.4, 0.15, 0.05];
  const loadFactors  = [0.65, 0.75, 0.88, 0.95, 0.98, 1.0, 0.95, 0.92, 0.90, 0.88, 0.82, 0.72, 0.55];

  const solarGenCurve = solarFactors.map(f => +(m3.recSolarPowerKwp * f).toFixed(1));
  const loadCurve = loadFactors.map(f => +(m1.activePowerKw * f).toFixed(1));

  // If bám tải/zero-export is strictly on: actual solar used is capped by load curve at each hour
  const actualSolarCurve = solarGenCurve.map((sVal, idx) => {
    const lVal = loadCurve[idx];
    if (state.module3.hasZeroExport && sVal > lVal) {
      return lVal; // clipped
    }
    return sVal;
  });

  const lineChartData = {
    labels: hourlyLabels,
    datasets: [
      {
        label: "Danh định Tải Công nghiệp (kW)",
        data: loadCurve,
        borderColor: "#ffb020",
        backgroundColor: "rgba(255, 176, 32, 0.04)",
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointStyle: "circle" as const,
        pointRadius: 2,
        pointHoverRadius: 6,
      },
      {
        label: "Sản lượng phát Solar PV (kWp)",
        data: solarGenCurve,
        borderColor: "#00d4ff",
        backgroundColor: "rgba(0, 212, 255, 0.06)",
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointStyle: "circle" as const,
        pointRadius: 2,
        pointHoverRadius: 6,
      },
      {
        label: "Hấp thụ Solar tự dùng (kW)",
        data: actualSolarCurve,
        borderColor: "#00ff88",
        borderWidth: 0,
        backgroundColor: "rgba(0, 255, 136, 0.12)",
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: "#7aa3c8",
          font: { size: 10, family: "Inter" }
        }
      },
      tooltip: {
        backgroundColor: "#111c2a",
        borderColor: "#1e3248",
        borderWidth: 1,
        titleColor: "#e8f4ff",
        bodyFont: { family: "JetBrains Mono" },
        padding: 10
      }
    },
    scales: {
      y: {
        grid: { color: "#1e324820" },
        ticks: { color: "#7aa3c8", font: { family: "JetBrains Mono", size: 10 } },
        title: { display: true, text: "Công Suất (kW)", color: "#7aa3c8", font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#7aa3c8", font: { family: "JetBrains Mono", size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Display Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button 
          onClick={() => setActiveTab("m1")}
          className="kpi-card cyan hover:scale-[1.02] cursor-pointer transition-transform text-left"
        >
          <div className="kpi-label">Power Factor</div>
          <div className="kpi-value cyan text-2xl font-display font-semibold mt-1">
            {m1.powerFactor > 0 ? m1.powerFactor.toFixed(3) : "—"}
          </div>
          <div className="kpi-sub mt-1 text-slate-400">Cosφ trạm MSB</div>
        </button>

        <button 
          onClick={() => setActiveTab("m1")}
          className="kpi-card green hover:scale-[1.02] cursor-pointer transition-transform text-left"
        >
          <div className="kpi-label">Tổng Tải Đo Đạc</div>
          <div className="kpi-value green text-2xl font-display font-semibold mt-1">
            {m1.activePowerKw > 0 ? `${m1.activePowerKw.toFixed(0)}` : "—"}<span className="text-sm font-normal ml-0.5">kW</span>
          </div>
          <div className="kpi-sub mt-1 text-slate-400">{m1.apparentPowerKva.toFixed(0)} kVA biểu kiến</div>
        </button>

        <button 
          onClick={() => setActiveTab("m3")}
          className="kpi-card amber hover:scale-[1.02] cursor-pointer transition-transform text-left"
        >
          <div className="kpi-label">Công Suất Solar</div>
          <div className="kpi-value amber text-2xl font-display font-semibold mt-1">
            {m3.recSolarPowerKwp > 0 ? `${m3.recSolarPowerKwp.toFixed(1)}` : "—"}<span className="text-sm font-normal ml-0.5">kWp</span>
          </div>
          <div className="kpi-sub mt-1 text-slate-400">{m3.inverterPowerKw.toFixed(1)} kW Inverter</div>
        </button>

        <button 
          onClick={() => setActiveTab("m2")}
          className="kpi-card purple hover:scale-[1.02] cursor-pointer transition-transform text-left"
        >
          <div className="kpi-label">Tụ Bù Cần Thiết</div>
          <div className="kpi-value purple text-2xl font-display font-semibold mt-1">
            {m2.requiredKvar > 0 ? `${m2.requiredKvar.toFixed(0)}` : "—"}<span className="text-sm font-normal ml-0.5">kVAr</span>
          </div>
          <div className="kpi-sub mt-1 text-slate-400">{m2.recommendedStepCount} bước x {state.module2.selectedStepSize} kVAr</div>
        </button>

        <button 
          onClick={() => setActiveTab("m4")}
          className="kpi-card cyan hover:scale-[1.02] cursor-pointer transition-transform text-left"
        >
          <div className="kpi-label">Sụt Áp Cáp Nguồn</div>
          <div className="kpi-value cyan text-2xl font-display font-semibold mt-1">
            {m4.voltageDropPercent > 0 ? `${m4.voltageDropPercent.toFixed(2)}` : "—"}<span className="text-sm font-normal ml-0.5">%</span>
          </div>
          <div className="kpi-sub mt-1 text-slate-400">IEC Limit: {state.module4.allowableDropPercent}%</div>
        </button>

        <button 
          onClick={() => setActiveTab("m3")}
          className="kpi-card green hover:scale-[1.02] cursor-pointer transition-transform text-left"
        >
          <div className="kpi-label">Tiết Kiệm / Năm</div>
          <div className="kpi-value green text-2xl font-display font-semibold mt-1">
            {m3.annualElectricitySavedVnd > 0 ? `~${(m3.annualElectricitySavedVnd / 1e6).toFixed(1)}M` : "—"}<span className="text-xs font-normal ml-0.5">đ</span>
          </div>
          <div className="kpi-sub mt-1 text-slate-400">Thu hồi cực tốt: {m3.paybackPeriodYears.toFixed(1)}y</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Load Chart */}
        <div className="chart-wrap min-h-[300px] flex flex-col justify-between">
          <div className="chart-title flex justify-between items-center pb-2 border-b border-[#1e3248]/30">
            <span>⚡ Phân Bố Công Suất Trạm Biến Áp (P VS Q)</span>
            <span className="text-[10px] font-mono text-[#00d4ff] bg-[#00d4ff]/10 px-2 py-0.5 rounded">MSB Realtime</span>
          </div>
          <div className="flex-1 relative min-h-[220px]">
            <Doughnut {...{ key: "dashboard-doughnut", data: doughnutData, options: doughnutOptions } as any} />
          </div>
        </div>

        {/* Solar VS Load Profile */}
        <div className="chart-wrap min-h-[300px] flex flex-col justify-between">
          <div className="chart-title flex justify-between items-center pb-2 border-b border-[#1e3248]/30">
            <span>☀️ Chu Kỳ Sương Nắng 24H (Tải vs Solar Bám Tải)</span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Zero-Export Capped</span>
          </div>
          <div className="flex-1 min-h-[220px] pt-4">
            <Line {...{ key: "dashboard-line", data: lineChartData, options: lineChartOptions } as any} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GAUGES PANEL */}
        <div className="md:col-span-2 card grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricGauge 
            value={m1.powerFactor} 
            min={0.5} 
            max={1.0} 
            title="Đồng hồ Cosphi hệ thống" 
            unit="" 
            type="pf" 
          />
          <MetricGauge 
            value={m1.transformerLoadPercent} 
            min={0} 
            max={120} 
            title="Tốc độ mang tải Máy biến áp" 
            unit="%" 
            type="mba" 
          />
        </div>

        {/* SCADA MONITOR ALERTS LIST */}
        <div className="card flex flex-col h-full justify-between">
          <div>
            <div className="card-title pb-2 border-b border-[#1e3248]/30 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Hệ Thống Cảnh Báo SCADA</span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {alerts.map((alt, idx) => {
                const alertClasses = {
                  green: "bg-[#00ff88]/5 border-[#00ff88]/20 text-[#00ff88]/90",
                  amber: "bg-amber-400/5 border-amber-400/20 text-amber-400/90",
                  red: "bg-rose-500/5 border-rose-500/20 text-rose-500/90",
                  cyan: "bg-[#00d4ff]/5 border-[#00d4ff]/20 text-[#00d4ff]/90",
                };

                return (
                  <div 
                    key={idx} 
                    onClick={() => alt.actionTab && setActiveTab(alt.actionTab)}
                    className={`alert flex gap-2 border p-3 rounded-md text-xs leading-relaxed group transition-all duration-200 ${alertClasses[alt.type]} ${alt.actionTab ? "cursor-pointer hover:border-slate-400" : ""}`}
                  >
                    {alt.type === "red" && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                    {alt.type === "amber" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                    {alt.type === "green" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                    {alt.type === "cyan" && <Info className="w-4 h-4 text-cyan-450 shrink-0 mt-0.5" />}
                    
                    <div className="flex-1">
                      <p>{alt.text}</p>
                      {alt.actionTab && (
                        <span className="text-[10px] font-mono underline block mt-1 opacity-60 group-hover:opacity-100">
                          Nhấp để hiệu chỉnh trong Module
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e3248]/20 text-center text-[10px] text-slate-500 font-mono">
            HỆ THỐNG GIÁM SÁT EPC TRẠM BIÊN ÁP VIỆT NAM · BẢM TẢI ONLINE
          </div>
        </div>
      </div>
    </div>
  );
};
