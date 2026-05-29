import React from "react";
import { Sun, RotateCcw, AlertTriangle, CheckCircle2, TrendingUp, HelpCircle } from "lucide-react";
import { Module3State, SOLAR_PANELS } from "../types";
import { calculateModule3 } from "../utils/calculator";
import { Line } from "react-chartjs-2";

interface Module3PanelProps {
  state: Module3State;
  onChange: (fields: Partial<Module3State>) => void;
  module1AvgKva?: number;
}

export const Module3Panel: React.FC<Module3PanelProps> = ({ state, onChange, module1AvgKva }) => {
  const result = calculateModule3(state, module1AvgKva);

  const handleReset = () => {
    onChange({
      daytimeAvgLoadKw: 800,
      daytimeMinLoadKw: 400,
      actualLoadCurrent: 550,
      pf: 0.85,
      operatingHours: 10,
      roofAreaSqM: 3000,
      roofType: "metal",
      hasZeroExport: true,
      electricityRateVnd: 2800,
      installationCostPerKwpVnd: 12000000,
      selectedPanelId: "ja-630-bifacial"
    });
  };

  // Profiles for Solar vs Load curve (detailed hourly)
  const hours_label = ["06h","07h","08h","09h","10h","11h","12h","13h","14h","15h","16h","17h","18h"];
  const solar_profile = [0.05, 0.2, 0.5, 0.75, 0.9, 0.95, 1.0, 0.95, 0.85, 0.7, 0.5, 0.25, 0.05];
  const load_profile =  [0.7, 0.75, 0.82, 0.85, 0.90, 0.95, 1.0, 0.98, 0.95, 0.90, 0.88, 0.82, 0.6];

  const solarGenData = solar_profile.map(f => +(result.recSolarPowerKwp * f).toFixed(1));
  const loadData = load_profile.map(f => +(state.daytimeAvgLoadKw * f).toFixed(1));
  
  // Under zero-export grid-mode, actual absorbed solar can't exceed load at any point
  const actualAbsorbedSolar = solarGenData.map((s, idx) => {
    const l = loadData[idx];
    if (state.hasZeroExport && s > l) {
      return l; // Clipped/curtailed power loss
    }
    return s;
  });

  const lineChartData1 = {
    labels: hours_label,
    datasets: [
      {
        label: "Dự phóng Tải nhà máy (kW)",
        data: loadData,
        borderColor: "#ffb020",
        backgroundColor: "rgba(255,176,32,0.03)",
        tension: 0.4,
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Bức xạ Solar lý thuyết (kWp phát ra)",
        data: solarGenData,
        borderColor: "#00d4ff",
        borderDash: [4, 4],
        tension: 0.4,
        borderWidth: 1.5,
        fill: false,
      },
      {
        label: "Hấp thụ thực tế Solar bám tải (kW)",
        data: actualAbsorbedSolar,
        borderColor: "#00ff88",
        backgroundColor: "rgba(0,255,136,0.1)",
        tension: 0.4,
        borderWidth: 2.5,
        fill: true,
      }
    ]
  };

  const lineChartOptions1 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#7aa3c8", font: { size: 10 } }
      }
    },
    scales: {
      y: { grid: { color: "#1e324820" }, ticks: { color: "#7aa3c8", font: { size: 9 } } },
      x: { grid: { display: false }, ticks: { color: "#7aa3c8", font: { size: 9 } } }
    }
  };

  // ROI Payback Cash cumulative calculation over 20 years
  const years = Array.from({ length: 21 }, (_, i) => `Yr ${i}`);
  const cumulativeSavings = years.map((_, i) => +(i * result.annualElectricitySavedVnd / 1e6).toFixed(1));
  const investmentCapex = Array(21).fill(+(result.capitalCostVnd / 1e6).toFixed(1));

  const lineChartData2 = {
    labels: years,
    datasets: [
      {
        label: "Dòng tiền tiết kiệm tích lũy (triệu VNĐ)",
        data: cumulativeSavings,
        borderColor: "#00ff88",
        backgroundColor: "rgba(0,255,136,0.04)",
        tension: 0.1,
        borderWidth: 2.5,
        fill: true,
      },
      {
        label: "Đầu tư ban đầu (triệu VNĐ)",
        data: investmentCapex,
        borderColor: "#ff4444",
        borderDash: [6, 4],
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
      }
    ]
  };

  const lineChartOptions2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#7aa3c8", font: { size: 10 } }
      }
    },
    scales: {
      y: { grid: { color: "#1e324820" }, ticks: { color: "#7aa3c8", font: { size: 9 } } },
      x: { grid: { display: false }, ticks: { color: "#7aa3c8", font: { size: 8 } } }
    }
  };

  return (
    <div className="space-y-6">
      <div className="section-header pb-4 border-b border-[#1e3248]/30">
        <h2 className="section-title text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <span>Module 3 — Sizing Thiết Kế Solar Rooftop Tự Sản Tự Tiêu</span>
        </h2>
        <p className="section-subtitle text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
          QUY HOẠCH BÁM TẢI (ZERO EXPORT) · ƯỚC TÍNH SẢN LƯỢNG · KHÁI TOÁN KINH TẾ ROI
        </p>
        <div className="formula-badge mt-3 inline-flex bg-slate-900 border border-slate-800 text-amber-400 text-xs font-mono py-1 px-3 rounded-full">
          P_solar = (0.7 ~ 0.8) × P_load_day &nbsp;|&nbsp; Diện tích 1 kWp ≈ 4.8 - 5.2 m² &nbsp;|&nbsp; Hệ số suy hao vật lý PR = 78%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT CARD */}
        <div className="lg:col-span-5 card space-y-4">
          <div className="card-title text-sm font-semibold tracking-wider text-slate-400 uppercase">
            <span>📥 Thông Số Kỹ Thuật Mặt Bằng</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Tải ban ngày (Avg)</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5" style={{ borderRadius: "2px" }}>kW</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.daytimeAvgLoadKw}
                  min="1"
                  onChange={(e) => onChange({ daytimeAvgLoadKw: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Tải bám tối thiểu</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5" style={{ borderRadius: "2px" }}>kW</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.daytimeMinLoadKw}
                  min="1"
                  onChange={(e) => onChange({ daytimeMinLoadKw: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Diện tích mái có sẵn</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5" style={{ borderRadius: "2px" }}>m²</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.roofAreaSqM}
                  min="10"
                  onChange={(e) => onChange({ roofAreaSqM: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Cơ chế bảo vệ lưới</span>
                </label>
                <select
                  className="inp"
                  value={state.hasZeroExport ? "yes" : "no"}
                  onChange={(e) => onChange({ hasZeroExport: e.target.value === "yes" })}
                >
                  <option value="yes">Zero Export (Bản quyền bám tải)</option>
                  <option value="no">Net Metering (Cho phát ngược tối đa)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Giá mua điện EVN</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5" style={{ borderRadius: "2px" }}>đ/kWh</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.electricityRateVnd}
                  min="500"
                  onChange={(e) => onChange({ electricityRateVnd: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Suất EPC trọn gói</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5" style={{ borderRadius: "2px" }}>đ/Wp</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.installationCostPerKwpVnd}
                  min="1000000"
                  step="100000"
                  onChange={(e) => onChange({ installationCostPerKwpVnd: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Tấm Pin Solar Lựa Chọn (580Wp - 700Wp)</span>
                <span className="text-[#00d4ff] text-[10px] font-mono">Hãng lớn · Thao tác chọn nhanh</span>
              </label>
              <select
                className="inp text-slate-100"
                value={state.selectedPanelId || "ja-630-bifacial"}
                onChange={(e) => onChange({ selectedPanelId: e.target.value })}
              >
                {SOLAR_PANELS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#111e2e] text-slate-100">
                    [{p.brand}] {p.model} — {p.powerWp}Wp ({p.efficiency}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Panel details spec details sheet */}
            {result.selectedPanel && (
              <div className="bg-[#0b131c]/90 border border-[#1e3248]/45 p-3 rounded-lg space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-[#1e3248]/30 pb-1.5">
                  <span className="text-slate-400">⚡ Pmax Công Suất:</span>
                  <span className="text-amber-400 font-bold">{result.selectedPanel.powerWp} Wp</span>
                </div>
                <div className="flex justify-between border-b border-[#1e3248]/30 pb-1.5">
                  <span className="text-slate-400">📊 Hiệu Suất Tấm:</span>
                  <span className="text-emerald-400 font-bold">{result.selectedPanel.efficiency}%</span>
                </div>
                <div className="flex justify-between border-b border-[#1e3248]/30 pb-1.5">
                  <span className="text-slate-400">📏 Kích Thước (CxRxS):</span>
                  <span className="text-slate-200">{result.selectedPanel.dimensions}</span>
                </div>
                <div className="flex justify-between border-b border-[#1e3248]/30 pb-1.5">
                  <span className="text-slate-400">⚖️ Trọng Lượng:</span>
                  <span className="text-slate-200">{result.selectedPanel.weight} kg</span>
                </div>
                <div className="flex justify-between items-start gap-1">
                  <span className="text-slate-400 shrink-0">🔬 Công Nghệ Cell:</span>
                  <span className="text-slate-300 text-right text-[11px] leading-tight break-words max-w-[170px]" title={result.selectedPanel.cellType}>
                    {result.selectedPanel.cellType}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="btn-row flex gap-2 pt-4 border-t border-[#1e3248]/20">
            <button onClick={handleReset} className="btn btn-outline text-xs px-4 py-2 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Mặc Định</span>
            </button>
          </div>
        </div>

        {/* OUTPUT COMPLEX PANEL */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="kpi-card cyan">
              <div className="kpi-label text-[9px] uppercase tracking-wider font-mono">Solar Đề Xuất DC</div>
              <div className="kpi-value cyan text-xl sm:text-2xl font-bold font-display mt-1">
                {result.recSolarPowerKwp.toFixed(1)} <span className="text-xs font-normal">kWp</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">
                Diện tích: {Math.ceil((result.recSolarPowerKwp * 1000 / result.selectedPanel.powerWp) * result.selectedPanel.area)} m²
              </div>
            </div>

            <div className="kpi-card green">
              <div className="kpi-label text-[9px] uppercase tracking-wider font-mono">Inverter AC Đề Xuất</div>
              <div className="kpi-value green text-xl sm:text-2xl font-bold font-display mt-1">
                {result.inverterPowerKw.toFixed(1)} <span className="text-xs font-normal">kW AC</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">Tỷ lệ DC/AC: 115% an toàn</div>
            </div>

            <div className="kpi-card purple">
              <div className="kpi-label text-[9px] uppercase tracking-wider font-mono">Số tấm pin ước tính</div>
              <div className="kpi-value purple text-xl sm:text-2xl font-bold font-display mt-1">
                {Math.ceil(result.recSolarPowerKwp * 1000 / result.selectedPanel.powerWp)} <span className="text-xs font-normal">Tấm</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">Bản: {result.selectedPanel.brand} {result.selectedPanel.powerWp}W</div>
            </div>

            <div className="kpi-card amber">
              <div className="kpi-label text-[9px] uppercase tracking-wider font-mono">Sản lượng trung bình năm</div>
              <div className="kpi-value amber text-xl sm:text-2xl font-bold font-display mt-1">
                {Math.round(result.generationYearlyKwh / 1000).toLocaleString("vi-VN")} <span className="text-xs font-normal">MWh</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">Khấu trừ 8% tản nhiệt/bụi</div>
            </div>

            <div className="kpi-card cyan">
              <div className="kpi-label text-[9px] uppercase tracking-wider font-mono">Vốn đầu tư ban đầu</div>
              <div className="kpi-value cyan text-xl sm:text-2xl font-bold font-display mt-1">
                {Math.round(result.capitalCostVnd / 1e6).toLocaleString("vi-VN")} <span className="text-xs font-normal">Trđ</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">EPC bao thầu vật tư trọn gói</div>
            </div>

            <div className="kpi-card green">
              <div className="kpi-label text-[9px] uppercase tracking-wider font-mono">Thời gian hoàn vốn</div>
              <div className="kpi-value green text-xl sm:text-2xl font-bold font-display mt-1">
                {result.paybackPeriodYears.toFixed(1)} <span className="text-xs font-normal">Năm</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">ROI đạt ~{(100 / result.paybackPeriodYears).toFixed(1)}% / năm</div>
            </div>
          </div>

          {/* Alarm warning alert */}
          <div className="card space-y-3">
            <h3 className="card-title text-xs tracking-wider uppercase text-slate-450 flex items-center gap-1.5">
              <span>⚠️ Sự Cố Kỹ Thuật Kèm Cảnh Báo Sizing Solar bám tải</span>
            </h3>

            <div className="space-y-2">
              {result.hasEvnFeedinRisk ? (
                <div className="alert alert-red p-2.5 rounded text-[11px] font-mono leading-relaxed flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>NGUY CƠ PHÁT NGƯỢC: Công suất Solar lớn hơn tải đáy trong xưởng ({state.daytimeMinLoadKw} kW). Không lắp khóa Zero Export sẽ bị EVN ghi phạt phát ngược lưới!</span>
                </div>
              ) : null}

              {result.lowPfRiskAfterSolar ? (
                <div className="alert alert-amber p-2.5 rounded text-[11px] font-mono leading-relaxed flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>SỤT GIẢM COSPHI LƯỚI: Solar lọc lấy gần hết kW tải tác dụng làm dòng lưới nhập bù trôi nhiều kVAr cảm kháng từ máy nén, hạ Cosphi đột ngột. Kiến nghị lắp bộ bù công suất động.</span>
                </div>
              ) : (
                <div className="alert alert-green p-2.5 rounded text-[11px] font-mono leading-relaxed flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>SỐ CHỈ TẢI AN TOÀN: Hệ thống bám bít dòng Solar, không có rủi ro ngược điện lưới hoặc drop Cosphi đỉnh trạm phát.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginTop: "24px" }}>
        {/* Graph 1 Solar Load Midday curve */}
        <div className="chart-wrap min-h-[260px] flex flex-col justify-between">
          <div className="chart-title flex justify-between items-center pb-2 border-b border-[#1e3248]/35">
            <span>☀️ BIỂU ĐỒ BĂM KHỚP SOLAR VS TẢI XƯỞNG BAN NGÀY</span>
          </div>
          <div className="flex-1 min-h-[200px] pt-4">
            <Line {...{ key: "module3-line-1", data: lineChartData1, options: lineChartOptions1 } as any} />
          </div>
        </div>

        {/* Graph 2 Cumulative payback ROI years layout */}
        <div className="chart-wrap min-h-[260px] flex flex-col justify-between">
          <div className="chart-title flex justify-between items-center pb-2 border-b border-[#1e3248]/35">
            <span>💰 BIỂN TRƯỜNG DÒNG TIỀN VÀ THU HỒI VỐN ĐẦU TƯ (20 NĂM)</span>
          </div>
          <div className="flex-1 min-h-[200px] pt-4">
            <Line {...{ key: "module3-line-2", data: lineChartData2, options: lineChartOptions2 } as any} />
          </div>
        </div>
      </div>
    </div>
  );
};
