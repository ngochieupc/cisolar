# Professional Engineering Calculator (Electrical M&E & Solar Rooftop EPC)

Ứng dụng web chuyên nghiệp tính toán thiết kế kỹ thuật, lập khái toán kinh tế, quy hoạch bám tải (Zero Export) và sụt áp cáp nguồn dành cho Kỹ sư Điện & Solar EPC Việt Nam.

Được thiết kế và kiểm định chuyên sâu bởi **NgocHieuPC (0766396699)** và **Zalo: 0908923886**.

---

## 🚀 CHỨC NĂNG CHÍNH (KEY FEATURES)

### 1. Module 1: Tính Công Suất Điện 3 Pha & Trạm Biến Áp
* **Input**: Điện áp mạng 3 pha (380V, 400V, 415V), dòng điện các pha R/S/T, Cosφ thực tế và kWh tiêu thụ định mức.
* **Đầu ra**: 
  * Dòng điện trung bình $I_{avg}$ cân pha R, S, T.
  * Phân tích đầy đủ công suất tác dụng $P(kW)$, công suất phản kháng $Q(kVAr)$, công suất biểu kiến $S(kVA)$ tại máy biến áp tham chiếu.
  * Bản đồ tải trạm biến áp (%) thời gian thực kèm cảnh báo đỏ/vàng/xanh bảo vệ trạm.
  * Bảng tra nhanh dòng cực đại MCCB tiêu chuẩn từ 100A đến 1600A sang kW/kVA thực tế.

### 2. Module 2: Tính Toán Tụ Bù Cosφ & Hiệu Chỉnh C/K Relay
* **Input**: Công suất tải thực tế $P(kW)$, hệ số Cosφ đo đạc hiện trạng và Cosφ mục tiêu khao khát (thường là 0.95).
* **Đầu ra**:
  * Tổng dung lượng tụ bù cần thiết $Q_b$ để triệt tiêu năng lượng phản kháng sinh nhiệt đường dây.
  * Công thức tính chọn nhanh C/K ($C/K = I_{c1} / \text{CT\_Ratio}$) giúp kỹ sư cài đặt trực tiếp lên Rơ le điều khiển tự động (Mikro, Selec, Ducati).
  * Đề xuất số bước cấp tụ chuẩn công nghiệp (VD: 6 cấp rơ le × 25kVAr).
  * Cảnh báo bù dư (Bù Capacitive) nguy hại cho hệ lưới điện áp cao.

### 3. Module 3: Sizing Hệ Mặt Trời Bám Tải (Solar Zero Export & ROI)
* **Input**: Tải ban ngày trung bình, tải ban ngày cực tiểu, diện tích mái khả dụng, loại vật liệu mái che phủ, đơn giá điện trần của EVN và suất chi phí lắp đặt EPC trung bình.
* **Đầu ra**:
  * Công suất Solar lắp đặt khuyến nghị tối ưu (DC / kWp) tránh hao hụt bấm bớt (clipping/curtailment loss) trong cơ chế Zero Export.
  * Đề xuất Inverter với hệ số quá tải AC/DC chuẩn 115%.
  * Ước tính sản lượng ngày/năm đã trừ 8% khấu hao tản nhiệt.
  * Khái toán chi tiết vốn đầu tư, dòng tiền cứu cánh hàng năm, thời gian hoàn vốn (ROI Years) thực tế.
  * Cảnh báo giảm hệ số Cosφ lưới sau khi lắp Solar.

### 4. Module 4: Tính Dây Cáp & Độ Sụt Áp IEC
* **Input**: Chiều dài tuyến cáp nguồn lồng đất hay trên khay, dòng điện danh định hoặc công suất tải thiết kế, loại dây cáp (Đồng XLPE hoặc Nhôm XLPE), cách đi dây và nhiệt độ môi trường hiệu chỉnh.
* **Đầu ra**:
  * Tiết diện cáp đề xuất tối ưu qua chuỗi vòng lặp kiểm tra Ampacity & sụt áp giới hạn cho phép.
  * % sụt áp thực tế ($\% \Delta U$).
  * Tổn thất điện năng sinh rát phát nhiệt ($P_{loss}$ kW) dọc đường cáp dẫn.

### 5. Module 5: SCADA Control Dashboard
* Tổng hợp các đồng hồ đo đạc thời gian thực, bảng biểu phân tích kĩ thuật so sánh biểu đồ nắp chuông công suất Solar, độ lồng ghép tải 24h và hệ số cosphi trước và sau khi bù.

---

## 📂 CẤU TRÚC THƯ MỤC CHUẨN (FOLDER STRUCTURE)

```bash
├── package.json               # Quản lý thư viện cài đặt (React v19, Tailwind v4, Chart.js)
├── vite.config.ts             # Cấu hình tối ưu nén tài nguyên của trình biên dịch Vite
├── metadata.json              # Khai định tên và quyền truy cập Web Applet
├── index.html                 # Điểm tải khung HTML5
├── src/
│   ├── main.tsx               # Entrypoint kích hoạt React DOM
│   ├── App.tsx                # Giao diện chính Scada Web App, quản lý tabs và điều khiển nhập liệu
│   ├── index.css              # File định dạng CSS nạp font Google Fonts và custom thiết bị in
│   ├── types.ts               # Định nghĩa kiểu dữ liệu TypeScript & Bảng thông số thuộc tính cáp điện
│   └── utils/
│       ├── calculator.ts      # Toàn bộ lõi thuật toán kỹ thuật điện, ROI Solar, vật lý sụt áp cáp
│       └── exporter.ts        # Script sinh file Excel XML và định dạng in ấn chuyên sâu
```

---

## 🛠️ HƯỚNG DẪN CHẠY LOCAL (LOCAL DEVELOPMENT)

### Yêu cầu tiên quyết:
* Máy tính đã cài đặt **Node.js** (Phiên bản v18 trở lên).

### Bước 1: Tải dependencies
Mở folder dự án trong Terminal và chạy lệnh:
```bash
npm install
```

### Bước 2: Chạy dev server localhost
```bash
npm run dev
```
Trình duyệt sẽ mở cổng chạy local tại: `http://localhost:3000`

### Bước 3: Build nén sản phẩm đóng gói
```bash
npm run build
```
Sản phẩm build tĩnh ra folder `/dist` sẵn sàng đưa lên Web Server chứa Apache hoặc Nginx.

---

## ☁️ HƯỚNG DẪN DEPLOY TRÊN VERCEL / CLOUD RUN

### Phương án 1: Deploy lên Vercel (Khuyên dùng - Nhanh gọn 1 click)
1. Đẩy mã nguồn lên một tài khoản **GitHub**.
2. Truy cập [Vercel](https://vercel.com) và chọn **Add New Project**.
3. Import repository GitHub vừa đẩy lên.
4. Chọn Framework Preset là **Vite** (hoặc cấu hình mặc định).
5. Nhấp nút **Deploy**. Link ứng dụng sẽ trực tuyến trong chưa đầy 30 giây!

---

## 📞 LIÊN HỆ HỖ TRỢ KỸ THUẬT & EPC TOÀN QUỐC
* **Đại diện Kỹ thuật**: NgocHieuPC 
* **Điện thoại**: 0766 396 699
* **Zalo kỹ thuật di động**: 0908 923 886
* *Vận hành bởi hệ quản trị Scada EPC chuyên sâu - Đạt chứng nhận chuẩn lưới quốc gia Việt Nam.*
