import React from "react";
import { Zap, RotateCcw, AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import { Module1State } from "../types";
import { calculateModule1, getAmpereToKwTable } from "../utils/calculator";
import { MetricGauge } from "./MetricGauge";

interface Module1PanelProps {
  state: Module1State;
  onChange: (fields: Partial<Module1State>) => void;
}

export const Module1Panel: React.FC<Module1PanelProps> = ({ state, onChange }) => {
  const result = calculateModule1(state);

  // Conversion table
  const currents = [25, 50, 100, 150, 200, 400, 630, 800, 1000, 1250, 1600, 2000];
  const apps: { [key: number]: string } = {
    25: "Đầu nối động cơ nhỏ, chiếu sáng văn phòng",
    50: "Tủ điện phân phối phụ (DB), Bơm quạt nước",
    100: "Tủ phân phối phân xưởng nhỏ",
    150: "Động cơ khởi động lớn, xưởng may",
    200: "Mạch động lực tủ MSB nhỏ",
    400: "Mạch động lực tủ MSB trung bình",
    630: "Cấp nguồn xưởng gia công cơ khí lớn",
    800: "Cáp tổng trạm biến áp sụt tải 500kVA",
    1000: "Cáp tổng trạm biến áp sụt tải 630kVA",
    1250: "Cáp tổng trạm biến áp sụt tải 1000kVA",
    1600: "Cáp tổng trạm biến áp sụt tải 1250kVA",
    2000: "Cáp tổng siêu trạm sụt tải 1600kVA"
  };

  const handleReset = () => {
    onChange({
      voltage: 380,
      currentR: 100,
      currentS: 100,
      currentT: 100,
      cosphi: 0.85,
      transformerKva: 1000,
      kwhConsumption: 45000
    });
  };

  // Safe checks for R, S, T currents
  const Imax = Math.max(state.currentR, state.currentS, state.currentT);
  const Imin = Math.min(state.currentR, state.currentS, state.currentT);
  const imbalance = result.avgCurrent > 0 ? ((Imax - Imin) / result.avgCurrent) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="section-header pb-4 border-b border-[#1e3248]/30">
        <h2 className="section-title text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-450 text-[#00d4ff]" />
          <span>Module 1 — Kỹ Thuật Công Suất Điện 3 Pha</span>
        </h2>
        <p className="section-subtitle text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
          PHÂN TÍCH DIỆN RỘNG P/Q/S · SCAN CÂN BẰNG PHA · CẢNH BÁO TẢI TRẠM MBA
        </p>
        <div className="formula-badge mt-3 inline-flex bg-slate-900 border border-slate-800 text-[#00d4ff] text-xs font-mono py-1 px-3 rounded-full">
          P = √3 × U × I_avg × Cosφ &nbsp;|&nbsp; Q = √3 × U × I_avg × Sinφ &nbsp;|&nbsp; S = √3 × U × I_avg
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM PANEL */}
        <div className="lg:col-span-5 card space-y-4">
          <div className="card-title text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <span>📥 Dữ Liệu Đo Đạc Đầu Vào</span>
          </div>

          <div className="space-y-4">
            {/* Voltage levels */}
            <div className="input-group">
              <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Điện áp dây định mức (U)</span>
                <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">Volt</span>
              </label>
              <select
                className="inp w-full"
                value={state.voltage}
                onChange={(e) => onChange({ voltage: parseInt(e.target.value) })}
              >
                <option value="380">380 V (Tiêu chuẩn Việt Nam hạ thế)</option>
                <option value="400">400 V (Quy chuẩn IEC quốc tế)</option>
                <option value="415">415 V (Tiêu chuẩn hạ thế Úc/Anh)</option>
              </select>
            </div>

            {/* Currents */}
            <div className="grid grid-cols-3 gap-3">
              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Pha R (IR)</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.currentR}
                  min="0"
                  step="0.1"
                  onChange={(e) => onChange({ currentR: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Pha S (IS)</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.currentS}
                  min="0"
                  step="0.1"
                  onChange={(e) => onChange({ currentS: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="input-group">
                <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Pha T (IT)</span>
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.currentT}
                  min="0"
                  step="0.1"
                  onChange={(e) => onChange({ currentT: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Power Factor */}
            <div className="input-group">
              <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1">
                  Hệ số công suất công nghiệp (Cosφ)
                </span>
                <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">0.1 - 1.0</span>
              </label>
              <input
                type="number"
                className="inp"
                value={state.cosphi}
                min="0.1"
                max="1.0"
                step="0.01"
                onChange={(e) => onChange({ cosphi: parseFloat(e.target.value) || 0.85 })}
              />
            </div>

            {/* MBA capacity */}
            <div className="input-group">
              <label className="input-label flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Công suất máy biến áp trạm (S_mba)</span>
                <span className="input-unit text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded">kVA</span>
              </label>
              <input
                type="number"
                className="inp"
                value={state.transformerKva}
                min="0"
                step="10"
                onChange={(e) => onChange({ transformerKva: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="btn-row flex gap-2 pt-4 border-t border-[#1e3248]/20">
            <button onClick={handleReset} className="btn btn-outline text-xs px-4 py-2 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Mặc Định</span>
            </button>
          </div>
        </div>

        {/* COMPUTED RESULT DISPLAY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="kpi-card cyan">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Công Suất Thực (P)</div>
              <div className="kpi-value cyan text-2xl font-bold font-display mt-1">{result.activePowerKw.toFixed(1)} kW</div>
              <div className="kpi-sub mt-1 text-slate-400">Sinh công thực hữu ích</div>
            </div>

            <div className="kpi-card green">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Công Suất Biểu Kiến (S)</div>
              <div className="kpi-value green text-2xl font-bold font-display mt-1">{result.apparentPowerKva.toFixed(1)} kVA</div>
              <div className="kpi-sub mt-1 text-slate-400">Tổng quan phụ tải biểu kiến</div>
            </div>

            <div className="kpi-card amber">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Công Suất Kháng (Q)</div>
              <div className="kpi-value amber text-2xl font-bold font-display mt-1">{result.reactivePowerKvar.toFixed(1)} kVAr</div>
              <div className="kpi-sub mt-1 text-slate-400">Sinh từ trường phát sinh phát nhiệt</div>
            </div>

            <div className="kpi-card purple">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Dòng Điện Trung Bình</div>
              <div className="kpi-value purple text-2xl font-bold font-display mt-1">{result.avgCurrent.toFixed(1)} A</div>
              <div className="kpi-sub mt-1 text-slate-400">Pha lệch gốc tải R/S/T</div>
            </div>
          </div>

          {/* MBA Loading Gauge & alerts */}
          <div className="card space-y-4">
            <h3 className="card-title text-xs tracking-wider uppercase text-slate-400">📊 Tải Máy Biến Áp & Cân Pha</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="w-full sm:w-1/2">
                <MetricGauge 
                  value={result.transformerLoadPercent}
                  min={0}
                  max={120}
                  title="Mức tải MBA định danh"
                  unit="%"
                  type="mba"
                />
              </div>

              <div className="w-full sm:w-1/2 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span>Độ mất cân bằng pha</span>
                    <span className={imbalance > 15 ? "text-rose-500 font-bold" : "text-emerald-400 font-bold"}>
                      {imbalance.toFixed(1)}%
                    </span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div 
                      className={`progress-bar-fill ${imbalance > 15 ? "pb-red" : "pb-cyan"}`} 
                      style={{ width: `${Math.min(100, imbalance)}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {/* MBA capacity context */}
                  {state.transformerKva > 0 ? (
                    result.transformerLoadPercent > 85 ? (
                      <div className="alert alert-red p-2.5 rounded text-[11px] font-mono leading-relaxed flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>CẢNH BÁO MBA: Trạm sụt quá tải ({result.transformerLoadPercent.toFixed(1)}%). Vận hành lâu dài có nguy cơ cháy nổ nổ sập cuộn dây! Khẩn trương dãn tải.</span>
                      </div>
                    ) : (
                      <div className="alert alert-green p-2.5 rounded text-[11px] font-mono leading-relaxed flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>MBA AN TOÀN: Công suất biểu kiến {result.apparentPowerKva.toFixed(1)} kVA nằm mượt trong giới hạn {state.transformerKva} kVA của máy.</span>
                      </div>
                    )
                  ) : null}

                  {imbalance > 15 ? (
                    <div className="alert alert-amber p-2.5 rounded text-[11px] font-mono leading-relaxed flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>CÂN PHA: Lệch pha R-S-T đạt {imbalance.toFixed(1)}% vượt tiêu chuẩn lý tưởng 15%. Cần cân lại phụ tải các hộ tiêu dùng đơn lẻ!</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK REF CONVERSION TABLE */}
      <div className="divider" />
      <div className="card space-y-4">
        <div className="card-title text-sm tracking-wider uppercase text-slate-400 flex justify-between items-center">
          <span>📋 Bảng tra nhanh dòng cực đại MCCB tiêu chuẩn từ A sang phụ tải thực tế</span>
          <span className="text-xs text-[#00d4ff] font-mono">Biến số điện áp: {state.voltage}V · Cosφ: {state.cosphi}</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="font-mono text-left py-2 font-semibold">Cỡ Dòng MCCB (Ampere)</th>
                <th className="font-mono text-right py-2 font-semibold">Công xuất biểu kiến (kVA)</th>
                <th className="font-mono text-right py-2 font-semibold text-[#00d4ff]">Tải thực tế kW (Cosφ={state.cosphi})</th>
                <th className="font-mono text-right py-2 font-semibold">Tải thực tế kW (Cosφ=0.90)</th>
                <th className="font-mono text-right py-2 font-semibold">Tải thực tế kW (Cosφ=1.0)</th>
                <th className="font-mono text-left py-2 pl-6 font-semibold">Khuyến nghị phân bổ máy sản xuất</th>
              </tr>
            </thead>
            <tbody>
              {currents.map((I) => {
                const sVal = (Math.sqrt(3) * state.voltage * I) / 1000;
                const kwVal = sVal * state.cosphi;
                const kw90  = sVal * 0.90;
                const kw100 = sVal * 1.0;

                return (
                  <tr key={I} className="border-t border-[#1e3248]/10 hover:bg-[#00d4ff]/5 transition-colors">
                    <td className="py-2.5 val-highlight font-medium">{I} A</td>
                    <td className="py-2.5 text-right text-slate-300 font-mono">{sVal.toFixed(1)}</td>
                    <td className="py-2.5 text-right text-[#00d4ff] font-bold font-mono">{kwVal.toFixed(1)}</td>
                    <td className="py-2.5 text-right text-slate-300 font-mono">{kw90.toFixed(1)}</td>
                    <td className="py-2.5 text-right text-slate-300 font-mono">{kw100.toFixed(1)}</td>
                    <td className="py-2.5 text-left text-[11px] text-slate-500 font-mono pl-6">{apps[I] || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
