export const stages = [
  "Đang chăm sóc", "Thông tin đơn hàng", "Tổng hợp giá", "Báo giá", "Đồng ý",
  "Booking", "Lựa chọn đại lý", "Gửi chứng từ", "Khai báo Hải Quan",
  "Điều xe", "Giao hàng", "Thanh toán", "Hoàn thành",
];

export const owners = ["Anh Nguyễn", "Minh Trần", "Hà Phạm", "Linh Võ"];

export type Lead = {
  name: string; company: string; phone: string; source: string; owner: string;
  status: string; last: string; need: string;
};

export type Deal = {
  name: string; detail: string; owner: string; stage: string; value: number;
};

export type Call = {
  time: string; customer: string; phone: string; direction: string; owner: string;
  duration: string; result: string; note: string;
};

export const initialLeads: Lead[] = [
  { name: "Nguyễn Minh Anh", company: "Sakura Trading", phone: "0908 123 456", source: "Tổng đài", owner: "Anh Nguyễn", status: "Báo giá", last: "10:24 hôm nay", need: "Vận chuyển hàng lạnh tuyến Nhật" },
  { name: "Trần Quốc Bảo", company: "Mekong Foods", phone: "0912 345 678", source: "Website", owner: "Minh Trần", status: "Đang chăm sóc", last: "Hôm qua", need: "Giao hàng nội địa" },
  { name: "Lê Thu Hà", company: "Orchid Home", phone: "0987 654 321", source: "Giới thiệu", owner: "Hà Phạm", status: "Đồng ý", last: "09:42 hôm nay", need: "Xuất khẩu đồ gỗ" },
  { name: "Phạm Gia Huy", company: "Blue Ocean Co.", phone: "0934 567 890", source: "Hội chợ", owner: "Linh Võ", status: "Đang chăm sóc", last: "30/09/2026", need: "Vận tải đường biển" },
  { name: "Vũ Thanh Tâm", company: "An Phát Materials", phone: "0903 222 189", source: "Tổng đài", owner: "Anh Nguyễn", status: "Báo giá", last: "08:55 hôm nay", need: "Thông quan hàng hóa" },
  { name: "Đặng Hoàng Yến", company: "Vina Fresh", phone: "0971 345 220", source: "Website", owner: "Minh Trần", status: "Không đáp ứng", last: "01/10/2026", need: "Kho lạnh tại Osaka" },
  { name: "Bùi Đức Long", company: "NovaTech Parts", phone: "0918 111 234", source: "Giới thiệu", owner: "Hà Phạm", status: "Đang chăm sóc", last: "Hôm qua", need: "Linh kiện điện tử đi Mỹ" },
  { name: "Ngô Phương Linh", company: "Green Leaf Export", phone: "0966 555 778", source: "Tổng đài", owner: "Linh Võ", status: "Báo giá", last: "09:10 hôm nay", need: "Xuất khẩu nông sản" },
  { name: "Đỗ Anh Tuấn", company: "Pacific Star", phone: "0909 876 543", source: "Website", owner: "Anh Nguyễn", status: "Đồng ý", last: "29/09/2026", need: "Vận tải đường biển tuyến EU" },
  { name: "Mai Ngọc Diệp", company: "Lotus Ceramics", phone: "0933 765 432", source: "Hội chợ", owner: "Minh Trần", status: "Đang chăm sóc", last: "Hôm qua", need: "Xuất khẩu gốm sứ" },
  { name: "Hoàng Minh Khang", company: "Everwell Pharma", phone: "0982 456 710", source: "Giới thiệu", owner: "Hà Phạm", status: "Báo giá", last: "08:30 hôm nay", need: "Vận chuyển dược phẩm" },
  { name: "Trương Hải Nam", company: "Sunrise Apparel", phone: "0917 888 345", source: "Tổng đài", owner: "Linh Võ", status: "Đang chăm sóc", last: "02/10/2026", need: "Xuất khẩu may mặc" },
];

export const initialDeals: Deal[] = [
  { name: "Sakura Trading", detail: "Hàng lạnh · Nhật Bản", owner: "Anh Nguyễn", stage: "Báo giá", value: 68000000 },
  { name: "Orchid Home", detail: "Đồ gỗ · Hoa Kỳ", owner: "Hà Phạm", stage: "Đồng ý", value: 42500000 },
  { name: "Blue Ocean Co.", detail: "Vận tải biển · Singapore", owner: "Linh Võ", stage: "Booking", value: 89000000 },
  { name: "An Phát Materials", detail: "Thông quan · Hàn Quốc", owner: "Anh Nguyễn", stage: "Thông tin đơn hàng", value: 27500000 },
  { name: "Pacific Star", detail: "Hàng lẻ · Đức", owner: "Anh Nguyễn", stage: "Gửi chứng từ", value: 51200000 },
  { name: "NovaTech Parts", detail: "Linh kiện · Hoa Kỳ", owner: "Hà Phạm", stage: "Khai báo Hải Quan", value: 74000000 },
  { name: "Vina Fresh", detail: "Nông sản · Nhật Bản", owner: "Minh Trần", stage: "Đang chăm sóc", value: 38500000 },
  { name: "Lotus Ceramics", detail: "Gốm sứ · Pháp", owner: "Minh Trần", stage: "Tổng hợp giá", value: 19800000 },
  { name: "Everwell Pharma", detail: "Dược phẩm · Úc", owner: "Hà Phạm", stage: "Điều xe", value: 63200000 },
  { name: "Green Leaf Export", detail: "Nông sản · Hà Lan", owner: "Linh Võ", stage: "Giao hàng", value: 55800000 },
  { name: "Mekong Foods", detail: "Thực phẩm · Nội địa", owner: "Minh Trần", stage: "Đang chăm sóc", value: 31600000 },
  { name: "Sunrise Apparel", detail: "May mặc · Canada", owner: "Linh Võ", stage: "Thanh toán", value: 46800000 },
];

export const initialCalls: Call[] = [
  { time: "10:24", customer: "Sakura Trading", phone: "0908 123 456", direction: "Đi", owner: "Anh Nguyễn", duration: "06:42", result: "Đã kết nối", note: "Trao đổi báo giá tuyến Nhật" },
  { time: "10:02", customer: "Orchid Home", phone: "0987 654 321", direction: "Đến", owner: "Hà Phạm", duration: "03:18", result: "Đã kết nối", note: "Xác nhận chứng từ xuất khẩu" },
  { time: "09:46", customer: "Blue Ocean Co.", phone: "0934 567 890", direction: "Đi", owner: "Linh Võ", duration: "00:00", result: "Không nghe máy", note: "Hẹn gọi lại buổi chiều" },
  { time: "09:32", customer: "An Phát Materials", phone: "0903 222 189", direction: "Đi", owner: "Anh Nguyễn", duration: "08:15", result: "Đã kết nối", note: "Bổ sung thông tin lô hàng" },
  { time: "09:10", customer: "Green Leaf Export", phone: "0966 555 778", direction: "Đến", owner: "Linh Võ", duration: "04:26", result: "Đã kết nối", note: "Hỏi tiến độ báo giá" },
  { time: "08:55", customer: "Everwell Pharma", phone: "0982 456 710", direction: "Đi", owner: "Hà Phạm", duration: "00:00", result: "Gọi lại sau", note: "Khách đang bận" },
];
