/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Module1Results, Module2Results, Module3Results, CableResult } from "./calculator";
import { FullAppState } from "../types";

export function exportToExcel(state: FullAppState, m1: Module1Results, m2: Module2Results, m3: Module3Results, m4: CableResult) {
  // We'll generate a beautiful XML Spreadsheet 2003 because Excel opens it instantly with styled columns, bold titles, and clean formatting.
  const xmlContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:excel"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:纯">
  <Author>NgocHieuPC 0766396699</Author>
  <Title>Báo Cáo Kỹ Thuật Điện và Solar EPC</Title>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1c2541" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SectionHeader">
   <Font ss:FontName="Segoe UI" ss:Size="12" ss:Bold="1" ss:Color="#000000"/>
   <Interior ss:Color="#00f5d4" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="TableLabel">
   <Font ss:FontName="Segoe UI" ss:Bold="1"/>
   <Interior ss:Color="#F2F2F2" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Numeric">
   <Alignment ss:Horizontal="Right"/>
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Font ss:FontName="Segoe UI" ss:Size="18" ss:Bold="1" ss:Color="#1c2541"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Báo Cáo Tổng Hợp">
  <Table ss:ExpandedColumnCount="5" ss:ExpandedRowCount="40" x:FullColumns="1" x:FullRows="1">
   <Column ss:Width="250"/>
   <Column ss:Width="120"/>
   <Column ss:Width="100"/>
   <Column ss:Width="180"/>
   
   <Row ss:Height="30">
    <Cell ss:MergeAcross="3" ss:StyleID="TitleStyle">
     <Data ss:Type="String">BÁO CÁO THIẾT KẾ ĐIỆN VÀ SOLAR ROOFTOP EPC - THỰC TẾ CÔNG TRÌNH</Data>
    </Cell>
   </Row>
   <Row ss:Height="20">
    <Cell><Data ss:Type="String">Kỹ sư thực hiện: NgocHieuPC (Zalo: 0908923886)</Data></Cell>
    <Cell ss:MergeAcross="2"><Data ss:Type="String">Liên hệ: 0766396699</Data></Cell>
   </Row>
   <Row ss:Height="25">
    <Cell ss:MergeAcross="3" ss:StyleID="SectionHeader">
     <Data ss:Type="String">1. THÔNG SỐ ĐIỆN 3 PHA (MODULE 1)</Data>
    </Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Thông số đầu vào / Đo đạc</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Giá trị</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Đơn vị</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Đánh giá kỹ thuật</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Điện áp dây đầu vào (U)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${state.module1.voltage}</Data></Cell>
    <Cell><Data ss:Type="String">V</Data></Cell>
    <Cell><Data ss:Type="String">Chuẩn công nghiệp</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Dòng điện pha R - S - T (Trung bình)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m1.avgCurrent.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">A</Data></Cell>
    <Cell><Data ss:Type="String">Lệch pha R:${state.module1.currentR} S:${state.module1.currentS} T:${state.module1.currentT}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Hệ số công suất đo đạc (Cosphi)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m1.powerFactor}</Data></Cell>
    <Cell><Data ss:Type="String">PF</Data></Cell>
    <Cell><Data ss:Type="String">${m1.powerFactor < 0.9 ? "Cảnh báo phạt tiền Cosphi EVN" : "Đạt tiêu chuẩn"}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Công suất tác dụng thực tế (P)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m1.activePowerKw.toFixed(2)}</Data></Cell>
    <Cell><Data ss:Type="String">kW</Data></Cell>
    <Cell><Data ss:Type="String">Tải thực</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Công suất biểu kiến (S)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m1.apparentPowerKva.toFixed(2)}</Data></Cell>
    <Cell><Data ss:Type="String">kVA</Data></Cell>
    <Cell><Data ss:Type="String">Sức tải trạm biến áp</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Công suất phản kháng (Q)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m1.reactivePowerKvar.toFixed(2)}</Data></Cell>
    <Cell><Data ss:Type="String">kVAr</Data></Cell>
    <Cell><Data ss:Type="String">Dòng phản kháng cần triệt tiêu</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Phần trăm tải Máy biến áp (${state.module1.transformerKva} kVA)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m1.transformerLoadPercent.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">%</Data></Cell>
    <Cell><Data ss:Type="String">${m1.loadText}</Data></Cell>
   </Row>

   <Row ss:Height="15"></Row>

   <Row ss:Height="25">
    <Cell ss:MergeAcross="3" ss:StyleID="SectionHeader">
     <Data ss:Type="String">2. PHÂN TÍCH TỤ BÙ ĐIỆN LỰC COSPHI (MODULE 2)</Data>
    </Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Chỉ số tính kiểm</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Giá trị</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Đơn vị</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Khuyến nghị từ Kỹ sư EPC</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Cosphi hiện trạng / Cosphi mục tiêu</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="String">${state.module2.currentPf} / ${state.module2.targetPf}</Data></Cell>
    <Cell><Data ss:Type="String">PF</Data></Cell>
    <Cell><Data ss:Type="String">Nâng cao hiệu suất tổn hao trạm</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Dung lượng tủ tụ bù tính toán (Qb)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m2.requiredKvar.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">kVAr</Data></Cell>
    <Cell><Data ss:Type="String">Công suất bù chính xác lý thuyết</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Dung lượng thực tế lắp đặt đề xuất</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m2.actualCompKvar}</Data></Cell>
    <Cell><Data ss:Type="String">kVAr</Data></Cell>
    <Cell><Data ss:Type="String">${m2.stepsText}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Hệ số hiệu chỉnh rơ le (C/K ratio)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m2.ckRatio.toFixed(3)}</Data></Cell>
    <Cell><Data ss:Type="String">Value</Data></Cell>
    <Cell><Data ss:Type="String">Cài đặt cho cấu hình rơ le APFC</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Cosphi sau bù (Ước tính thực tế)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m2.compensatedPf.toFixed(3)}</Data></Cell>
    <Cell><Data ss:Type="String">PF</Data></Cell>
    <Cell><Data ss:Type="String">Độ an toàn hệ thống cao</Data></Cell>
   </Row>

   <Row ss:Height="15"></Row>

   <Row ss:Height="25">
    <Cell ss:MergeAcross="3" ss:StyleID="SectionHeader">
     <Data ss:Type="String">3. SOLAR ROOFTOP EPC & ZERO EXPORT POWER (MODULE 3)</Data>
    </Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Thông số kinh tế kĩ thuật Solar</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Giá trị</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Đơn vị</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Nhận định vận hành</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Công suất Solar khuyến nghị tối ưu</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m3.recSolarPowerKwp.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">kWp</Data></Cell>
    <Cell><Data ss:Type="String">Thiết kế tối ưu theo tải tối thiểu</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Công suất Inverter đề xuất</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m3.inverterPowerKw.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">kW AC</Data></Cell>
    <Cell><Data ss:Type="String">Khoảng Oversize an toàn: 115%</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Sản lượng điện phát sinh hàng ngày</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m3.generationDailyKwh.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">kWh/ngày</Data></Cell>
    <Cell><Data ss:Type="String">Tự tiêu thụ nội bộ hoàn toàn</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Sản lượng điện cả năm</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m3.generationYearlyKwh.toFixed(0)}</Data></Cell>
    <Cell><Data ss:Type="String">kWh/năm</Data></Cell>
    <Cell><Data ss:Type="String">Đã trừ 8% hao hụt thời tiết</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Tiền điện tiết kiệm hàng năm</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m3.annualElectricitySavedVnd}</Data></Cell>
    <Cell><Data ss:Type="String">VND</Data></Cell>
    <Cell><Data ss:Type="String">Theo đơn giá: ${state.module3.electricityRateVnd} VND/kWh</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Tổng chi phí đầu tư dự kiến</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m3.capitalCostVnd}</Data></Cell>
    <Cell><Data ss:Type="String">VND</Data></Cell>
    <Cell><Data ss:Type="String">Suất đầu tư: ${state.module3.installationCostPerKwpVnd.toLocaleString()} đ/kWp</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Thời gian thu hồi vốn (ROI)</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m3.paybackPeriodYears.toFixed(2)}</Data></Cell>
    <Cell><Data ss:Type="String">Năm</Data></Cell>
    <Cell><Data ss:Type="String">ROI cực cao cho sản xuất công nghiệp</Data></Cell>
   </Row>

   <Row ss:Height="15"></Row>

   <Row ss:Height="25">
    <Cell ss:MergeAcross="3" ss:StyleID="SectionHeader">
     <Data ss:Type="String">4. TÍNH CHỌN CÁP ĐỒNG/NHÔM & SỤT ÁP (MODULE 4)</Data>
    </Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Chỉ tiêu cáp điện</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Giá trị</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Đơn vị</Data></Cell>
    <Cell ss:StyleID="TableLabel"><Data ss:Type="String">Phân tích kỹ thuật</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Tiết diện tối ưu đề xuất</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="String">${m4.sizeMm2} mm²</Data></Cell>
    <Cell><Data ss:Type="String">mm²</Data></Cell>
    <Cell><Data ss:Type="String">Vật liệu cáp: ${state.module4.cableMaterial.toUpperCase()}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Dòng điện tải thiết kế</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${((state.module4.loadKw * 1000) / (Math.sqrt(3) * state.module4.voltage * state.module4.cosphi)).toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">A</Data></Cell>
    <Cell><Data ss:Type="String">Dựa trên tải ${state.module4.loadKw} kW</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Khả năng tải của cáp đã hiệu chỉnh nhiệt</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m4.ampacityMatched.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="String">A</Data></Cell>
    <Cell><Data ss:Type="String">Tại nhiệt độ ${state.module4.ambientTemp}°C</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Độ sụt áp thực tế</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m4.voltageDropPercent.toFixed(2)}</Data></Cell>
    <Cell><Data ss:Type="String">%</Data></Cell>
    <Cell><Data ss:Type="String">Hạn định tối đa: ${state.module4.allowableDropPercent}%</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Tổn hao công suất trên đường truyền</Data></Cell>
    <Cell ss:StyleID="Numeric"><Data ss:Type="Number">${m4.powerLossKw.toFixed(3)}</Data></Cell>
    <Cell><Data ss:Type="String">kW</Data></Cell>
    <Cell><Data ss:Type="String">Tản nhiệt cáp</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Kết luận kiểm tra</Data></Cell>
    <Cell ss:MergeAcross="1"><Data ss:Type="String">${m4.isPassed ? "ĐẠT YÊU CẦU ĐIỆN LỰC" : "KHÔNG ĐẠT"}</Data></Cell>
    <Cell><Data ss:Type="String">Ký tên: Kỹ sư trưởng NgocHieuPC</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Bao_Cao_Nganh_Dien_Solar_EPC_${new Date().toISOString().split("T")[0]}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
