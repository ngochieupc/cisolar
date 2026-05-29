import React, { useEffect } from "react";
import { Layers, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Module4State, CABLE_TABLE } from "../types";
import { calculateCable } from "../utils/calculator";

interface Module4PanelProps {
  state: Module4State;
  onChange: (fields: Partial<Module4State>) => void;
}

export const Module4Panel: React.FC<Module4PanelProps> = ({ state, onChange }) => {
  const result = calculateCable(state);

  // Auto calculate current placeholder when load changes
  const computedI = (state.loadKw * 1000) / (Math.sqrt(3) * state.voltage * state.cosphi);

  const handleReset = () => {
    onChange({
      loadKw: 150,
      currentA: 0, // leave at 0 or empty for auto-calculations
      cableLength: 120,
      cableMaterial: "copper",
      installationMethod: "tray",
      ambientTemp: 35,
      allowableDropPercent: 3.0,
      cosphi: 0.85,
      voltage: 380
    });
  };

  // Standard Cu sizes list for table
  const stdCableSizes = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400];
  const typicalApplications: { [key: number]: string } = {
    1.5: "Mạch đèn chiếu sáng, công tắc điều khiển",
    2.5: "Ổ cắm điện văn phòng, động cơ quạt gió",
    4: "Điều hòa không khí cục bộ, bơm nước nhỏ",
    6: "Máy lạnh trạm, bếp từ công nghiệp 5kW",
    10: "Thang nâng dầm trục, máy cắt xưởng cơ khí cơ",
    16: "Cáp tủ nhánh tầng xưởng May, tủ điều phối DB",
    25: "Cáp nguồn cho Motor 18.5kW chính",
    35: "Cáp nguồn cho Motor trung tâm lớn 30kW",
    50: "Cấp nguồn dây chuyền lắp ráp phụ trợ",
    70: "Cấp tải máy ép phôi thép, máy nén thủy lực",
    95: "Cấp nguồn từ trạm MSB sang tủ nhánh động lực",
    120: "Cáp tổng cấp nguồn trục máy công xưởng lớn",
    150: "Tuyến cáp hạ thế thứ cấp Busbar",
    185: "Busway hoặc trục cáp dải lớn MSB trạm",
    240: "Nhánh cáp xuất sụt từ Máy phát điện dự phòng",
    300: "Cáp chính hạ thế thứ cấp MBA trạm 500kVA",
    400: "Cáp chính dải cực đại hạ thế cho trạm 1000kVA"
  };

  return (
    <div className="space-y-6">
      <div className="section-header pb-4 border-b border-[#1e3248]/30">
        <h2 className="section-title text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-450 text-[#00d4ff]" />
          <span>Module 4 — Tính Chọn Dây Cáp & Độ Sụt Áp IEC</span>
        </h2>
        <p className="section-subtitle text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
          VÒNG LẶP AMPACITY TỰ ĐỘNG · BÙ HAO HỤT THIÊN NHIỆT · CHUẨN IEC 60364-5-52
        </p>
        <div className="formula-badge mt-3 inline-flex bg-slate-900 border border-slate-800 text-[#00d4ff] text-xs font-mono py-1 px-3 rounded-full">
          ΔU = (√3 × I × L × (R·cosφ + X·sinφ)) / 1000 &nbsp;|&nbsp; S = I / J &nbsp;|&nbsp; I_load = P / (√3 × U × Cosφ)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT GRID CARD */}
        <div className="lg:col-span-5 card space-y-4">
          <div className="card-title text-sm font-semibold tracking-wider text-slate-400 uppercase">
            <span>📥 Thông Số Thiết Kế Tuyến Cáp</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="input-group col-span-1">
                <label className="input-label text-[11px] font-mono text-slate-400 mb-1 block">Tải Thiết Kế (P)</label>
                <input
                  type="number"
                  className="inp"
                  value={state.loadKw}
                  min="0"
                  onChange={(e) => onChange({ loadKw: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="input-group col-span-1">
                <label className="input-label text-[11px] font-mono text-slate-400 mb-1 block">Điện Áp Cáp (U)</label>
                <select
                  className="inp text-xs"
                  value={state.voltage}
                  onChange={(e) => onChange({ voltage: parseInt(e.target.value) })}
                >
                  <option value="380">380 V (3 Pha)</option>
                  <option value="400">400 V (3 Pha)</option>
                  <option value="415">415 V (3 Pha)</option>
                  <option value="220">220 V (1 Pha)</option>
                </select>
              </div>

              <div className="input-group col-span-1">
                <label className="input-label text-[11px] font-mono text-slate-400 mb-1 block">Cosφ Tuyến</label>
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
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="input-group">
                <label className="input-label text-[11px] font-mono text-slate-400 mb-1 block">
                  Dòng Hiện Thực I
                </label>
                <input
                  type="number"
                  className="inp text-xs"
                  value={state.currentA || ""}
                  placeholder={`${computedI.toFixed(0)} A (Auto)`}
                  onChange={(e) => onChange({ currentA: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="input-group">
                <label className="input-label text-[11px] font-mono text-slate-400 mb-1 block">
                  Chiều Dài L (m)
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.cableLength}
                  min="1"
                  onChange={(e) => onChange({ cableLength: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="input-group">
                <label className="input-label text-[11px] font-mono text-slate-400 mb-1 block">
                  Nhiệt độ phòng (°C)
                </label>
                <input
                  type="number"
                  className="inp"
                  value={state.ambientTemp}
                  min="10"
                  max="60"
                  onChange={(e) => onChange({ ambientTemp: parseFloat(e.target.value) || 30 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="input-group">
                <label className="input-label text-[11px] font-mono text-slate-400 mb-1 block">Hợp Kim Lõi</label>
                <select
                  className="inp text-xs"
                  value={state.cableMaterial}
                  onChange={(e) => onChange({ cableMaterial: e.target.value as "copper" | "aluminum" })}
                >
                  <option value="copper">Cáp Đồng (Cu)</option>
                  <option value="aluminum">Cáp Nhôm (Al)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label text-[11px] font-mono text-slate-400 mb-1 block">Đường Đi Cáp</label>
                <select
                  className="inp text-xs animate-none"
                  value={state.installationMethod}
                  onChange={(e) => onChange({ installationMethod: e.target.value as "conduit" | "tray" | "underground" })}
                >
                  <option value="tray">Máng Cáp Khô / Tray</option>
                  <option value="conduit">Ống Luồn Cáp / Conduit</option>
                  <option value="underground">Chôn Đất Trực Tiếp</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label text-[11px] font-mono text-slate-400 mb-1 block">Sụt Áp Hạn Định %</label>
                <input
                  type="number"
                  className="inp"
                  value={state.allowableDropPercent}
                  min="1"
                  max="10"
                  step="0.5"
                  onChange={(e) => onChange({ allowableDropPercent: parseFloat(e.target.value) || 3.0 })}
                />
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

        {/* COMPUTED RESULT COMPLEX DISPLAY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="kpi-card cyan">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Tiết diện lý thuyết tối thiểu</div>
              <div className="kpi-value cyan text-2xl font-bold font-display mt-1">
                {(state.currentA > 0 ? state.currentA / 3.0 : computedI / 3.0).toFixed(1)} <span className="text-sm font-normal">mm²</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">J mật độ lý lý chuẩn 3A/mm²</div>
            </div>

            <div className="kpi-card green">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Cỡ cáp quy chuẩn chọn lọc</div>
              <div className="kpi-value green text-2xl font-bold font-display mt-1">
                {result.sizeMm2} <span className="text-sm font-normal">mm²</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">Tiêu chuẩn IEC 60228 chuẩn hóa</div>
            </div>

            <div className="kpi-card amber">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Sụt Áp Trên Tuyến ΔU</div>
              <div className="kpi-value amber text-2xl font-bold font-display mt-1">
                {result.voltageDropPercent.toFixed(2)} <span className="text-sm font-normal">%</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">Chi tiết sụt: {result.voltageDropVolts.toFixed(1)} Volt</div>
            </div>

            <div className="kpi-card purple">
              <div className="kpi-label text-[10px] uppercase tracking-wider font-mono">Tổn Hao Kỹ Thuật</div>
              <div className="kpi-value purple text-2xl font-bold font-display mt-1">
                {result.powerLossKw.toFixed(2)} <span className="text-sm font-normal">kW</span>
              </div>
              <div className="kpi-sub mt-1 text-slate-400">Tản nhiệt nóng hao dọc tuyến dây</div>
            </div>
          </div>

          <div className="card space-y-3">
            <h3 className="card-title text-xs tracking-wider uppercase text-slate-400 flex justify-between items-center">
              <span>📊 ĐÁNH GIÁ SỨC CHỊU TẢI & SỤT ÁP</span>
              <span className={`status-badge text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${result.isPassed ? "status-ok" : "status-err"}`}>
                <span className="status-dot2" />
                {result.isPassed ? "ĐẠT TIÊU CHUẨN" : "KHÔNG ĐẠT TIÊU CHUẨN"}
              </span>
            </h3>

            <p className="text-xs text-slate-350 leading-relaxed font-mono">
              {result.recommendationText}
            </p>

            <div className="pt-2">
              <div className="text-xs flex justify-between py-1 border-b border-[#1e3248]/10">
                <span className="text-slate-400 font-mono">Khả năng mang dòng tối đa loại dây (Ampacity):</span>
                <span className="text-[#00d4ff] font-bold font-mono">{result.ampacityMatched.toFixed(0)} Ampere</span>
              </div>
              <div className="text-xs flex justify-between py-1">
                <span className="text-slate-400 font-mono">Điện trở sụt dây quấn ở {state.ambientTemp}°C:</span>
                <span className="text-slate-200 font-mono">{result.resistanceOhmKm.toFixed(4)} Ω / km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CABLE STANDARDS REFERENCE TABLE */}
      <div className="divider" />
      <div className="card space-y-4">
        <div className="card-title text-sm tracking-wider uppercase text-slate-400 flex justify-between items-center">
          <span>📋 Bảng tra cứu thông số cáp Đồng (Cu)/Nhôm (Al) XLPE tiêu chuẩn công nghiệp IEC 60502</span>
          <span className="text-xs text-[#00d4ff] font-mono">Kỳ vọng sụt tối đa: {state.allowableDropPercent}%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="font-mono text-left py-2 font-semibold">Quy cách lõi (mm²)</th>
                <th className="font-mono text-right py-2 font-semibold">Ampacity Đồng (A)</th>
                <th className="font-mono text-right py-2 font-semibold">Ampacity Nhôm (A)</th>
                <th className="font-mono text-right py-2 font-semibold text-[#00d4ff]">kW Max 380V (Cosφ=0.85 Đồng)</th>
                <th className="font-mono text-right py-2 font-semibold">Điện trở Đồng (Ω/km)</th>
                <th className="font-mono text-left py-2 pl-6 font-semibold">Ứng dụng thiết kế thực tế</th>
              </tr>
            </thead>
            <tbody>
              {stdCableSizes.filter(s => s >= 2.5).map((size) => {
                const matchTable = CABLE_TABLE.find(c => c.size === size);
                const ampCu = matchTable?.ampacityCu || 0;
                const ampAl = matchTable?.ampacityAl || 0;
                
                // Max capacity under 380V pf=0.85 for Cu standard
                const kwMax = (Math.sqrt(3) * 380 * ampCu * 0.85) / 1000;

                return (
                  <tr key={size} className="border-t border-[#1e3248]/10 hover:bg-[#00d4ff]/5 transition-colors">
                    <td className="py-2.5 val-highlight font-medium">{size} mm²</td>
                    <td className="py-2.5 text-right font-mono text-[#00ff88]">{ampCu || "—"} A</td>
                    <td className="py-2.5 text-right font-mono text-amber-500">{ampAl || "—"} A</td>
                    <td className="py-2.5 text-right font-mono text-[#00d4ff] font-bold">{kwMax > 0 ? kwMax.toFixed(0) : "—"} kW</td>
                    <td className="py-2.5 text-right font-mono text-slate-350">{matchTable?.rCu || "—"}</td>
                    <td className="py-2.5 text-left text-[11px] text-slate-500 font-mono pl-6">{typicalApplications[size] || ""}</td>
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
