import React from "react";
import { Info, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export const QuickRefPanel: React.FC = () => {
  const currentFaq = [
    { amp: 25, kw: 14, kva: 16, app: "Động cơ gia công cơ khí nhỏ, chiếu sáng" },
    { amp: 50, kw: 28, kva: 33, app: "Bơm thoát nước hầm, quạt hút trần" },
    { amp: 100, kw: 56, kva: 66, app: "Hộ phân phối rẽ nhánh chính tầng nhà máy" },
    { amp: 160, kw: 90, kva: 105, app: "Tổ hợp Motor dập 55kW khởi động trực tiếp" },
    { amp: 250, kw: 140, kva: 165, app: "Mạch tủ phân phối chính xưởng Dệt xơ sợi" },
    { amp: 400, kw: 224, kva: 263, app: "Cáp tổng Busbar xuất sụt máy biến áp lớn" },
    { amp: 630, kw: 353, kva: 415, app: "Nhánh phân phối trung tâm tủ MSB 500kVA" },
    { amp: 800, kw: 448, kva: 527, app: "Tủ tổng hạ áp cho trạm biến áp sụt 500kVA" },
    { amp: 1000, kw: 560, kva: 658, app: "Tủ tổng hạ áp cho trạm biến áp sụt 630kVA" },
    { amp: 1250, kw: 700, kva: 823, app: "Tủ tổng hạ áp cho trạm biến áp sụt 1000kVA" },
    { amp: 1600, kw: 896, kva: 1053, app: "Tủ tổng hạ áp dòng cực đại cho trạm 1250kVA" }
  ];

  const cableFaq = [
    { size: 4, amp: 36, kw: 20, app: "Mạch phụ tải nhỏ < 3.7 kW" },
    { size: 6, amp: 46, kw: 26, app: "Phụ tải cơ khí nhánh hoặc Motor bơm ly tâm" },
    { size: 10, amp: 63, kw: 35, app: "Cấp tải nhánh xưởng động lực dệt may" },
    { size: 16, amp: 85, kw: 48, app: "Phù hợp Motor mồi dập xấp xỉ 15-18.5kW" },
    { size: 25, amp: 112, kw: 63, app: "Cáp dải động lực cho Motor máy trục nâng 22kW" },
    { size: 35, amp: 138, kw: 77, app: "Tải truyền động nén thủy lực, máy uốn thép" },
    { size: 50, amp: 168, kw: 94, app: "Mạch dầm trục cầu trục nhà máy đóng tàu" },
    { size: 70, amp: 213, kw: 119, app: "Tủ phụ trung tâm tầng phân khu xưởng ép nhựa" },
    { size: 95, amp: 258, kw: 144, app: "Cáp tổng dẫn hạ thế Busway chính phân khu" },
    { size: 120, amp: 299, kw: 167, app: "Xuống nguồn Busbar trạm phân phối 630kVA" },
    { size: 150, amp: 344, kw: 193, app: "Cáp dẫn trục chính máy phát điện dự phòng lớn" }
  ];

  return (
    <div className="space-y-6">
      <div className="section-header pb-4 border-b border-[#1e3248]/30">
        <h2 className="section-title text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-450 text-[#00d4ff]" />
          <span>Bảng Tham Chiếu Kỹ Thuật Công Nghiệp Việt Nam / IEC</span>
        </h2>
        <p className="section-subtitle text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono animate-none">
          TRA CỨU DIỆN NHANH QUY THUỐC ĐIỆN LỰC VÀ THÔNG SỐ EXCEL SOLAR EPC
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TAB 1: Amps conversion */}
        <div className="card space-y-4">
          <div className="card-title text-slate-350 font-semibold tracking-wider uppercase text-sm border-b border-[#1e3248]/20 pb-2">
            <span>⚡ Quy đổi Ampere → Công suất hoạt động (380V · Cosφ=0.85)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="py-2 text-left text-[11px] font-mono font-semibold">MCCB Hạn định</th>
                  <th className="py-2 text-right text-[11px] font-mono font-semibold">Tải kVA</th>
                  <th className="py-2 text-right text-[11px] font-mono font-semibold text-[#00d4ff]">kW hữu hiệu</th>
                  <th className="py-2 text-left text-[11px] font-semibold pl-4">Thiết kế dải ứng dụng</th>
                </tr>
              </thead>
              <tbody>
                {currentFaq.map((item) => (
                  <tr key={item.amp} className="border-t border-[#1e3248]/10 hover:bg-[#00d4ff]/5 transition-colors">
                    <td className="py-2 val-highlight font-medium font-mono">{item.amp} A</td>
                    <td className="py-2 text-right text-slate-355 font-mono">{item.kva} kVA</td>
                    <td className="py-2 text-right text-[#00d4ff] font-bold font-mono">{item.kw} kW</td>
                    <td className="py-2 text-left text-xs text-slate-450 pl-4">{item.app}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TAB 2: Typical copper cables */}
        <div className="card space-y-4">
          <div className="card-title text-slate-350 font-semibold tracking-wider uppercase text-sm border-b border-[#1e3248]/20 pb-2">
            <span>🔌 Khả năng chịu nhiệt cáp Đồng khay máng cáp (3P · Cu XLPE)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="py-2 text-left text-[11px] font-mono font-semibold">Tiết diện lõi</th>
                  <th className="py-2 text-right text-[11px] font-mono font-semibold text-[#00ff88]">Ampacity</th>
                  <th className="py-2 text-right text-[11px] font-mono font-semibold">Hạn chịu ~kW</th>
                  <th className="py-2 text-left text-[11px] font-semibold pl-4">Ghép nối tải đích</th>
                </tr>
              </thead>
              <tbody>
                {cableFaq.map((item) => (
                  <tr key={item.size} className="border-t border-[#1e3248]/10 hover:bg-[#00d4ff]/5 transition-colors">
                    <td className="py-2 val-highlight font-medium font-mono">{item.size} mm²</td>
                    <td className="py-2 text-right text-[#00ff88] font-bold font-mono">{item.amp} A</td>
                    <td className="py-2 text-right text-slate-355 font-mono">{item.kw} kW</td>
                    <td className="py-2 text-left text-xs text-slate-450 pl-4">{item.app}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TAB 3: Solar standard references */}
        <div className="card space-y-4">
          <div className="card-title text-slate-350 font-semibold tracking-wider uppercase text-sm border-b border-[#1e3248]/20 pb-2">
            <span>☀️ Quy chuẩn chỉ số thiết kế Solar Rooftop Việt Nam</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="py-2 text-left text-[11px] font-mono font-semibold">Thông số chỉ tiêu</th>
                  <th className="py-2 text-right text-[11px] font-mono font-semibold text-amber-500">Quy chiếu chuẩn</th>
                  <th className="py-2 text-left text-[11px] font-semibold pl-4">Ghi chú kỹ thuật</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">PSH nắng đỉnh Miền Bắc</td>
                  <td className="py-2 text-right text-amber-500 font-mono font-bold">3.5 – 4.5 h/ngày</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Hà Nội tích hợp bức xạ xấp xỉ 4.0h nắng</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">PSH nắng đỉnh Miền Nam</td>
                  <td className="py-2 text-right text-amber-500 font-mono font-bold">4.5 – 5.5 h/ngày</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">HCM tích hợp bức xạ xấp xỉ 5.0h cực đỉnh</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">Diện tích chiếm dụng 1 kWp</td>
                  <td className="py-2 text-right text-amber-500 font-mono font-bold">~ 4.8 – 5.2 m²</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Sử dụng kích cỡ tấm tiêu chuẩn công nghiệp</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">Hệ số hiệu suất toàn hệ (PR)</td>
                  <td className="py-2 text-right text-amber-500 font-mono font-bold">75% – 82%</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Khấu trừ hao tản nhiệt, bụi phủ vỏ pin, truyền dẫn</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">Nhiệt độ suy hao đỉnh cell</td>
                  <td className="py-2 text-right text-amber-500 font-mono font-bold">-0.34% / °C</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Tổn thất tuyến tính khi nhiệt độ bề mặt vượt 25°C</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">Tỷ số DC/AC tối ưu</td>
                  <td className="py-2 text-right text-amber-500 font-mono font-bold">1.05 – 1.15</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Oversize an toàn, tăng sản sinh vùng bức xạ yếu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TAB 4: General Grid constraints TCVN */}
        <div className="card space-y-4">
          <div className="card-title text-slate-350 font-semibold tracking-wider uppercase text-sm border-b border-[#1e3248]/20 pb-2">
            <span>📏 Chỉ tiêu điện áp & Hệ số vận hành trạm (TCVN/IEC)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="py-2 text-left text-[11px] font-mono font-semibold">Quy chuẩn hạn mục</th>
                  <th className="py-2 text-right text-[11px] font-mono font-semibold text-[#00d4ff]">Giá trị khống định</th>
                  <th className="py-2 text-left text-[11px] font-semibold pl-4">Chế tài / Phạt phạt hụt</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">Cosφ tối thiểu lưới EVN</td>
                  <td className="py-2 text-right text-[#00d4ff] font-mono font-bold">≥ 0.90</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Dưới 0.85 bị phạt hằng tháng từ 3% đến trên 10% tiền điện</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">Sự sụt áp nguồn lực tải (IEC)</td>
                  <td className="py-2 text-right text-[#00d4ff] font-mono font-bold">≤ 5.0 %</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Áp dụng từ máy biến áp trạm đến thiết bị động lực cuối cùng</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">Độ sụt áp động cơ chính</td>
                  <td className="py-2 text-right text-[#00d4ff] font-mono font-bold">≤ 3.0 %</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Đề xuất kỹ kỹ thuật thực tế cho mạng dây quấn cáp chính</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">Cân pha an toàn</td>
                  <td className="py-2 text-right text-[#00d4ff] font-mono font-bold">≤ 15 %</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Chênh lệch pha cực đại trên trung bình của dòng 3 pha</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-2 font-mono text-slate-300">Hệ số tải máy biến áp an toàn</td>
                  <td className="py-2 text-right text-[#00d4ff] font-mono font-bold">70% – 80%</td>
                  <td className="py-2 text-left text-xs text-slate-450 pl-4">Khai thác tối ưu, giảm dãn hao phát nhiệt, dự phòng rủi ro dồn dòng</td>
                </tr>
                <tr className="border-t border-[#1e3248]/10">
                  <td className="py-1.5 font-mono text-slate-300">Hệ số mật độ dòng Đồng (J)</td>
                  <td className="py-1.5 text-right text-[#00d4ff] font-mono font-bold">2.5 – 3.5 A/mm²</td>
                  <td className="py-1.5 text-left text-xs text-slate-450 pl-4">Đối với dây cáp chạy khay máng an toàn dài hạn</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER TIP */}
      <div className="alert alert-cyan flex items-start gap-2.5 p-3 rounded bg-blue-950/20 border-cyan-800/10">
        <Lightbulb className="w-5 h-5 text-[#00d4ff] shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-300">
          <span className="font-bold text-[#00d4ff] block mb-0.5">Lời Khuyên Của Kỹ Sư Công Trình:</span>
          Hệ số thiết kế thực tế luôn cần dự phòng từ 15% - 25% công suất phụ tải tương lai của nhà xưởng. Trục cáp nguồn lực dài hạn (L &gt; 150m) luôn lấy sụt áp chỉ tiêu sấp sỉ 2.5% thay vì kịch trần 5.0% TCVN để bảo hộ ổn định động cơ!
        </div>
      </div>
    </div>
  );
};
