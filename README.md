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
- Import lead: chọn tệp CSV có các cột `name`, `company`, `phone`; tùy chọn `source`, `owner`, `need`. Dòng hợp lệ được tạo thành lead và cơ hội ở bước chăm sóc. `owner` cần trùng một tên sales trong mock data.
- Tiến độ đơn hàng: kéo thả thẻ giữa các cột hoặc dùng nút mũi tên. Từ chối báo giá đưa cơ hội về chăm sóc và lưu dấu “Báo giá chưa được đồng ý”. Hai bước gửi chứng từ được phân biệt là sau booking và sau khai báo hải quan.
- Báo cáo: lọc kỳ hôm nay/tuần/tháng, đội ngũ hoặc một nhân viên; hiển thị số cuộc gọi, thời lượng, lead, đơn hoàn tất, yêu cầu chưa đáp ứng, thời gian phản hồi và tỷ lệ trả lời tin nhắn trong 15 phút.
- Cuộc gọi: lọc lịch sử, ghi nhận cuộc gọi và mô phỏng đồng bộ từ tổng đài.
- Tích hợp API: cấu hình mẫu endpoint/webhook và payload minh họa.

Giao diện dùng MoMo Trust Sans variable font từ package `@fontsource-variable/momo-trust-sans` (SIL Open Font License). Next.js app nằm trong `app/`, thành phần React trong `components/`, dữ liệu mock trong `lib/`.
