export const stages = [
  { id: "care", title: "Chăm sóc khách hàng", description: "Tạo lead mới hoặc chăm sóc lại khi khách chưa đồng ý báo giá." },
  { id: "order-info", title: "Thông tin đơn hàng", description: "Tiếp nhận tuyến, loại hàng và yêu cầu dịch vụ." },
  { id: "pricing", title: "Tổng hợp giá", description: "Tổng hợp chi phí từ các bên liên quan." },
  { id: "quotation", title: "Gửi báo giá", description: "Gửi phương án giá để khách hàng xem xét." },
  { id: "accepted", title: "Khách hàng đồng ý", description: "Xác nhận báo giá và chuyển sang booking." },
  { id: "booking", title: "Đặt booking", description: "Đặt chỗ vận chuyển theo phương án đã duyệt." },
  { id: "agent-selection", title: "Chọn đại lý", description: "Lựa chọn đại lý xử lý lô hàng." },
  { id: "booking-docs", title: "Gửi chứng từ · booking", description: "Bộ chứng từ sau khi chọn đại lý." },
  { id: "customs", title: "Khai báo hải quan", description: "Thực hiện khai báo hải quan cho lô hàng." },
  { id: "customs-docs", title: "Gửi chứng từ · hải quan", description: "Bộ chứng từ sau khi hoàn tất khai báo." },
  { id: "transport", title: "Điều phối xe", description: "Sắp xếp phương tiện nhận và giao hàng." },
  { id: "delivery", title: "Giao hàng", description: "Theo dõi lô hàng đến điểm giao." },
  { id: "payment", title: "Thanh toán", description: "Đối soát và thu thanh toán đơn hàng." },
  { id: "completed", title: "Hoàn tất", description: "Đơn đã giao và hoàn tất thanh toán." },
];

export const teams: Record<string, string> = {
  "Anh Nguyễn": "Team xuất khẩu",
  "Minh Trần": "Team nội địa",
  "Hà Phạm": "Team xuất khẩu",
  "Linh Võ": "Team xuất khẩu",
};

export type SalesStats = {
  calls: number; callMinutes: number; leads: number; completedOrders: number;
  unmetRequests: number; responseMinutes: number; messageResponseRate: number; answerRate: number;
};

export const reportData: Record<string, Record<string, SalesStats>> = {
  "Hôm nay": {
    "Anh Nguyễn": { calls: 20, callMinutes: 93, leads: 3, completedOrders: 1, unmetRequests: 1, responseMinutes: 8, messageResponseRate: 96, answerRate: 76 },
    "Minh Trần": { calls: 18, callMinutes: 78, leads: 2, completedOrders: 1, unmetRequests: 1, responseMinutes: 12, messageResponseRate: 91, answerRate: 70 },
    "Hà Phạm": { calls: 16, callMinutes: 72, leads: 2, completedOrders: 1, unmetRequests: 0, responseMinutes: 10, messageResponseRate: 95, answerRate: 74 },
    "Linh Võ": { calls: 14, callMinutes: 64, leads: 1, completedOrders: 0, unmetRequests: 1, responseMinutes: 16, messageResponseRate: 88, answerRate: 71 },
  },
  "Tuần này": {
    "Anh Nguyễn": { calls: 52, callMinutes: 440, leads: 5, completedOrders: 4, unmetRequests: 2, responseMinutes: 10, messageResponseRate: 95, answerRate: 76 },
    "Minh Trần": { calls: 44, callMinutes: 390, leads: 4, completedOrders: 3, unmetRequests: 2, responseMinutes: 13, messageResponseRate: 90, answerRate: 70 },
    "Hà Phạm": { calls: 38, callMinutes: 360, leads: 3, completedOrders: 2, unmetRequests: 1, responseMinutes: 12, messageResponseRate: 94, answerRate: 74 },
    "Linh Võ": { calls: 36, callMinutes: 330, leads: 3, completedOrders: 1, unmetRequests: 1, responseMinutes: 14, messageResponseRate: 89, answerRate: 72 },
  },
  "Tháng này": {
    "Anh Nguyễn": { calls: 440, callMinutes: 1260, leads: 12, completedOrders: 11, unmetRequests: 2, responseMinutes: 11, messageResponseRate: 94, answerRate: 75 },
    "Minh Trần": { calls: 362, callMinutes: 1344, leads: 11, completedOrders: 10, unmetRequests: 2, responseMinutes: 13, messageResponseRate: 89, answerRate: 70 },
    "Hà Phạm": { calls: 328, callMinutes: 1296, leads: 10, completedOrders: 9, unmetRequests: 1, responseMinutes: 10, messageResponseRate: 93, answerRate: 74 },
    "Linh Võ": { calls: 296, callMinutes: 1284, leads: 9, completedOrders: 8, unmetRequests: 2, responseMinutes: 14, messageResponseRate: 88, answerRate: 72 },
  },
};

