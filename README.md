# Northstar Logistics CRM demo

Prototype CRM được xây dựng bằng Next.js App Router, React và TypeScript. Dữ liệu hiện là mock trong bộ nhớ trình duyệt; tải lại trang sẽ khôi phục dữ liệu ban đầu.

## Chạy ứng dụng

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Tạo bản production bằng `npm run build` và chạy bằng `npm start`.

## Các màn hình

- Tổng quan: KPI chính, pipeline, hoạt động mới và khách hàng cần follow-up.
- Khách hàng: tìm kiếm, lọc theo sales/giai đoạn, xem hồ sơ và tạo lead.
- Pipeline: lọc theo sales, tạo cơ hội, tiến/lùi giai đoạn; từ chối báo giá quay lại chăm sóc.
- Báo cáo: lọc kỳ ngày/tuần/tháng, đội ngũ và xem số liệu mẫu theo nhân viên.
- Cuộc gọi: lọc lịch sử, ghi nhận cuộc gọi và mô phỏng đồng bộ từ tổng đài.
- Tích hợp API: cấu hình mẫu endpoint/webhook và payload minh họa.

`index.html` là bản prototype tĩnh ban đầu được giữ lại để đối chiếu; Next.js app nằm trong `app/`, thành phần React trong `components/`, dữ liệu mock trong `lib/`.
