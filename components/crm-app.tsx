"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { Call, Deal, initialCalls, initialDeals, initialLeads, Lead, owners, reportData, SalesStats, stages, teams, unmetRequests } from "@/lib/mock-data";

type Page = "overview" | "leads" | "pipeline" | "reports" | "calls" | "settings";
type Modal = "lead" | "deal" | "call" | null;

const pageNames: Record<Page, string> = {
  overview: "Tổng quan", leads: "Khách hàng tiềm năng", pipeline: "Tiến độ đơn hàng",
  reports: "Báo cáo", calls: "Tổng đài & cuộc gọi", settings: "Tích hợp API",
};

function initials(value: string) { return value.split(" ").slice(-2).map((part) => part[0]).join(""); }
function money(value: number) { return new Intl.NumberFormat("vi-VN").format(value) + " ₫"; }
function tagClass(value: string) { return value === "Báo giá" ? "gold" : value === "Đồng ý" ? "blue" : value === "Không đáp ứng" ? "red" : ""; }

function Avatar({ name }: { name: string }) { return <span className="avatar">{initials(name)}</span>; }
function Tag({ children, tone = "" }: { children: React.ReactNode; tone?: string }) { return <span className={`tag ${tone}`}>{children}</span>; }
function Button({ children, onClick, primary = false, className = "" }: { children: React.ReactNode; onClick?: () => void; primary?: boolean; className?: string }) {
  return <button type="button" className={`btn ${primary ? "primary" : ""} ${className}`} onClick={onClick}>{children}</button>;
}
function Metric({ label, value, note, glyph }: { label: string; value: string; note: string; glyph?: string }) {
  return <article className="metric">{glyph && <span className="glyph">{glyph}</span>}<div className="label">{label}</div><div className="value">{value}</div><div className="delta">{note}</div></article>;
}
function PageHead({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="head-actions">{action}</div>}</div>;
}

