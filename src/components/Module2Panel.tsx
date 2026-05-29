import React from "react";
import { BatteryCharging, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Module2State } from "../types";
import { calculateModule2 } from "../utils/calculator";
import { Bar } from "react-chartjs-2";

interface Module2PanelProps {
  state: Module2State;
  onChange: (fields: Partial<Module2State>) => void;
}

export const Module2Panel: React.FC<Module2PanelProps> = ({ state, onChange }) => {
  const result = calculateModule2(state);

  const handleReset = () => {
    onChange({
      loadKw: 500,
      currentPf: 0.78,
      targetPf: 0.92,
      voltage: 380,
      selectedStepSize: 25,
      ctRatioPrimary: 800,
      ctRatioSecondary: 5
    });
  };

  // Bar Chart Configuration for Pre vs Post PF
  const barChartData = {
    labels: ["Hệ Số PF Trước Bù (Cosφ₁)", "Hệ Số PF Sau Bù Thực Tế", "Mục Tiêu Thiết Kế (Cosφ₂)"],
    datasets: [
      {
        data: [result.underCompensatedPf, result.compensatedPf, state.targetPf],
        backgroundColor: [
          "rgba(255, 68, 68, 0.55)",  // Red for undercompensated
          "rgba(0, 212, 255, 0.7)",   // Neon Cyan for actual after
          "rgba(0, 255, 136, 0.6)"    // Emerald for target
        ],
        borderColor: ["#ff4444", "#00d4ff", "#00ff88"],
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 45,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111c2a",
        borderColor: "#1e3248",
        borderWidth: 1,
        titleColor: "#e8f4ff",
        bodyFont: { family: "JetBrains Mono" }
      }
    },
    scales: {
      y: {
        min: 0.4,
        max: 1.05,
        grid: { color: "#1e324820" },
        ticks: { color: "#7aa3c8", font: { family: "JetBrains Mono", size: 10 } },
        title: { display: true, text: "Hệ Số Công Suất (0 - 1)", color: "#7aa3c8", font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#7aa3c8", font: { size: 11, weight: "bold" as const } }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="section-header pb-4 border-b border-[#1e3248]/30">
        <h2 className="section-title text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
          <BatteryCharging className="w-5 h-5 text-[#00ff88]" />
          <span>Module 2 — Tính Toán Tụ Bù Cosφ & Điện áp C/K Relay</span>
        </h2>
        <p className="section-subtitle text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
          THIẾT KẾ CẤP TỤ TRIỆT TIÊU KVA PHẢN KHÁNG · PHÒNG CHỐNG QUÁ TẢI THIẾT BỊ NGUỒN
        </p>
        <div className="formula-badge mt-3 inline-flex bg-slate-900 border border-slate-800 text-[#00ff88] text-xs font-mono py-1 px-3 rounded-full">
          Qb = P × (tanφ₁ − tanφ₂) &nbsp;|&nbsp; C/K = I_c1 / CT_Ratio &nbsp;|&nbsp; I_c1 = Q_step / (√3 × U)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT INPUT-PANEL */}
        <div className="lg:col-span-5 card space-y-4">
          <div className="card-title text-sm font-semibold tracking-wider text-slate-400 uppercase">
            <span>📥 Thông Số Trạm Điện Phụ Tải</span>
          </div>

          <div className="space-y-4">
            <div className="input-group">
              <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Công suất tải tác dụng thực (P)</span>
                <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">kW</span>
              </label>
              <input
                type="number"
                className="inp"
                value={state.loadKw}
                min="1"
                step="5"
                onChange={(e) => onChange({ loadKw: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Cosφ₁ Hiện Trạng</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">Hệ Số</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.currentPf}
                  min="0.1"
                  max="0.99"
                  step="0.01"
                  onChange={(e) => onChange({ currentPf: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Cosφ₂ Mục Tiêu</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">EVN≥0.90</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.targetPf}
                  min="0.4"
                  max="1.0"
                  step="0.01"
                  onChange={(e) => onChange({ targetPf: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Cấp điện áp tủ bù</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">Volt</span>
                </label>
                <select
                  className="inp"
                  value={state.voltage}
                  onChange={(e) => onChange({ voltage: parseInt(e.target.value) })}
                >
                  <option value="380">380 V</option>
                  <option value="400">400 V</option>
                  <option value="415">415 V</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Công suất/1 Block Tụ</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">kVAr</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.selectedStepSize}
                  min="5"
                  step="5"
                  onChange={(e) => onChange({ selectedStepSize: parseFloat(e.target.value) || 25 })}
                />
              </div>
            </div>

            <div className="divider opacity-50" />
            <div className="card-title text-xs font-semibold tracking-wider text-slate-400 uppercase pt-1">
              <span>🎚️ Thiết Lập Chọn Tỉ Số Biến Dòng (CT)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Dòng Sơ Cấp CT</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">Primary A</span>
                </label>
                <select
                  className="inp"
                  value={state.ctRatioPrimary}
                  onChange={(e) => onChange({ ctRatioPrimary: parseInt(e.target.value) })}
                >
                  <option value="100">100 A</option>
                  <option value="150">150 A</option>
                  <option value="200">200 A</option>
                  <option value="250">250 A</option>
                  <option value="300">300 A</option>
                  <option value="400">400 A</option>
                  <option value="500">500 A</option>
                  <option value="600">600 A</option>
                  <option value="800">800 A</option>
                  <option value="1000">1000 A</option>
                  <option value="1200">1200 A</option>
                  <option value="1600">1600 A</option>
                  <option value="2000">2000 A</option>
                  <option value="2500">2500 A</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Thứ Cấp Rơle</span>
                  <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">Secondary</span>
                </label>
                <select
                  className="inp"
                  value={state.ctRatioSecondary}
                  onChange={(e) => onChange({ ctRatioSecondary: parseInt(e.target.value) })}
                >
                  <option value="5">/ 5 A (Chuẩn thông dụng)</option>
                  <option value="1">/ 1 A</option>
                </select>
              </div>
            </div>
          </div>

          <div className="btn-row flex gap-2 pt-4 border-t border-[#1e3248]/20">
            <button onClick={handleReset} className="btn btn-outline text-xs px-4 py-2 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Mặc Định</span>
            </button>
          </div>
        </div>

        {/* COMPUTED TỤ BÙ RESULTS DISPLAY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="kpi-card cyan">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Dung lượng lý thuyết (Qb)</div>
              <div className="kpi-value cyan text-2xl font-bold font-display mt-1">{result.requiredKvar.toFixed(1)} kVAr</div>
              <div className="kpi-sub mt-1 text-slate-400">Công suất bù chính xác lượng hụt</div>
            </div>

            <div className="kpi-card green">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Tổng dung lượng thực tế lắp</div>
              <div className="kpi-value green text-2xl font-bold font-display mt-1">{result.actualCompKvar} kVAr</div>
              <div className="kpi-sub mt-1 text-slate-400">Làm tròn thành: {result.stepsText}</div>
            </div>

            <div className="kpi-card purple font-mono">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono text-purple-400">Hệ Số Hệ Cài Đặt (C/K)</div>
              <div className="kpi-value text-purple-400 text-2xl font-bold font-display mt-1">{result.ckRatio.toFixed(3)}</div>
              <div className="kpi-sub mt-1 text-slate-400">Đặt lên rơ le (Mikro/Selec/Ducati)</div>
            </div>

            <div className="kpi-card amber">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Thời gian Cosphi Sau Bù</div>
              <div className="kpi-value amber text-2xl font-bold font-display mt-1">{result.compensatedPf.toFixed(3)}</div>
              <div className="kpi-sub mt-1 text-slate-400">Độ sụt kVA biểu kiến hữu hiệu</div>
            </div>
          </div>

          {/* PF CHART COMPARISON Panel */}
          <div className="card space-y-4">
            <h3 className="card-title text-xs tracking-wider uppercase text-slate-400">📊 So Sánh Hệ Số PF Trước & Sau Bù Tự Động</h3>
            <div className="h-[210px] relative">
              <Bar {...{ key: "module2-bar", data: barChartData, options: barChartOptions } as any} />
            </div>

            {/* Warnings context */}
            <div className="pt-2">
              {result.hasOvercompensationRisk ? (
                <div className="alert alert-amber p-3 rounded font-mono text-xs leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold underline block mb-0.5">Dấu Hiệu Bù Dư (Overcompensation Risk!)</span>
                    <span>Q_bục thực tế lớn hơn hoặc Cosφ₂ mục tiêu cận 1.0. Khi nhà máy dừng sản xuất (Low load), tụ bù tự động nếu bị dính tiếp điểm rơ le sẽ đẩy điện áp tăng cao, nguy hại thiết bị đắt tiền! Khuyên hạ Cosphi mục tiêu xuống 0.93 - 0.95.</span>
                  </div>
                </div>
              ) : (
                <div className="alert alert-green p-3 rounded font-mono text-xs leading-relaxed flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>DUNG LƯỢNG TRONG GIỚI HẠN AN TOÀN: Tổng tụ bù đề xuất đạt {result.actualCompKvar} kVAr ({result.recommendedStepCount} cấp) bù êm, không gây lạm phát áp tự bù ngược dòng phát sinh.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