export const unmetRequests = [
  { customer: "Sakura Trading", need: "Vận chuyển hàng lạnh tuyến Nhật", reason: "Chưa có đối tác chuyên tuyến", owner: "Anh Nguyễn", status: "Đang tìm đối tác", period: "Hôm nay" },
  { customer: "Mekong Foods", need: "Giao hàng trong 24h", reason: "Ngoài vùng phục vụ hiện tại", owner: "Minh Trần", status: "Chưa đáp ứng", period: "Hôm nay" },
  { customer: "Vina Fresh", need: "Kho lạnh tại Osaka", reason: "Chưa có đối tác chuyên tuyến", owner: "Linh Võ", status: "Đang tìm đối tác", period: "Hôm nay" },
  { customer: "Pacific Star", need: "Giao nhận cuối tuần", reason: "Chưa có đối tác giao nhận tại điểm đến", owner: "Anh Nguyễn", status: "Đang xử lý", period: "Tuần này" },
  { customer: "Lotus Ceramics", need: "Đóng gói chống vỡ theo tiêu chuẩn", reason: "Chờ xác nhận quy cách với nhà cung cấp", owner: "Minh Trần", status: "Đang xử lý", period: "Tuần này" },
  { customer: "Orchid Home", need: "Bảo hiểm hàng giá trị cao", reason: "Chờ xác nhận từ đơn vị bảo hiểm", owner: "Hà Phạm", status: "Đang xử lý", period: "Tuần này" },
  { customer: "Green Leaf Export", need: "Chứng nhận kiểm dịch bổ sung", reason: "Cần xác nhận yêu cầu từ đại lý nhập khẩu", owner: "Linh Võ", status: "Đang tìm đối tác", period: "Tháng này" },
];

export const owners = ["Anh Nguyễn", "Minh Trần", "Hà Phạm", "Linh Võ"];

export type Lead = {
  name: string; company: string; phone: string; source: string; owner: string;
  status: string; last: string; need: string;
};

export type Deal = {
  name: string; detail: string; owner: string; stage: string; value: number; quoteRejected?: boolean;
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
  { name: "Sakura Trading", detail: "Hàng lạnh · Nhật Bản", owner: "Anh Nguyễn", stage: "quotation", value: 68000000 },
  { name: "Orchid Home", detail: "Đồ gỗ · Hoa Kỳ", owner: "Hà Phạm", stage: "accepted", value: 42500000 },
  { name: "Blue Ocean Co.", detail: "Vận tải biển · Singapore", owner: "Linh Võ", stage: "booking", value: 89000000 },
  { name: "An Phát Materials", detail: "Thông quan · Hàn Quốc", owner: "Anh Nguyễn", stage: "order-info", value: 27500000 },
  { name: "Pacific Star", detail: "Hàng lẻ · Đức", owner: "Anh Nguyễn", stage: "booking-docs", value: 51200000 },
  { name: "NovaTech Parts", detail: "Linh kiện · Hoa Kỳ", owner: "Hà Phạm", stage: "customs", value: 74000000 },
  { name: "Vina Fresh", detail: "Nông sản · Nhật Bản", owner: "Minh Trần", stage: "care", value: 38500000 },
  { name: "Lotus Ceramics", detail: "Gốm sứ · Pháp", owner: "Minh Trần", stage: "pricing", value: 19800000 },
  { name: "Everwell Pharma", detail: "Dược phẩm · Úc", owner: "Hà Phạm", stage: "transport", value: 63200000 },
  { name: "Green Leaf Export", detail: "Nông sản · Hà Lan", owner: "Linh Võ", stage: "delivery", value: 55800000 },
  { name: "Mekong Foods", detail: "Thực phẩm · Nội địa", owner: "Minh Trần", stage: "care", value: 31600000 },
  { name: "Sunrise Apparel", detail: "May mặc · Canada", owner: "Linh Võ", stage: "payment", value: 46800000 },
  { name: "An Bình Textiles", detail: "Dệt may · Hàn Quốc", owner: "Hà Phạm", stage: "agent-selection", value: 36200000 },
  { name: "Nami Seafood", detail: "Thủy sản · Nhật Bản", owner: "Linh Võ", stage: "customs-docs", value: 52700000 },
  { name: "Delta Packaging", detail: "Bao bì · Thái Lan", owner: "Minh Trần", stage: "completed", value: 21400000 },
];

export const initialCalls: Call[] = [
  { time: "10:24", customer: "Sakura Trading", phone: "0908 123 456", direction: "Đi", owner: "Anh Nguyễn", duration: "06:42", result: "Đã kết nối", note: "Trao đổi báo giá tuyến Nhật" },
  { time: "10:02", customer: "Orchid Home", phone: "0987 654 321", direction: "Đến", owner: "Hà Phạm", duration: "03:18", result: "Đã kết nối", note: "Xác nhận chứng từ xuất khẩu" },
  { time: "09:46", customer: "Blue Ocean Co.", phone: "0934 567 890", direction: "Đi", owner: "Linh Võ", duration: "00:00", result: "Không nghe máy", note: "Hẹn gọi lại buổi chiều" },
  { time: "09:32", customer: "An Phát Materials", phone: "0903 222 189", direction: "Đi", owner: "Anh Nguyễn", duration: "08:15", result: "Đã kết nối", note: "Bổ sung thông tin lô hàng" },
  { time: "09:10", customer: "Green Leaf Export", phone: "0966 555 778", direction: "Đến", owner: "Linh Võ", duration: "04:26", result: "Đã kết nối", note: "Hỏi tiến độ báo giá" },
  { time: "08:55", customer: "Everwell Pharma", phone: "0982 456 710", direction: "Đi", owner: "Hà Phạm", duration: "00:00", result: "Gọi lại sau", note: "Khách đang bận" },
];