export default function CrmApp() {
  const [page, setPage] = useState<Page>("overview");
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [calls, setCalls] = useState<Call[]>(initialCalls);
  const [modal, setModal] = useState<Modal>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [toastText, setToastText] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadOwner, setLeadOwner] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [dealOwner, setDealOwner] = useState("");
  const [callSearch, setCallSearch] = useState("");
  const [callOwner, setCallOwner] = useState("");
  const [callDirection, setCallDirection] = useState("");
  const [reportPeriod, setReportPeriod] = useState("Tháng này");
  const [reportTeam, setReportTeam] = useState("Toàn đội");
  const [reportOwnerFilter, setReportOwnerFilter] = useState("");
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [dropStage, setDropStage] = useState<string | null>(null);
  const importInput = useRef<HTMLInputElement>(null);

  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const query = leadSearch.toLocaleLowerCase("vi");
    return (!query || `${lead.name} ${lead.company} ${lead.phone}`.toLocaleLowerCase("vi").includes(query))
      && (!leadOwner || lead.owner === leadOwner) && (!leadStatus || lead.status === leadStatus);
  }), [leads, leadSearch, leadOwner, leadStatus]);
  const filteredCalls = useMemo(() => calls.filter((call) => {
    const query = callSearch.toLocaleLowerCase("vi");
    return (!query || `${call.customer} ${call.phone}`.toLocaleLowerCase("vi").includes(query))
      && (!callOwner || call.owner === callOwner) && (!callDirection || call.direction === callDirection);
  }), [calls, callSearch, callOwner, callDirection]);
  const reportOwners = useMemo(() => owners.filter((owner) => (reportTeam === "Toàn đội" || teams[owner] === reportTeam) && (!reportOwnerFilter || owner === reportOwnerFilter)), [reportTeam, reportOwnerFilter]);
  const reportRows = useMemo(() => reportOwners.map((owner) => ({ owner, ...reportData[reportPeriod][owner] })), [reportOwners, reportPeriod]);
  const reportTotals = useMemo(() => reportRows.reduce<SalesStats>((total, row) => ({
    calls: total.calls + row.calls,
    callMinutes: total.callMinutes + row.callMinutes,
    leads: total.leads + row.leads,
    completedOrders: total.completedOrders + row.completedOrders,
    unmetRequests: total.unmetRequests + row.unmetRequests,
    responseMinutes: total.responseMinutes + row.responseMinutes,
    messageResponseRate: total.messageResponseRate + row.messageResponseRate,
    answerRate: total.answerRate + row.answerRate,
  }), { calls: 0, callMinutes: 0, leads: 0, completedOrders: 0, unmetRequests: 0, responseMinutes: 0, messageResponseRate: 0, answerRate: 0 }), [reportRows]);

  function notify(message: string) {
    setToastText(message);
    window.setTimeout(() => setToastText(""), 2600);
  }

  function goTo(next: Page) {
    setPage(next);
    setSelectedLead(null);
  }

  function leadStatusForStage(stageId: string) {
    if (stageId === "care") return "Đang chăm sóc";
    if (stageId === "quotation") return "Báo giá";
    if (stageId === "accepted") return "Đồng ý";
    return stages.find((stage) => stage.id === stageId)?.title || "Đang chăm sóc";
  }

  function updateDeal(name: string, stageId: string) {
    setDeals((items) => items.map((deal) => deal.name === name ? { ...deal, stage: stageId, quoteRejected: false } : deal));
    setLeads((items) => items.map((lead) => lead.company === name ? { ...lead, status: leadStatusForStage(stageId) } : lead));
    notify(`${name}: ${stages.find((stage) => stage.id === stageId)?.title || stageId}`);
  }

  function rejectQuote(name: string) {
    setDeals((items) => items.map((deal) => deal.name === name ? { ...deal, stage: "care", quoteRejected: true } : deal));
    setLeads((items) => items.map((lead) => lead.company === name ? { ...lead, status: "Đang chăm sóc" } : lead));
    notify("Khách chưa đồng ý báo giá — cơ hội quay lại Chăm sóc khách hàng");
  }

  function startDealDrag(event: DragEvent<HTMLElement>, deal: Deal) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", deal.name);
    setDraggedDeal(deal.name);
  }

  function dropDeal(event: DragEvent<HTMLElement>, stageId: string) {
    event.preventDefault();
    const name = event.dataTransfer.getData("text/plain") || draggedDeal;
    if (name) updateDeal(name, stageId);
    setDraggedDeal(null);
    setDropStage(null);
  }

  function parseCsvLine(line: string) {
    return Array.from(line.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g), (match) => (match[1] ?? match[2] ?? "").replace(/""/g, '"').trim());
  }

  function normalizeHeader(value: string) {
    return value.trim().toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  async function importCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const lines = (await file.text()).split(/\r?\n/).filter((line) => line.trim());
    event.target.value = "";
    if (lines.length < 2) return notify("CSV cần có hàng tiêu đề và ít nhất một khách hàng");
    const headers = parseCsvLine(lines[0]).map(normalizeHeader);
    const findColumn = (...names: string[]) => headers.findIndex((header) => names.includes(header));
    const nameIndex = findColumn("name", "ten lien he", "ten khach hang", "contact name");
    const companyIndex = findColumn("company", "cong ty", "doanh nghiep");
    const phoneIndex = findColumn("phone", "so dien thoai", "dien thoai");
    if (nameIndex < 0 || companyIndex < 0 || phoneIndex < 0) return notify("CSV cần các cột: name, company, phone");
    const sourceIndex = findColumn("source", "nguon");
    const ownerIndex = findColumn("owner", "sales", "nhan vien phu trach");
    const needIndex = findColumn("need", "nhu cau");
    const incoming = lines.slice(1).map(parseCsvLine).map((row): Lead | null => {
      const name = row[nameIndex]?.trim();
      const company = row[companyIndex]?.trim();
      const phone = row[phoneIndex]?.trim();
      if (!name || !company || !phone) return null;
      const requestedOwner = ownerIndex >= 0 ? row[ownerIndex]?.trim() : "";
      return { name, company, phone, source: (sourceIndex >= 0 && row[sourceIndex]) || "Import CSV", owner: owners.includes(requestedOwner) ? requestedOwner : owners[0], status: "Đang chăm sóc", last: "Vừa import", need: (needIndex >= 0 && row[needIndex]) || "Chưa cập nhật" };
    }).filter((lead): lead is Lead => Boolean(lead));
    const unique = incoming.filter((lead, index) => !leads.some((existing) => existing.phone === lead.phone) && incoming.findIndex((candidate) => candidate.phone === lead.phone) === index);
    if (!unique.length) return notify("Không có dòng hợp lệ mới để import");
    setLeads((items) => [...unique, ...items]);
    setDeals((items) => [...unique.map((lead) => ({ name: lead.company, detail: `${lead.need} · Lead mới`, owner: lead.owner, stage: "care", value: 0 })), ...items]);
    notify(`Đã import ${unique.length} khách hàng và đưa vào chăm sóc`);
  }

  function addLead(form: FormData) {
    const name = String(form.get("name") || "").trim();
    const company = String(form.get("company") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    if (!name || !company || !phone) return notify("Vui lòng nhập tên, công ty và số điện thoại");
    const status = String(form.get("status"));
    const owner = String(form.get("owner"));
    const need = String(form.get("need") || "Chưa cập nhật");
    const initialStage = status === "Báo giá" ? "quotation" : status === "Đồng ý" ? "accepted" : "care";
    setLeads((items) => [{ name, company, phone, source: String(form.get("source")), owner, status, last: "Vừa tạo", need }, ...items]);
    setDeals((items) => [{ name: company, detail: `${need} · Lead mới`, owner, stage: initialStage, value: 0 }, ...items]);
    setModal(null);
    notify("Đã tạo khách hàng và phân công sales");
  }

  function addDeal(form: FormData) {
    const name = String(form.get("name") || "").trim();
    const value = Number(form.get("value"));
    if (!name || !value) return notify("Vui lòng nhập khách hàng và giá trị đơn hàng");
    const stage = String(form.get("stage"));
    setDeals((items) => [{ name, detail: "Cơ hội mới · Chưa xác định tuyến", value, owner: String(form.get("owner")), stage }, ...items]);
    setLeads((items) => items.map((lead) => lead.company === name ? { ...lead, owner: String(form.get("owner")), status: leadStatusForStage(stage) } : lead));
    setModal(null);
    notify("Đã tạo cơ hội bán hàng");
  }

  function addCall(form: FormData) {
    const customer = String(form.get("customer"));
    const lead = leads.find((item) => item.company === customer);
    const minutes = Number(form.get("duration")) || 0;
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setCalls((items) => [{ time: now, customer, phone: lead?.phone || "", owner: String(form.get("owner")), direction: String(form.get("direction")), duration: `${String(Math.floor(minutes)).padStart(2, "0")}:00`, result: String(form.get("result")), note: String(form.get("note") || "Đã ghi nhận cuộc gọi") }, ...items]);
    setModal(null);
    notify(`Cuộc gọi đã được ghi nhận cho ${String(form.get("owner"))}`);
  }

  function syncCalls() {
    setCalls((items) => [{ time: "10:42", customer: "Blue Ocean Co.", phone: "0934 567 890", direction: "Đi", owner: "Linh Võ", duration: "05:12", result: "Đã kết nối", note: "Đồng bộ từ tổng đài (mock)" }, ...items]);
    notify("Đã đồng bộ 1 cuộc gọi mới từ tổng đài demo");
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">N</div><div>NORTHSTAR<small>Logistics CRM</small></div></div>
      <div className="workspace"><strong>Northstar Logistics</strong>Workspace · Việt Nam</div>
      <div><div className="nav-label">Không gian làm việc</div><nav className="nav">
        <NavButton page="overview" current={page} onClick={goTo} icon="◫" label="Tổng quan" />
        <NavButton page="leads" current={page} onClick={goTo} icon="♙" label="Khách hàng" count={leads.length + 12} />
        <NavButton page="pipeline" current={page} onClick={goTo} icon="▥" label="Đơn hàng" />
        <NavButton page="reports" current={page} onClick={goTo} icon="▤" label="Báo cáo" />
      </nav></div>
      <div className="secondary-nav"><div className="nav-label">Quản trị</div><nav className="nav">
        <NavButton page="calls" current={page} onClick={goTo} icon="♧" label="Cuộc gọi" />
        <NavButton page="settings" current={page} onClick={goTo} icon="⚙" label="Tích hợp API" />
      </nav></div>
      <div className="side-bottom"><div className="team-card"><Avatar name="Anh Lê" /><div><strong>Anh Lê</strong><small>Quản trị viên</small></div></div></div>
    </aside>

    <main className="main"><header className="topbar"><div className="crumb">Northstar / <strong>{pageNames[page]}</strong></div><div className="top-right">
      <div className="global-search"><span>⌕</span><input aria-label="Tìm kiếm khách hàng" value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { setLeadSearch(globalSearch); goTo("leads"); } }} placeholder="Tìm khách hàng" /></div>
      <button className="icon-btn" aria-label="Thông báo" onClick={() => notify("Bạn đã xem thông báo mới nhất")}>♧</button><Avatar name="Anh Lê" />
    </div></header>

    <div className="content">
      {page === "overview" && <>
        <PageHead eyebrow="Thứ Hai, 03 tháng 10, 2026" title="Chào buổi sáng, Anh" description="Đây là những việc quan trọng trong ngày của đội ngũ." action={<><Button onClick={() => goTo("reports")}>Xem báo cáo</Button><Button primary onClick={() => setModal("lead")}>＋ Thêm khách hàng</Button></>} />
        <div className="metrics overview-metrics">
          <Metric label="Khách hàng tiềm năng" value={String(248 + leads.length - 12)} note="↗ 12.8% so với tháng trước" glyph="♙" />
          <Metric label="Cuộc gọi trong tháng" value="1,426" note="↗ 8.4% so với tháng trước" glyph="◷" />
          <Metric label="Đơn hoàn thành" value="38" note="↗ 6 đơn so với tháng trước" glyph="▣" />
        </div>
        <div className="grid overview-grid">
          <article className="panel"><PanelHead title="Pipeline bán hàng" subtitle="Cơ hội đang mở theo giai đoạn" action={<button className="link" onClick={() => goTo("pipeline")}>Mở pipeline →</button>} />
            <div className="funnel">{[{ id: "care", title: "Chăm sóc khách hàng" }, { id: "quotation", title: "Gửi báo giá" }, { id: "accepted", title: "Khách hàng đồng ý" }, { id: "booking", title: "Đặt booking" }, { id: "delivery", title: "Giao hàng" }].map((stage, index) => { const count = deals.filter((deal) => deal.stage === stage.id).length + [17, 8, 6, 4, 3][index]; return <div className="funnel-row" key={stage.id}><span>{stage.title}</span><div className="bar-track"><div className="bar" style={{ width: `${Math.round(count / 19 * 100)}%` }} /></div><b>{count}</b></div>; })}</div>
          </article>
          <article className="panel"><PanelHead title="Hoạt động gần đây" subtitle="Cập nhật mới nhất" action={<button className="link" onClick={() => goTo("calls")}>Tất cả →</button>} />
            <div className="activity"><Activity icon="☎" title="Anh Nguyễn gọi Sakura Trading" body="Đã trao đổi báo giá tuyến Nhật" time="10:24" /><Activity icon="▣" title="Hà Phạm cập nhật Orchid Home" body="Cơ hội chuyển sang Đồng ý" time="09:42" /><Activity icon="＋" title="Lead mới từ tổng đài" body="Blue Ocean Co. · Linh Võ phụ trách" time="09:16" /></div>
          </article>
        </div>
        <article className="panel overview-priority"><PanelHead title="Khách hàng cần chăm sóc" subtitle="Ưu tiên follow-up hôm nay" action={<button className="link" onClick={() => goTo("leads")}>Danh sách khách hàng →</button>} />
          <div className="table-wrap"><table><thead><tr><th>Khách hàng</th><th>Sales phụ trách</th><th>Giai đoạn</th><th>Liên hệ gần nhất</th></tr></thead><tbody>{leads.slice(0, 3).map((lead) => <tr className="row-click" key={lead.company} onClick={() => setSelectedLead(lead)}><td className="company">{lead.company}<span className="secondary">{lead.name}</span></td><td><Owner name={lead.owner} /></td><td><Tag tone={tagClass(lead.status)}>{lead.status}</Tag></td><td>{lead.last}</td></tr>)}</tbody></table></div>
        </article>
      </>}

      {page === "leads" && <>
        <PageHead eyebrow="Quản lý khách hàng" title="Khách hàng tiềm năng" description="Theo dõi nguồn, người phụ trách và lịch sử chăm sóc." action={<><Button onClick={() => importInput.current?.click()}>⇧ Import CSV</Button><input ref={importInput} className="visually-hidden" type="file" accept=".csv,text/csv" onChange={importCsv} /><Button primary onClick={() => setModal("lead")}>＋ Thêm khách hàng</Button></>} />
        <div className="metrics"><Metric label="Tổng khách hàng" value={String(248 + leads.length - 12)} note="Tất cả nguồn" /><Metric label="Lead mới tháng này" value="42" note="↗ 16% so tháng trước" /><Metric label="Chưa được liên hệ" value="8" note="Cần xử lý hôm nay" /><Metric label="Tỷ lệ chuyển đổi" value="18.6%" note="↗ 3.2% so tháng trước" /></div>
        <div className="filters"><input aria-label="Tìm khách hàng" value={leadSearch} onChange={(event) => setLeadSearch(event.target.value)} placeholder="Tìm tên, công ty, số điện thoại" /><select aria-label="Lọc theo sales" value={leadOwner} onChange={(event) => setLeadOwner(event.target.value)}><option value="">Tất cả sales</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</select><select aria-label="Lọc theo giai đoạn" value={leadStatus} onChange={(event) => setLeadStatus(event.target.value)}><option value="">Tất cả giai đoạn</option>{["Đang chăm sóc", "Báo giá", "Đồng ý", ...stages.map((stage) => stage.title), "Không đáp ứng"].filter((status, index, all) => all.indexOf(status) === index).map((status) => <option key={status}>{status}</option>)}</select><Button onClick={() => notify(`${filteredLeads.length} khách hàng phù hợp`) }>Lọc</Button></div>
        <article className="panel table-panel"><PanelHead title="Danh sách khách hàng" subtitle={`${filteredLeads.length} bản ghi`} action={<button className="link" onClick={() => notify("Đã xuất danh sách khách hàng (mock)")}>⇩ Xuất CSV</button>} /><div className="table-wrap"><table><thead><tr><th>Khách hàng</th><th>Điện thoại</th><th>Nguồn</th><th>Sales phụ trách</th><th>Giai đoạn</th><th>Liên hệ gần nhất</th></tr></thead><tbody>{filteredLeads.map((lead) => <tr className="row-click" key={`${lead.company}-${lead.phone}`} onClick={() => setSelectedLead(lead)}><td className="company">{lead.company}<span className="secondary">{lead.name}</span></td><td>{lead.phone}</td><td>{lead.source}</td><td><Owner name={lead.owner} /></td><td><Tag tone={tagClass(lead.status)}>{lead.status}</Tag></td><td>{lead.last}</td></tr>)}</tbody></table>{!filteredLeads.length && <div className="empty-state">Không tìm thấy khách hàng phù hợp.</div>}</div></article>
      </>}

      {page === "pipeline" && <>
        <PageHead eyebrow="Xử lý đơn hàng" title="Theo dõi tiến độ đơn hàng" description="Từ chăm sóc khách hàng đến giao hàng và thanh toán, theo đúng thứ tự quy trình." action={<Button primary onClick={() => setModal("deal")}>＋ Tạo đơn hàng</Button>} />
        <div className="pipeline-head"><div className="pipeline-hint"><strong>Kéo thẻ sang cột kế tiếp</strong><span>Hoặc dùng nút mũi tên trên thẻ. Nếu khách chưa đồng ý báo giá, chọn “Từ chối báo giá” để đưa về bước chăm sóc.</span></div><select aria-label="Lọc đơn hàng theo sales" value={dealOwner} onChange={(event) => setDealOwner(event.target.value)}><option value="">Tất cả sales</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></div>
        <div className="pipeline" aria-label="Bảng tiến độ đơn hàng">
          {stages.map((stage) => {
            const stageDeals = deals.filter((deal) => deal.stage === stage.id && (!dealOwner || deal.owner === dealOwner));
            return <section className={`stage ${dropStage === stage.id ? "drop-target" : ""}`} key={stage.id} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; setDropStage(stage.id); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDropStage(null); }} onDrop={(event) => dropDeal(event, stage.id)}>
              <div className="stage-head"><div><strong>{stage.title}</strong><small>{stage.description}</small></div><b>{stageDeals.length}</b></div>
              {stageDeals.length ? stageDeals.map((deal) => {
                const stageIndex = stages.findIndex((item) => item.id === deal.stage);
                return <article className={`deal ${draggedDeal === deal.name ? "is-dragging" : ""}`} key={`${deal.name}-${deal.stage}`} draggable onDragStart={(event) => startDealDrag(event, deal)} onDragEnd={() => { setDraggedDeal(null); setDropStage(null); }}>
                  <div className="deal-title-row"><span className="drag-grip" aria-hidden="true">⠿</span><h3>{deal.name}</h3></div><p>{deal.detail}</p>
                  {deal.quoteRejected && <Tag tone="gold">Báo giá chưa được đồng ý · chăm sóc lại</Tag>}
                  <div className="deal-foot"><span className="amount">{deal.value ? money(deal.value) : "Chưa có báo giá"}</span><Owner name={deal.owner} /></div>
                  <div className="deal-actions"><button aria-label={`Lùi ${deal.name} một giai đoạn`} disabled={stageIndex <= 0} onClick={() => updateDeal(deal.name, stages[Math.max(0, stageIndex - 1)].id)}>←</button><button aria-label={`Tiến ${deal.name} một giai đoạn`} disabled={stageIndex >= stages.length - 1} onClick={() => updateDeal(deal.name, stages[Math.min(stages.length - 1, stageIndex + 1)].id)}>→</button>{stage.id === "quotation" && <button onClick={() => rejectQuote(deal.name)}>Từ chối báo giá</button>}</div>
                </article>;
              }) : <div className="empty-stage">Thả đơn hàng vào bước này</div>}
            </section>;
          })}
        </div>
      </>}

      {page === "reports" && <>
        <PageHead eyebrow="Phân tích hiệu suất" title="Báo cáo kinh doanh" description="Theo dõi hoạt động cá nhân và toàn đội theo kỳ." action={<Button onClick={() => notify("Đã xuất báo cáo PDF (mock)")}>⇩ Xuất báo cáo</Button>} />
        <div className="filters report-filters"><select aria-label="Kỳ báo cáo" value={reportPeriod} onChange={(event) => setReportPeriod(event.target.value)}><option>Tháng này</option><option>Tuần này</option><option>Hôm nay</option></select><select aria-label="Đội báo cáo" value={reportTeam} onChange={(event) => { setReportTeam(event.target.value); setReportOwnerFilter(""); }}><option>Toàn đội</option><option>Team xuất khẩu</option><option>Team nội địa</option></select><select aria-label="Nhân viên báo cáo" value={reportOwnerFilter} onChange={(event) => setReportOwnerFilter(event.target.value)}><option value="">Tất cả nhân viên</option>{owners.filter((owner) => reportTeam === "Toàn đội" || teams[owner] === reportTeam).map((owner) => <option key={owner}>{owner}</option>)}</select><span className="subtle">Dữ liệu mẫu</span></div>
        <div className="report-cards"><Metric label="Tổng cuộc gọi" value={reportTotals.calls.toLocaleString("vi-VN")} note={`${(reportTotals.callMinutes / 60).toFixed(1)} giờ gọi trong kỳ`} /><Metric label="Lead mới" value={String(reportTotals.leads)} note="Được phân công cho sales" /><Metric label="Đơn hoàn tất" value={String(reportTotals.completedOrders)} note="Đã giao và thanh toán" /><Metric label="Yêu cầu chưa đáp ứng" value={`${reportTotals.unmetRequests}`} note={`Phản hồi TB ${Math.round(reportTotals.responseMinutes / Math.max(reportRows.length, 1))} phút · ${Math.round(reportTotals.messageResponseRate / Math.max(reportRows.length, 1))}% tin nhắn trong 15 phút`} /></div>
        <div className="report-layout"><article className="panel"><PanelHead title="Cuộc gọi & kết nối" subtitle={reportPeriod === "Hôm nay" ? "Theo giờ hôm nay" : reportPeriod === "Tuần này" ? "Theo ngày trong tuần" : "Theo ngày trong tháng"} /><div className="chart">{(reportPeriod === "Hôm nay" ? ["8h", "9h", "10h", "11h", "12h", "13h", "14h"] : reportPeriod === "Tuần này" ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] : ["01", "05", "10", "15", "20", "25", "30"]).map((label, index) => { const heights = [42, 69, 51, 84, 63, 94, 72]; const connected = heights[index] * (reportTotals.answerRate / Math.max(reportRows.length, 1)) / 100; return <div className="chart-col" key={label}><i style={{ height: `${heights[index]}%` }} /><i style={{ height: `${connected}%` }} /><label>{label}</label></div>; })}</div><div className="legend"><span><i />Cuộc gọi</span><span><i />Kết nối</span></div></article>
          <article className="panel"><PanelHead title="Hiệu suất từng nhân viên" subtitle="Chỉ số thay đổi theo kỳ và nhân viên/đội đã chọn" /><div className="table-wrap report-table-wrap"><table className="report-table"><thead><tr><th>Sales</th><th>Cuộc gọi</th><th>Thời lượng</th><th>Lead</th><th>Đơn xong</th><th>Chưa đáp ứng</th><th>Phản hồi TB</th><th>Tin nhắn ≤15 phút</th></tr></thead><tbody>{reportRows.map((row) => <tr key={row.owner}><td className="company">{row.owner}<span className="secondary">{teams[row.owner]}</span></td><td>{row.calls}</td><td>{(row.callMinutes / 60).toFixed(1)} giờ</td><td>{row.leads}</td><td>{row.completedOrders}</td><td>{row.unmetRequests}</td><td>{row.responseMinutes} phút</td><td>{row.messageResponseRate}%</td></tr>)}</tbody></table></div></article></div>
        <article className="panel unmet-panel"><PanelHead title="Yêu cầu khách hàng chưa đáp ứng" subtitle="Mock data theo kỳ, nhân viên và đội đã chọn" action={<Tag tone="gold">{reportTotals.unmetRequests} yêu cầu</Tag>} /><div className="table-wrap"><table><thead><tr><th>Khách hàng</th><th>Yêu cầu</th><th>Lý do</th><th>Sales</th><th>Trạng thái</th><th>Ghi nhận</th></tr></thead><tbody>{unmetRequests.filter((request) => (reportPeriod === "Tháng này" || request.period === "Hôm nay" || (reportPeriod === "Tuần này" && request.period === "Tuần này")) && (reportTeam === "Toàn đội" || teams[request.owner] === reportTeam) && (!reportOwnerFilter || request.owner === reportOwnerFilter)).map((request) => <tr key={request.customer}><td className="company">{request.customer}</td><td>{request.need}</td><td>{request.reason}</td><td>{request.owner}</td><td><Tag tone={request.status === "Chưa đáp ứng" ? "red" : "gold"}>{request.status}</Tag></td><td>{request.period}</td></tr>)}</tbody></table></div></article>
      </>}

      {page === "calls" && <>
        <PageHead eyebrow="Tích hợp tổng đài" title="Cuộc gọi" description="Cuộc gọi gắn với khách hàng và sales thực hiện." action={<><Button onClick={syncCalls}>⟳ Đồng bộ cuộc gọi</Button><Button primary onClick={() => setModal("call")}>＋ Ghi nhận cuộc gọi</Button></>} />
        <div className="metrics"><Metric label="Cuộc gọi hôm nay" value={String(68 + calls.length - 6)} note="42 đi · 26 đến" /><Metric label="Thời lượng trung bình" value="4:32" note="+0:18 so với tuần trước" /><Metric label="Tỷ lệ bắt máy" value="72.8%" note="49 cuộc kết nối" /><Metric label="Cần follow-up" value="12" note="3 quá hạn" /></div>
        <div className="filters"><input aria-label="Tìm cuộc gọi" value={callSearch} onChange={(event) => setCallSearch(event.target.value)} placeholder="Tìm khách hàng hoặc số điện thoại" /><select aria-label="Lọc cuộc gọi theo sales" value={callOwner} onChange={(event) => setCallOwner(event.target.value)}><option value="">Tất cả nhân viên</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</select><select aria-label="Lọc chiều cuộc gọi" value={callDirection} onChange={(event) => setCallDirection(event.target.value)}><option value="">Tất cả loại cuộc gọi</option><option>Đi</option><option>Đến</option></select></div>
        <article className="panel table-panel"><PanelHead title="Lịch sử cuộc gọi" subtitle={`${filteredCalls.length} cuộc gọi · Đồng bộ lúc 10:42`} /><div className="table-wrap"><table><thead><tr><th>Thời gian</th><th>Khách hàng</th><th>Loại</th><th>Sales</th><th>Thời lượng</th><th>Kết quả</th><th>Ghi chú</th></tr></thead><tbody>{filteredCalls.map((call, index) => <tr key={`${call.time}-${call.customer}-${index}`}><td>{call.time}<span className="secondary">03/10/2026</span></td><td className="company">{call.customer}<span className="secondary">{call.phone}</span></td><td><Tag tone={call.direction === "Đi" ? "blue" : ""}>{call.direction === "Đi" ? "↗ Đi" : "↙ Đến"}</Tag></td><td>{call.owner}</td><td>{call.duration}</td><td><Tag tone={call.result === "Đã kết nối" ? "" : "gold"}>{call.result}</Tag></td><td>{call.note}</td></tr>)}</tbody></table>{!filteredCalls.length && <div className="empty-state">Không tìm thấy cuộc gọi.</div>}</div></article>
      </>}

      {page === "settings" && <>
        <PageHead eyebrow="Kết nối dịch vụ" title="Tích hợp tổng đài" description="Kết nối phần mềm tổng đài bên thứ ba qua API hoặc webhook." />
        <div className="integration"><article className="panel"><PanelHead title="Cấu hình kết nối" action={<Tag><i className="status-dot" />Demo mode</Tag>} /><form className="settings-form" onSubmit={(event) => { event.preventDefault(); notify("Đã kiểm tra kết nối thành công (mock)"); }}><Field label="Nhà cung cấp tổng đài"><select defaultValue="Khác / Custom API"><option>Khác / Custom API</option><option>Stringee</option><option>CloudFone</option><option>VoIP24h</option></select></Field><Field label="API endpoint"><input defaultValue="https://api.example.com/v1/calls" /></Field><Field label="API key"><input type="password" defaultValue="demo_api_key_12345678" /></Field><Field label="Webhook URL (CRM)"><input readOnly defaultValue="https://crm.northstar.vn/webhooks/calls/demo" /></Field><div className="form-actions"><button className="btn primary" type="submit">Kiểm tra kết nối</button><Button onClick={syncCalls}>Đồng bộ ngay</Button></div></form></article>
          <article className="panel"><PanelHead title="Luồng dữ liệu cuộc gọi" /><p className="body-copy">Khi cuộc gọi kết thúc, tổng đài gửi webhook về CRM. Hệ thống tìm khách hàng theo số điện thoại, ghi nhận sales thực hiện, thời lượng và kết quả, sau đó cập nhật lịch sử chăm sóc.</p><pre className="code">{`POST /webhooks/calls\n{\n  "call_id": "call_10293",\n  "phone": "+84 908 123 456",\n  "agent_name": "Anh Nguyễn",\n  "direction": "outbound",\n  "duration": 286,\n  "status": "answered",\n  "recording_url": "...",\n  "started_at": "2026-10-03T09:18:00+07:00"\n}`}</pre></article>
          <article className="panel integration-wide"><PanelHead title="Quy tắc đồng bộ" /><div className="detail-grid"><div><small>Ghép khách hàng</small><strong>Số điện thoại chuẩn E.164</strong></div><div><small>Phân công sales</small><strong>Theo agent extension / tài khoản</strong></div><div><small>Dữ liệu lưu</small><strong>Thời gian, chiều gọi, thời lượng, kết quả</strong></div><div><small>Bản ghi âm</small><strong>Lưu URL tham chiếu từ tổng đài</strong></div></div></article></div>
      </>}
    </div></main>

    <nav className="mobile-nav" aria-label="Điều hướng chính">{(["overview", "leads", "pipeline", "reports", "calls"] as Page[]).map((item, index) => <button key={item} className={page === item ? "active" : ""} onClick={() => goTo(item)}><span>{["◫", "♙", "▥", "▤", "♧"][index]}</span>{["Tổng quan", "Khách hàng", "Đơn hàng", "Báo cáo", "Cuộc gọi"][index]}</button>)}</nav>

    {selectedLead && <><button className="scrim" aria-label="Đóng hồ sơ khách hàng" onClick={() => setSelectedLead(null)} /><aside className="drawer"><div className="drawer-top"><span className="eyebrow">Hồ sơ khách hàng</span><button className="icon-btn" aria-label="Đóng" onClick={() => setSelectedLead(null)}>✕</button></div><h2>{selectedLead.company}</h2><p>{selectedLead.name} · Khách hàng từ {selectedLead.source}</p><Tag tone={tagClass(selectedLead.status)}>{selectedLead.status}</Tag><div className="drawer-sec"><h3>Thông tin liên hệ</h3><div className="detail-grid"><div><small>Điện thoại</small><strong>{selectedLead.phone}</strong></div><div><small>Sales phụ trách</small><strong>{selectedLead.owner}</strong></div><div><small>Liên hệ gần nhất</small><strong>{selectedLead.last}</strong></div><div><small>Nhu cầu</small><strong>{selectedLead.need}</strong></div></div></div><div className="drawer-sec"><h3>Lịch sử chăm sóc</h3><div className="timeline"><Activity icon="☎" title={`Cuộc gọi · ${selectedLead.owner}`} body="Trao đổi nhu cầu vận chuyển và lịch trình." time={selectedLead.last} /><Activity icon="＋" title="Khách hàng được tạo" body={`Lead từ ${selectedLead.source} đã được phân công.`} time="Mới" /></div></div><Button primary onClick={() => { setModal("call"); setSelectedLead(null); }}>☎ Ghi nhận cuộc gọi</Button> <Button onClick={() => notify("Đã lên lịch follow-up")}>＋ Follow-up</Button></aside></>}

    {modal && <Modal title={modal === "lead" ? "Thêm khách hàng tiềm năng" : modal === "deal" ? "Tạo cơ hội bán hàng" : "Ghi nhận cuộc gọi"} onClose={() => setModal(null)}>
      {modal === "lead" && <form action={addLead}><div className="form-grid"><Field label="Tên liên hệ"><input name="name" placeholder="Nguyễn Văn An" required /></Field><Field label="Công ty"><input name="company" placeholder="Công ty ABC" required /></Field><Field label="Số điện thoại"><input name="phone" placeholder="0901 234 567" required /></Field><Field label="Nguồn lead"><select name="source"><option>Tổng đài</option><option>Website</option><option>Giới thiệu</option><option>Hội chợ</option></select></Field><Field label="Sales phụ trách"><select name="owner">{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></Field><Field label="Giai đoạn"><select name="status"><option>Đang chăm sóc</option><option>Báo giá</option><option>Đồng ý</option></select></Field><Field label="Nhu cầu" wide><input name="need" placeholder="Ví dụ: vận chuyển hàng lạnh tuyến Nhật" /></Field></div><ModalActions onCancel={() => setModal(null)} submit="Tạo khách hàng" /></form>}
      {modal === "deal" && <form action={addDeal}><div className="form-grid"><Field label="Khách hàng / công ty" wide><input name="name" placeholder="Công ty khách hàng" required /></Field><Field label="Giá trị dự kiến (₫)"><input name="value" type="number" placeholder="25000000" required /></Field><Field label="Giai đoạn"><select name="stage">{stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.title}</option>)}</select></Field><Field label="Sales phụ trách" wide><select name="owner">{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></Field></div><ModalActions onCancel={() => setModal(null)} submit="Tạo cơ hội" /></form>}
      {modal === "call" && <form action={addCall}><div className="form-grid"><Field label="Khách hàng" wide><select name="customer">{leads.map((lead) => <option key={lead.company}>{lead.company}</option>)}</select></Field><Field label="Sales"><select name="owner">{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></Field><Field label="Loại cuộc gọi"><select name="direction"><option>Đi</option><option>Đến</option></select></Field><Field label="Thời lượng (phút)"><input name="duration" type="number" defaultValue="4" min="0" /></Field><Field label="Kết quả"><select name="result"><option>Đã kết nối</option><option>Không nghe máy</option><option>Gọi lại sau</option></select></Field><Field label="Ghi chú" wide><input name="note" placeholder="Trao đổi nhu cầu vận chuyển..." /></Field></div><ModalActions onCancel={() => setModal(null)} submit="Lưu cuộc gọi" /></form>}
    </Modal>}
    <div className={`toast ${toastText ? "show" : ""}`} role="status" aria-live="polite">{toastText}</div>
  </div>;
}

function NavButton({ page, current, onClick, icon, label, count }: { page: Page; current: Page; onClick: (page: Page) => void; icon: string; label: string; count?: number }) {
  return <button className={current === page ? "active" : ""} aria-current={current === page ? "page" : undefined} onClick={() => onClick(page)}><span className="ico">{icon}</span>{label}{count !== undefined && <span className="count">{count}</span>}</button>;
}
function PanelHead({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="panel-head"><div><h2>{title}</h2>{subtitle && <span className="subtle">{subtitle}</span>}</div>{action}</div>;
}
function Owner({ name }: { name: string }) { return <span className="owner"><Avatar name={name} />{name}</span>; }
function Activity({ icon, title, body, time }: { icon: string; title: string; body: string; time: string }) {
  return <div className="activity-item"><div className="activity-icon">{icon}</div><div><strong>{title}</strong><p>{body}</p><time>{time}</time></div></div>;
}
function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <label className={`field ${wide ? "full" : ""}`}><span>{label}</span>{children}</label>;
}
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-box" role="dialog" aria-modal="true" aria-label={title}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" aria-label="Đóng" onClick={onClose}>✕</button></div>{children}</section></div>;
}
function ModalActions({ onCancel, submit }: { onCancel: () => void; submit: string }) {
  return <div className="modal-actions"><Button onClick={onCancel}>Hủy</Button><button className="btn primary" type="submit">{submit}</button></div>;
}
