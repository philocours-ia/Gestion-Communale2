"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Track = { track_code: string; label: string; levels: string[]; status: string; notes?: string | null };
type Enrollment = { id: string; user_id: string; student_name: string; contact_phone?: string | null; level: string; series_code: string; school_year: string; status: string; created_at: string; review_note?: string | null };
type Payment = { id: string; enrollment_id: string; user_id: string; period_month: string; amount_ariary: number; transaction_reference?: string | null; proof_path: string; status: string; rejection_reason?: string | null; created_at: string };
type Ticket = { id: string; user_id: string; enrollment_id: string; ticket_code: string; valid_from: string; valid_until: string; status: string };
type Course = { id: string; title: string; subject: string; level: string; series_code: string; description: string; status: string };
type Session = { id: string; course_id: string; title: string; starts_at: string; ends_at: string; location?: string | null; meeting_url?: string | null; status: string };
type Progress = { id: string; student_user_id: string; course_id?: string | null; activity_type: string; mastery_status: string; score?: number | null; max_score?: number | null; feedback?: string | null; created_at: string };
type Ledger = { id: string; direction: string; category: string; description: string; amount_ariary: number; entry_date: string };
type Tab = "overview" | "register" | "courses" | "progress" | "accounting";

const SCHOOL_YEAR = "2026-2027";
const FEE = 7500;
const T12_TRACK_CODES = ["T12_L", "T12_S", "T12_OSE"] as const;
const MVOLA_NUMBER = process.env.NEXT_PUBLIC_FELIX_MVOLA_NUMBER ?? "";
const money = (value: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value || 0) + " Ar";
const fmtDate = (value?: string | null) => value ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(value)) : "—";
const fmtDateTime = (value?: string | null) => value ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
const levelLabel = (_value: string) => "Terminale T12";
const stateLabel = (value: string) => ({
  pending:"En attente", active:"Actif", rejected:"Rejeté", suspended:"Suspendu", approved:"Validé",
  expired:"Expiré", revoked:"Révoqué", draft:"Brouillon", published:"Publié", archived:"Archivé",
  cancelled:"Annulé", not_started:"À commencer", in_progress:"En cours", completed:"Terminé", needs_support:"À accompagner"
} as Record<string,string>)[value] ?? value;

const styles = [
  ".felix-workspace{--fx-ink:#172b31;--fx-muted:#71848a;--fx-line:#e3eceb;--fx-teal:#176d68;color:var(--fx-ink);padding:0 0 28px}",
  ".felix-head{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:18px}",
  ".felix-brand{display:flex;align-items:center;gap:12px}.felix-mark{width:46px;height:46px;border-radius:15px;background:linear-gradient(145deg,#4d61a1,#24345f);color:white;display:grid;place-items:center;font:800 23px Arial;box-shadow:0 8px 20px #24345f22}.felix-brand h2{margin:0;font:800 20px Arial;letter-spacing:-.04em}.felix-brand p{margin:4px 0 0;color:var(--fx-muted);font-size:10px;line-height:1.6}",
  ".felix-tags{display:flex;gap:7px;flex-wrap:wrap}.felix-tag{padding:7px 10px;border-radius:999px;background:#eef2ff;color:#455b9b;font-size:9px;font-weight:800;letter-spacing:.05em}.felix-tag.mint{background:#e7f4ef;color:#236b5d}",
  ".felix-notice{border:1px solid #dfe9f3;border-radius:12px;padding:12px 14px;background:#f3f7fc;color:#5c7185;font-size:10px;line-height:1.7;margin-bottom:16px}.felix-notice strong{color:#35536d}",
  ".felix-tabs{display:flex;gap:7px;overflow-x:auto;padding:4px 0 12px;margin-bottom:12px;border-bottom:1px solid var(--fx-line)}.felix-tab{white-space:nowrap;min-height:42px;padding:9px 13px;border-radius:10px;border:1px solid transparent;background:transparent;color:#6f8187;font-size:10px;font-weight:750;cursor:pointer}.felix-tab.active{background:#eaf4f1;border-color:#d8eae4;color:#155f58}",
  ".felix-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0}.felix-kpi{padding:15px;border:1px solid var(--fx-line);border-radius:13px;background:white;min-width:0}.felix-kpi small{display:block;color:var(--fx-muted);font-size:9px;line-height:1.5}.felix-kpi strong{display:block;font:800 20px Arial;margin:6px 0 3px;overflow-wrap:anywhere}.felix-kpi span{font-size:9px;color:#9aa8aa}",
  ".felix-panel{background:white;border:1px solid var(--fx-line);border-radius:14px;padding:17px;margin:12px 0;min-width:0}.felix-panel-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:13px}.felix-panel-heading h3{font:800 15px Arial;margin:0}.felix-panel-heading p{font-size:10px;color:var(--fx-muted);line-height:1.65;margin:5px 0 0}",
  ".felix-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.felix-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.felix-field{display:flex;flex-direction:column;gap:6px;min-width:0}.felix-field.wide{grid-column:1/-1}.felix-field label{font-size:10px;font-weight:750;color:#53686d}.felix-field input,.felix-field select,.felix-field textarea{width:100%;min-height:43px;border:1px solid #dce7e4;border-radius:9px;padding:10px 11px;background:#fbfdfc;color:#233a3c;font:inherit;font-size:11px}.felix-field textarea{min-height:78px;resize:vertical}.felix-check{display:flex;align-items:flex-start;gap:9px;grid-column:1/-1;padding:11px;border-radius:9px;background:#f5f8f7;color:#65797a;font-size:10px;line-height:1.6}.felix-check input{margin-top:2px;min-width:17px;min-height:17px}",
  ".felix-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;grid-column:1/-1;margin-top:3px}.felix-btn{min-height:42px;padding:10px 14px;border:0;border-radius:9px;background:#1c7169;color:white;font-size:10px;font-weight:800;cursor:pointer}.felix-btn.secondary{border:1px solid #dbe8e3;background:white;color:#246b62}.felix-btn.danger{background:#a44343}.felix-btn:disabled{opacity:.55;cursor:not-allowed}.felix-help{font-size:9px;color:#829397;line-height:1.6}",
  ".felix-table-wrap{width:100%;overflow-x:auto}.felix-table{border-collapse:collapse;width:100%;min-width:620px}.felix-table th{font-size:9px;color:#819196;text-align:left;padding:10px;border-bottom:1px solid var(--fx-line);font-weight:800}.felix-table td{font-size:10px;color:#566c70;padding:11px 10px;border-bottom:1px solid #edf2f0;vertical-align:top}.felix-table td strong{color:#263e42}.felix-table td small{display:block;color:#89989a;margin-top:4px;line-height:1.5}",
  ".felix-status{display:inline-flex;padding:5px 8px;border-radius:999px;background:#f0f3f2;color:#657a79;font-size:8px;font-weight:800}.felix-status.active,.felix-status.approved,.felix-status.published,.felix-status.completed{background:#e6f4ee;color:#267058}.felix-status.pending,.felix-status.draft,.felix-status.in_progress{background:#fff4df;color:#98702d}.felix-status.rejected,.felix-status.suspended,.felix-status.needs_support{background:#faeceb;color:#9a4842}",
  ".felix-empty{padding:24px;text-align:center;color:#869799;background:#f8fbfa;border:1px dashed #dbe7e3;border-radius:11px;font-size:10px;line-height:1.8}.felix-empty strong{display:block;color:#50686a;font-size:12px;margin-bottom:4px}",
  ".felix-card{border:1px solid var(--fx-line);border-radius:12px;padding:14px;background:#fff}.felix-card h4{margin:0 0 6px;font:750 12px Arial}.felix-card p{margin:0;color:var(--fx-muted);font-size:10px;line-height:1.7}.felix-card small{display:block;margin-top:9px;color:#8a999a;font-size:9px}",
  ".felix-links{display:flex;gap:8px;flex-wrap:wrap}.felix-links a{color:#286d67;font-size:10px;font-weight:750;text-decoration:none;border:1px solid #dbe9e4;border-radius:8px;padding:9px 11px;background:#f9fcfa}",
  ".felix-error{padding:11px 13px;background:#fff0ef;border:1px solid #f0d3d0;border-radius:9px;color:#984d48;font-size:10px;line-height:1.6;margin-bottom:12px}.felix-success{padding:11px 13px;background:#edf8f2;border:1px solid #d1eadc;border-radius:9px;color:#2d7559;font-size:10px;line-height:1.6;margin-bottom:12px}",
  "@media(max-width:900px){.felix-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){.felix-grid,.felix-form{grid-template-columns:1fr}.felix-field.wide,.felix-check,.felix-actions{grid-column:auto}.felix-panel{padding:13px}.felix-brand h2{font-size:17px}.felix-kpi strong{font-size:17px}}"
].join("\n") + "\n" + ".felix-head{padding:19px 22px;border:1px solid #e0e9f1;border-radius:18px;background:linear-gradient(115deg,#fff 0%,#f1f6ff 65%,#e9f6f2 100%);box-shadow:0 12px 32px rgba(22,48,82,.07);margin-bottom:14px;position:relative;overflow:hidden}\n.felix-head:after{content:'';position:absolute;right:-45px;top:-75px;width:220px;height:220px;border:1px solid rgba(48,102,155,.14);border-radius:50%;box-shadow:0 0 0 24px rgba(48,102,155,.035),0 0 0 50px rgba(48,102,155,.025);pointer-events:none}\n.felix-brand{position:relative;z-index:1}.felix-mark{width:52px;height:52px;border-radius:16px;background:linear-gradient(145deg,#176c91,#15345f 65%,#247f79);box-shadow:0 10px 24px #17395d2b}\n.felix-brand h2{font-size:22px;color:#153556;letter-spacing:-.035em}.felix-brand p{font-size:10px;color:#607b92}\n.felix-tags{position:relative;z-index:1;gap:6px}.felix-tag{padding:8px 11px;border:1px solid #d9e5f0;background:#edf4fc;color:#27557f;font-size:8px;letter-spacing:.08em}.felix-tag.mint{background:#e8f5ef;border-color:#cfe8db;color:#236c56}\n.felix-notice{border-radius:13px;padding:13px 16px;background:linear-gradient(110deg,#eef5ff,#eef8f4);border-color:#d6e5f1;color:#4b687f;font-size:10px;box-shadow:0 6px 18px rgba(23,59,89,.035)}\n.felix-app-layout{display:grid;grid-template-columns:236px minmax(0,1fr);gap:17px;align-items:start;margin-top:16px}\n.felix-app-sidebar{position:sticky;top:18px;min-width:0;border-radius:17px;padding:16px 13px 14px;background:linear-gradient(160deg,#102b4f 0%,#173d68 62%,#0f4c81 100%);color:#fff;box-shadow:0 16px 34px rgba(9,35,66,.18);border:1px solid rgba(255,255,255,.08)}\n.felix-menu-title{margin:2px 8px 17px;color:#a9c7e6;font-size:9px;font-weight:900;letter-spacing:.16em}\n.felix-menu-group{margin:15px 8px 7px;color:#79abd5;font-size:8px;font-weight:900;letter-spacing:.14em}.felix-menu-group:first-child{margin-top:0}\n.felix-tabs{display:flex;flex-direction:column;gap:6px;overflow:visible;padding:0 0 13px;margin:0;border:0}\n.felix-tab{display:grid;grid-template-columns:34px minmax(0,1fr) 12px;align-items:center;gap:9px;width:100%;min-height:53px;padding:8px 9px;border:1px solid transparent;border-radius:11px;background:rgba(255,255,255,.045);color:#dce9f7;text-align:left;white-space:normal;transition:transform .16s ease,background .16s ease,border-color .16s ease,box-shadow .16s ease}\n.felix-tab:hover{transform:translateX(2px);background:rgba(255,255,255,.1);border-color:rgba(180,213,243,.17);color:#fff}\n.felix-tab.active{background:linear-gradient(105deg,#237f86,#2861a1);border-color:rgba(180,226,235,.48);color:#fff;box-shadow:0 8px 20px rgba(1,18,44,.24)}\n.felix-menu-icon{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,.1);color:#b9d8f5;font-size:16px;font-weight:800}\n.felix-tab.active .felix-menu-icon{background:rgba(255,255,255,.18);color:#fff}\n.felix-menu-copy{display:grid;gap:3px;min-width:0}.felix-menu-copy strong{font-size:10px;font-weight:850;line-height:1.25}.felix-menu-copy small{font-size:8px;line-height:1.35;color:#a9c3dd}.felix-tab.active .felix-menu-copy small{color:#dbeeff}\n.felix-menu-arrow{font-size:19px;color:#92b1d0;text-align:right}.felix-tab.active .felix-menu-arrow{color:#fff}\n.felix-sidebar-badge{display:flex;align-items:center;gap:10px;padding:12px 9px;margin-top:5px;border-top:1px solid rgba(255,255,255,.15);background:rgba(6,21,42,.18);border-radius:0 0 10px 10px}.felix-sidebar-badge-icon{width:40px;height:38px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(145deg,#e8f6f1,#bddbd8);color:#174f68;font:900 12px Arial;letter-spacing:.04em}.felix-sidebar-badge strong{display:block;font-size:10px}.felix-sidebar-badge small{display:block;margin-top:3px;color:#a9c3dd;font-size:8px}\n.felix-main-content{min-width:0;padding:0 0 24px}\n.felix-main-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:13px 17px;margin-bottom:12px;border:1px solid #dfe8f0;border-radius:13px;background:linear-gradient(100deg,#fff,#f4f8fc);box-shadow:0 6px 18px rgba(16,45,76,.035)}\n.felix-main-heading p{margin:0 0 5px;color:#7390a9;font-size:8px;font-weight:900;letter-spacing:.15em}.felix-main-heading h3{margin:0;color:#183b5e;font:850 16px Arial;letter-spacing:-.025em}\n.felix-class-pill{padding:7px 10px;border-radius:999px;background:#e8f4ef;border:1px solid #d2e9dd;color:#286d56;font-size:8px;font-weight:900;letter-spacing:.07em}\n.felix-static-value{display:flex;flex-direction:column;justify-content:center;gap:3px;min-height:43px;padding:8px 11px;border:1px solid #d5e3ee;border-radius:9px;background:linear-gradient(100deg,#eff5fb,#f4faf7);color:#204e70;font-size:11px;font-weight:850}.felix-static-value span{color:#7790a2;font-size:8px;font-weight:600}\n.felix-kpis{gap:12px}.felix-kpi{position:relative;overflow:hidden;border-radius:15px;padding:17px;border-color:#e0e9f1;box-shadow:0 8px 22px rgba(15,46,75,.045);transition:transform .18s ease,box-shadow .18s ease}.felix-kpi:hover{transform:translateY(-2px);box-shadow:0 14px 28px rgba(15,46,75,.09)}.felix-kpi:after{content:'';position:absolute;right:-22px;top:-34px;width:95px;height:95px;border-radius:50%;background:rgba(44,113,157,.055)}.felix-kpi:nth-child(2){background:linear-gradient(145deg,#fff,#fff8ed)}.felix-kpi:nth-child(3){background:linear-gradient(145deg,#fff,#eef8f4)}.felix-kpi:nth-child(4){background:linear-gradient(145deg,#fff,#f2f3ff)}\n.felix-kpi strong{font-size:22px;color:#173e62}.felix-kpi small{font-size:9px;font-weight:750;color:#607b91}.felix-kpi span{font-size:8px;color:#8fa0ac}\n.felix-panel{border-radius:16px;border-color:#e0e9f1;padding:18px;box-shadow:0 9px 25px rgba(13,43,74,.045)}.felix-panel-heading h3{font-size:15px;color:#1c4264}.felix-panel-heading p{font-size:9px;color:#7890a2}\n.felix-card{border-radius:14px;border-color:#e0eaf2;box-shadow:0 7px 20px rgba(16,48,77,.045);transition:transform .18s ease,box-shadow .18s ease}.felix-card:hover{transform:translateY(-2px);box-shadow:0 13px 26px rgba(16,48,77,.08)}.felix-card h4{font-size:12px;color:#1d476b}.felix-card p{font-size:9px}\n.felix-btn{border-radius:10px;background:linear-gradient(110deg,#176e87,#1c6d68);box-shadow:0 6px 14px rgba(22,103,122,.16);font-size:9px}.felix-btn.secondary{box-shadow:none}.felix-btn.danger{background:linear-gradient(110deg,#aa4545,#8f353c)}\n.felix-field label{font-size:9px;color:#45637a}.felix-field input,.felix-field select,.felix-field textarea{border-radius:10px;border-color:#d6e3ed;background:#fbfdff}.felix-field input:focus,.felix-field select:focus,.felix-field textarea:focus{outline:3px solid rgba(32,115,155,.14);border-color:#5291b2}\n.felix-table{min-width:660px}.felix-table th{background:#f3f7fa;color:#58758d;font-size:8px;letter-spacing:.07em;text-transform:uppercase}.felix-table td{font-size:9px}.felix-table tbody tr:hover{background:#f6fafc}\n.felix-links a{background:#f5f9fc;border-color:#dce8f0;border-radius:10px}.felix-links a:hover{background:#eaf3fa;border-color:#afcadb}\n@media(max-width:1050px){.felix-app-layout{grid-template-columns:210px minmax(0,1fr);gap:12px}.felix-app-sidebar{padding:13px 10px}.felix-tab{grid-template-columns:30px minmax(0,1fr) 10px;gap:7px}.felix-menu-icon{width:29px;height:29px}}\n@media(max-width:700px){.felix-head{padding:15px}.felix-app-layout{grid-template-columns:minmax(0,1fr);gap:12px}.felix-app-sidebar{position:static;min-height:0;padding:12px;border-radius:14px}.felix-menu-title{margin:0 5px 10px}.felix-tabs{display:flex;flex-direction:row;overflow-x:auto;padding:0 0 5px;gap:6px}.felix-menu-group{display:none}.felix-tab{flex:0 0 184px;grid-template-columns:29px minmax(0,1fr);min-height:54px}.felix-menu-arrow{display:none}.felix-sidebar-badge{display:none}.felix-main-heading{align-items:flex-start}.felix-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.felix-main-content>.felix-grid{grid-template-columns:1fr}}";

export default function FelixWorkspace({ userRole }: { userRole: string }) {
  const manager = ["owner", "admin", "editor"].includes(userRole);
  const [tab, setTab] = useState<Tab>("overview");
  const [userId, setUserId] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [ledger, setLedger] = useState<Ledger[]>([]);
  const [proofUrls, setProofUrls] = useState<Record<string,string>>({});
  const [notes, setNotes] = useState<Record<string,string>>({});
  const [series, setSeries] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const ownEnrollment = enrollments.find((row) => row.user_id === userId);
  const myTicket = tickets.find((row) => row.user_id === userId && row.status === "active" && new Date(row.valid_from) <= new Date() && new Date(row.valid_until) > new Date());
  const pending = payments.filter((row) => row.status === "pending");
  const activeTickets = tickets.filter((row) => row.status === "active" && new Date(row.valid_from) <= new Date() && new Date(row.valid_until) > new Date());
  const monthStartDate = new Date();
  const monthStart = monthStartDate.getFullYear() + "-" + String(monthStartDate.getMonth() + 1).padStart(2,"0") + "-01";
  const currentMonthPayment = payments.find((row) => row.period_month === monthStart && (row.status === "pending" || row.status === "approved"));
  const monthRows = ledger.filter((row) => row.entry_date >= monthStart);
  const income = monthRows.filter((row) => row.direction === "income").reduce((sum,row)=>sum+Number(row.amount_ariary),0);
  const expenses = monthRows.filter((row) => row.direction === "expense").reduce((sum,row)=>sum+Number(row.amount_ariary),0);
  const availableTracks = tracks.filter((row) => T12_TRACK_CODES.includes(row.track_code as typeof T12_TRACK_CODES[number]) && row.status !== "retired" && row.levels.includes("terminale"));

  async function refresh() {
    setLoading(true); setError("");
    const supabase = createClient();
    if (!supabase) { setError("La connexion Supabase n'est pas configurée."); setLoading(false); return; }
    const auth = await supabase.auth.getUser();
    if (!auth.data.user) { setError("Une connexion est nécessaire pour accéder à FELIX."); setLoading(false); return; }
    const uid = auth.data.user.id;
    setUserId(uid);
    const baseEnroll = supabase.from("education_enrollments").select("*").order("created_at",{ascending:false}).limit(200);
    const basePay = supabase.from("education_payments").select("*").order("created_at",{ascending:false}).limit(300);
    const baseTicket = supabase.from("education_tickets").select("*").order("valid_until",{ascending:false}).limit(300);
    const baseProgress = supabase.from("education_progress").select("*").order("created_at",{ascending:false}).limit(300);
    const results = await Promise.all([
      supabase.from("education_tracks").select("track_code,label,levels,status,notes").in("track_code", [...T12_TRACK_CODES]).order("label"),
      manager ? baseEnroll : baseEnroll.eq("user_id",uid),
      manager ? basePay : basePay.eq("user_id",uid),
      manager ? baseTicket : baseTicket.eq("user_id",uid),
      supabase.from("education_courses").select("*").order("created_at",{ascending:false}).limit(120),
      supabase.from("education_sessions").select("*").order("starts_at",{ascending:true}).limit(180),
      manager ? baseProgress : baseProgress.eq("student_user_id",uid),
      manager ? supabase.from("education_ledger").select("*").order("entry_date",{ascending:false}).limit(300) : Promise.resolve({data:[],error:null})
    ]);
    const firstError = results.map((row:any)=>row.error).find(Boolean);
    if (firstError) setError(firstError.message);
    setTracks((results[0].data ?? []) as Track[]);
    setEnrollments((results[1].data ?? []) as Enrollment[]);
    const nextPayments = (results[2].data ?? []) as Payment[];
    setPayments(nextPayments);
    setTickets((results[3].data ?? []) as Ticket[]);
    setCourses((results[4].data ?? []) as Course[]);
    setSessions((results[5].data ?? []) as Session[]);
    setProgress((results[6].data ?? []) as Progress[]);
    setLedger((results[7].data ?? []) as Ledger[]);
    const signed: Record<string,string> = {};
    if (manager) {
      await Promise.all(nextPayments.filter((p)=>p.status==="pending").map(async(p)=>{
        const result = await supabase.storage.from("felix-payment-proofs").createSignedUrl(p.proof_path,3600);
        if (result.data?.signedUrl) signed[p.id] = result.data.signedUrl;
      }));
    }
    setProofUrls(signed);
    setLoading(false);
  }

  useEffect(() => { void refresh(); }, [manager]);

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const supabase = createClient();
    if (!supabase || !userId) { setError("Connexion indisponible."); return; }
    if (!MVOLA_NUMBER) { setError("Le numéro MVola officiel n’a pas encore été configuré par le gestionnaire. Aucun paiement ne doit être envoyé avant sa communication."); return; }
    if (currentMonthPayment) { setError("Un paiement est déjà en attente ou validé pour ce mois. Consultez son statut avant un nouvel envoi."); return; }
    const proof = form.get("proof") as File | null;
    const allowed = ["image/jpeg","image/png","image/webp","application/pdf"];
    if (!proof || proof.size < 1 || !allowed.includes(proof.type) || proof.size > 5*1024*1024) {
      setError("La preuve MVola est obligatoire : JPG, PNG, WEBP ou PDF, 5 Mo maximum."); return;
    }
    setBusy(true); setError(""); setMessage("");
    let enrollmentId = ownEnrollment?.id;
    if (!enrollmentId) {
      if (!form.get("guardian_consent")) { setError("L'accord parental ou du tuteur doit être confirmé si l'apprenant est mineur."); setBusy(false); return; }
      const { data: enrollment, error: enrollmentError } = await supabase.from("education_enrollments").insert({
        user_id:userId,
        student_name:String(form.get("student_name")??"").trim(),
        contact_phone:String(form.get("contact_phone")??"").trim()||null,
        level:"terminale",
        series_code:String(form.get("series_code")??""),
        school_year:SCHOOL_YEAR,
        guardian_consent_confirmed:true,
        status:"pending"
      }).select("*").single();
      if (enrollmentError || !enrollment) { setError(enrollmentError?.message??"Inscription impossible."); setBusy(false); return; }
      enrollmentId = enrollment.id;
    }
    const ext = proof.type==="image/jpeg"?"jpg":proof.type==="image/png"?"png":proof.type==="image/webp"?"webp":"pdf";
    const proofPath = userId + "/" + crypto.randomUUID() + "." + ext;
    const upload = await supabase.storage.from("felix-payment-proofs").upload(proofPath,proof,{contentType:proof.type,upsert:false});
    if (upload.error) { setError("Téléversement impossible : "+upload.error.message); setBusy(false); return; }
    const now = new Date();
    const period = now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-01";
    const payment = await supabase.from("education_payments").insert({
      enrollment_id:enrollmentId,user_id:userId,period_month:period,amount_ariary:FEE,
      payment_method:"MVola",transaction_reference:String(form.get("reference")??"").trim()||null,
      proof_path:proofPath,status:"pending"
    });
    if (payment.error) { setError("La preuve a été téléversée, mais le dossier de paiement n'a pas pu être créé : "+payment.error.message); setBusy(false); await refresh(); return; }
    setMessage("Dossier transmis. Le gestionnaire vérifiera manuellement le paiement avant l'émission du ticket mensuel.");
    formEl.reset(); setBusy(false); await refresh();
  }

  async function decidePayment(payment:Payment, decision:"approved"|"rejected") {
    const supabase = createClient();
    if (!supabase || !manager) return;
    const reason = (notes[payment.id]??"").trim();
    if (decision==="rejected" && !reason) { setError("Saisissez un motif avant le rejet."); return; }
    setBusy(true); setError(""); setMessage("");
    const auth = await supabase.auth.getUser();
    const result = await supabase.from("education_payments").update({
      status:decision,reviewed_by:auth.data.user?.id??null,reviewed_at:new Date().toISOString(),
      rejection_reason:decision==="rejected"?reason:null
    }).eq("id",payment.id).eq("status","pending");
    if (result.error) setError(result.error.message);
    else setMessage(decision==="approved"?"Paiement validé : ticket d'accès d'un mois et recette comptable émis.":"Preuve rejetée. L'apprenant pourra déposer une nouvelle preuve.");
    setBusy(false); await refresh();
  }

  async function createCourse(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl=event.currentTarget; const f=new FormData(formEl); const supabase=createClient();
    if(!supabase||!userId) return;
    setBusy(true);setError("");setMessage("");
    const chosenLevel="terminale";
    const chosenSeries=String(f.get("series_code")??"");
    const validTrack=tracks.find((row)=>row.track_code===chosenSeries&&T12_TRACK_CODES.includes(row.track_code as typeof T12_TRACK_CODES[number])&&row.levels.includes(chosenLevel));
    if(!validTrack){setError("Cette série n'est pas référencée pour le niveau choisi. Vérifiez le référentiel MEN.");setBusy(false);return;}
    const result=await supabase.from("education_courses").insert({
      title:String(f.get("title")??"").trim(),subject:String(f.get("subject")??"").trim(),
      level:chosenLevel,series_code:chosenSeries,
      description:String(f.get("description")??"").trim(),status:"draft",created_by:userId
    });
    if(result.error)setError(result.error.message);else{setMessage("Cours enregistré en brouillon. Vérifiez le programme MEN avant publication.");formEl.reset();}
    setBusy(false);await refresh();
  }

  async function publishCourse(course:Course) {
    const supabase=createClient();if(!supabase)return;
    setBusy(true);const result=await supabase.from("education_courses").update({status:"published",updated_at:new Date().toISOString()}).eq("id",course.id);
    if(result.error)setError(result.error.message);else setMessage("Cours publié aux élèves disposant d'un ticket actif dans cette série.");
    setBusy(false);await refresh();
  }

  async function createSession(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();const formEl=event.currentTarget;const f=new FormData(formEl);const supabase=createClient();
    if(!supabase||!userId)return;
    const start=String(f.get("starts_at")??"");const end=String(f.get("ends_at")??"");
    if(!start||!end||new Date(end)<=new Date(start)){setError("La fin de séance doit être postérieure au début.");return;}
    setBusy(true);setError("");setMessage("");
    const result=await supabase.from("education_sessions").insert({
      course_id:String(f.get("course_id")??""),title:String(f.get("title")??"").trim(),
      starts_at:new Date(start).toISOString(),ends_at:new Date(end).toISOString(),
      location:String(f.get("location")??"").trim()||null,
      meeting_url:String(f.get("meeting_url")??"").trim()||null,status:"draft",created_by:userId
    });
    if(result.error)setError(result.error.message);else{setMessage("Séance enregistrée en brouillon.");formEl.reset();}
    setBusy(false);await refresh();
  }

  async function publishSession(session:Session) {
    const supabase=createClient();if(!supabase)return;
    setBusy(true);const result=await supabase.from("education_sessions").update({status:"published"}).eq("id",session.id);
    if(result.error)setError(result.error.message);else setMessage("Séance publiée dans le calendrier des élèves autorisés.");
    setBusy(false);await refresh();
  }

  async function recordProgress(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();const formEl=event.currentTarget;const f=new FormData(formEl);const supabase=createClient();
    if(!supabase||!userId)return;
    const scoreRaw=String(f.get("score")??"").trim();const maxRaw=String(f.get("max_score")??"").trim();
    if(Boolean(scoreRaw)!==Boolean(maxRaw)){setError("Renseignez à la fois le résultat et le maximum, ou laissez les deux vides.");return;}
    setBusy(true);setError("");setMessage("");
    const result=await supabase.from("education_progress").insert({
      student_user_id:String(f.get("student_user_id")??""),course_id:String(f.get("course_id")??"")||null,
      activity_type:String(f.get("activity_type")??""),mastery_status:String(f.get("mastery_status")??"in_progress"),
      score:scoreRaw?Number(scoreRaw):null,max_score:maxRaw?Number(maxRaw):null,
      feedback:String(f.get("feedback")??"").trim()||null,recorded_by:userId
    });
    if(result.error)setError(result.error.message);else{setMessage("Suivi enregistré et rendu visible à l'apprenant concerné.");formEl.reset();}
    setBusy(false);await refresh();
  }

  async function addLedger(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();const formEl=event.currentTarget;const f=new FormData(formEl);const supabase=createClient();
    if(!supabase||!userId)return;
    setBusy(true);setError("");setMessage("");
    const result=await supabase.from("education_ledger").insert({
      direction:String(f.get("direction")??"expense"),category:String(f.get("category")??"").trim(),
      description:String(f.get("description")??"").trim(),amount_ariary:Number(f.get("amount")??0),
      entry_date:String(f.get("entry_date")??""),created_by:userId
    });
    if(result.error)setError(result.error.message);else{setMessage("Écriture ajoutée au journal FELIX.");formEl.reset();}
    setBusy(false);await refresh();
  }

  const trackName=(code:string)=>tracks.find((row)=>row.track_code===code)?.label??code;
  const learnerName=(uid:string)=>enrollments.find((row)=>row.user_id===uid)?.student_name??"Apprenant";
  const courseName=(id?:string|null)=>courses.find((row)=>row.id===id)?.title??"Cours";
  const activeStudents=enrollments.filter((row)=>row.status==="active").length;
  const publishedCourses=courses.filter((row)=>row.status==="published");
  const learnerCourses=courses.filter((row)=>row.status==="published");
  const learnerSessions=sessions.filter((row)=>row.status==="published"&&new Date(row.ends_at)>=new Date());
  const ownProgress=progress.filter((row)=>row.student_user_id===userId);

  return <section className="felix-workspace">
    <style>{styles}</style>
    <header className="felix-head"><div className="felix-brand"><span className="felix-mark">F</span><div><h2>FELIX <span style={{fontWeight:500,color:"#71848a"}}>· Terminale T12</span></h2><p>Enseignement malagasy · Classe unique T12 · Séries L, S et OSE</p></div></div><div className="felix-tags"><span className="felix-tag">TERMINALE T12</span><span className="felix-tag mint">RÉFÉRENTIEL MEN</span><span className="felix-tag">{manager?"ESPACE GESTIONNAIRE":"ESPACE APPRENANT"}</span></div></header>
    <div className="felix-notice"><strong>Abonnement pédagogique FELIX : 7 500 Ar par mois.</strong> Il s'agit d'un accès privé aux cours numériques de la plateforme, pas d'un droit d'inscription officiel du MEN ni de frais d'inscription dans un lycée public. La preuve MVola est vérifiée manuellement avant l'émission du ticket mensuel.</div>
    {error?<div className="felix-error" role="alert">{error}</div>:null}
    {message?<div className="felix-success" role="status">{message}</div>:null}
    <div className="felix-app-layout">
      <aside className="felix-app-sidebar">
        <p className="felix-menu-title">MENU PRINCIPAL</p>
        <nav className="felix-tabs" aria-label="Navigation FELIX">
          <p className="felix-menu-group">PILOTAGE</p>
          <button className={tab==="overview"?"felix-tab active":"felix-tab"} type="button" onClick={()=>setTab("overview")}><span className="felix-menu-icon">⌂</span><span className="felix-menu-copy"><strong>Tableau de bord</strong><small>Indicateurs et synthèse</small></span><span className="felix-menu-arrow">›</span></button>
          <p className="felix-menu-group">ESPACE TERMINALE T12</p>
          <button className={tab==="register"?"felix-tab active":"felix-tab"} type="button" onClick={()=>setTab("register")}><span className="felix-menu-icon">♙</span><span className="felix-menu-copy"><strong>{manager?"Élèves & inscriptions":"Mon inscription"}</strong><small>{manager?"Dossiers et accès":"Ticket et paiements"}</small></span><span className="felix-menu-arrow">›</span></button>
          <button className={tab==="courses"?"felix-tab active":"felix-tab"} type="button" onClick={()=>setTab("courses")}><span className="felix-menu-icon">▤</span><span className="felix-menu-copy"><strong>Cours & calendrier</strong><small>Parcours, séances et matières</small></span><span className="felix-menu-arrow">›</span></button>
          <button className={tab==="progress"?"felix-tab active":"felix-tab"} type="button" onClick={()=>setTab("progress")}><span className="felix-menu-icon">◷</span><span className="felix-menu-copy"><strong>{manager?"Suivi pédagogique":"Mon suivi"}</strong><small>Présence, travaux et évaluations</small></span><span className="felix-menu-arrow">›</span></button>
          {manager?<><p className="felix-menu-group">GESTION FINANCIÈRE</p><button className={tab==="accounting"?"felix-tab active":"felix-tab"} type="button" onClick={()=>setTab("accounting")}><span className="felix-menu-icon">◈</span><span className="felix-menu-copy"><strong>Comptabilité</strong><small>Recettes, dépenses et journal</small></span><span className="felix-menu-arrow">›</span></button></>:null}
        </nav>
        <div className="felix-sidebar-badge"><span className="felix-sidebar-badge-icon">T12</span><div><strong>Terminale T12</strong><small>Parcours L · S · OSE</small></div></div>
      </aside>
      <div className="felix-main-content">
        <div className="felix-main-heading"><div><p>{tab==="overview"?"ESPACE DE PILOTAGE":tab==="register"?"INSCRIPTIONS & ACCÈS":tab==="courses"?"ENSEIGNEMENTS & CALENDRIER":tab==="progress"?"VIE SCOLAIRE & PROGRESSION":"GESTION FINANCIÈRE"}</p><h3>{tab==="overview"?"Vue générale":tab==="register"?(manager?"Gestion des élèves T12":"Mon inscription"):tab==="courses"?"Cours et séances":tab==="progress"?(manager?"Suivi des apprenants T12":"Mon suivi pédagogique"):"Comptabilité pédagogique"}</h3></div><span className="felix-class-pill">CLASSE UNIQUE · T12</span></div>
    {loading?<div className="felix-empty">Chargement de l'espace FELIX…</div>:null}

    {!loading&&tab==="overview"&&manager?<>
      <div className="felix-kpis">
        <div className="felix-kpi"><small>Élèves inscrits actifs</small><strong>{activeStudents}</strong><span>dossiers validés</span></div>
        <div className="felix-kpi"><small>Preuves en attente</small><strong>{pending.length}</strong><span>vérification manuelle</span></div>
        <div className="felix-kpi"><small>Tickets actifs</small><strong>{activeTickets.length}</strong><span>validité en cours</span></div>
        <div className="felix-kpi"><small>Solde net du mois</small><strong>{money(income-expenses)}</strong><span>journal FELIX</span></div>
      </div>
      <div className="felix-grid"><article className="felix-card"><h4>Gestion pédagogique</h4><p>{publishedCourses.length} cours publiés et {sessions.filter(s=>s.status==="published").length} séances publiées. Les brouillons ne sont pas visibles par les élèves.</p><small>Organisez les progressions de Terminale T12 par parcours et par matière.</small></article><article className="felix-card"><h4>Comptabilité de la plateforme</h4><p>Recettes : {money(income)} · Dépenses : {money(expenses)} · Net : {money(income-expenses)}.</p><small>Les paiements approuvés produisent une écriture de recette.</small></article></div>
      <div className="felix-panel"><div className="felix-panel-heading"><div><h3>Preuves de paiement à vérifier</h3><p>Le ticket n'est émis qu'après contrôle humain du justificatif MVola.</p></div><button className="felix-btn secondary" type="button" onClick={()=>setTab("register")}>Ouvrir les inscriptions</button></div>{pending.length===0?<div className="felix-empty">Aucune preuve en attente.</div>:<div className="felix-table-wrap"><table className="felix-table"><thead><tr><th>Apprenant</th><th>Période</th><th>Montant</th><th>Preuve</th><th>Référence</th><th>Action</th></tr></thead><tbody>{pending.slice(0,8).map((p)=><tr key={p.id}><td><strong>{learnerName(p.user_id)}</strong></td><td>{fmtDate(p.period_month)}</td><td>{money(p.amount_ariary)}</td><td>{proofUrls[p.id]?<a href={proofUrls[p.id]} target="_blank" rel="noreferrer">Ouvrir ↗</a>:"—"}</td><td>{p.transaction_reference||"—"}</td><td><button type="button" className="felix-btn" disabled={busy} onClick={()=>decidePayment(p,"approved")}>Valider</button></td></tr>)}</tbody></table></div>}</div>
    </>:null}

    {!loading&&tab==="overview"&&!manager?<>
      <div className="felix-kpis">
        <div className="felix-kpi"><small>Inscription</small><strong>{ownEnrollment?stateLabel(ownEnrollment.status):"À compléter"}</strong><span>{SCHOOL_YEAR}</span></div>
        <div className="felix-kpi"><small>Ticket d'accès</small><strong>{myTicket?"ACTIF":"INACTIF"}</strong><span>{myTicket?"Jusqu'au "+fmtDate(myTicket.valid_until):"Après validation du paiement"}</span></div>
        <div className="felix-kpi"><small>Cours publiés</small><strong>{learnerCourses.length}</strong><span>selon les droits d'accès</span></div>
        <div className="felix-kpi"><small>Activités suivies</small><strong>{ownProgress.length}</strong><span>dans mon espace</span></div>
      </div>
      <div className="felix-panel"><div className="felix-panel-heading"><div><h3>Bienvenue dans FELIX</h3><p>Inscrivez-vous, consultez le calendrier des séances et retrouvez les retours pédagogiques de votre parcours.</p></div><button className="felix-btn" type="button" onClick={()=>setTab(ownEnrollment?"courses":"register")}>{ownEnrollment?"Voir mes cours":"Commencer l'inscription"}</button></div>{myTicket?<p className="felix-help">Ticket {myTicket.ticket_code} valide jusqu'au {fmtDateTime(myTicket.valid_until)}.</p>:<p className="felix-help">L'accès au contenu des cours nécessite un ticket mensuel actif.</p>}</div>
    </>:null}

    {!loading&&tab==="overview"?<div className="felix-panel"><div className="felix-panel-heading"><div><h3>Références pédagogiques officielles</h3><p>Sources MEN consultées le 23 novembre 2026. Le millésime de chaque document doit être confirmé.</p></div></div><div className="felix-links">
      <a href="https://www.education.gov.mg/repartition-annuelle-du-programme-scolaire/" target="_blank" rel="noreferrer">Programmes annuels ↗</a>
      <a href="https://www.education.gov.mg/repartition-annuelle-du-programme-detudes/" target="_blank" rel="noreferrer">RAPE T11 / T12 ↗</a>
      <a href="https://www.education.gov.mg/systeme-educatif/lycee/" target="_blank" rel="noreferrer">Système éducatif · Lycée ↗</a>
      <a href="https://www.education.gov.mg/wp-content/uploads/2024/07/loi-2022-018-du-30-janvier-2023-2.pdf" target="_blank" rel="noreferrer">Loi n°2022-018 ↗</a>
    </div><p className="felix-help">Le portail MEN référence des documents A/C/D et L/OSE/S, ainsi que des ressources T11/T12. Les RAPE T12 repérés portent une édition 2024 : FELIX doit confirmer l'existence d'une édition plus récente avant de présenter ces documents comme applicables à l'année 2026-2027.</p></div>:null}

    {!loading&&tab==="register"&&!manager?<div className="felix-panel">
      <div className="felix-panel-heading"><div><h3>{ownEnrollment?"Renouveler mon accès":"Formulaire d'inscription pédagogique"}</h3><p>7 500 Ar · MVola obligatoire · ticket valable un mois après approbation.</p></div></div>
      {ownEnrollment?<div className="felix-notice">Dossier : <strong>{ownEnrollment.student_name}</strong> · {levelLabel(ownEnrollment.level)} · {trackName(ownEnrollment.series_code)} · statut <strong>{stateLabel(ownEnrollment.status)}</strong>. {ownEnrollment.review_note||""}</div>:null}
      {ownEnrollment?.status==="suspended"?<div className="felix-empty">Votre dossier est suspendu. Contactez le gestionnaire avant tout nouveau paiement.</div>:<form className="felix-form" onSubmit={submitPayment}>
        {!ownEnrollment?<><div className="felix-field"><label htmlFor="felix-student-name">Nom et prénom(s) *</label><input id="felix-student-name" name="student_name" required maxLength={160} autoComplete="name"/></div>
          <div className="felix-field"><label htmlFor="felix-student-phone">Téléphone (facultatif)</label><input id="felix-student-phone" name="contact_phone" type="tel" maxLength={32} autoComplete="tel"/></div>
          <div className="felix-field"><label>Classe concernée</label><div className="felix-static-value">Terminale T12 <span>Classe unique de la plateforme</span></div><input type="hidden" name="level" value="terminale"/></div>
          <div className="felix-field"><label htmlFor="felix-series">Série désirée *</label><select id="felix-series" name="series_code" value={series} onChange={e=>setSeries(e.target.value)} required><option value="">Choisir une série</option>{availableTracks.map(t=><option key={t.track_code} value={t.track_code}>{t.label}</option>)}</select></div>
          <label className="felix-check"><input type="checkbox" name="guardian_consent" required/><span>J'ai pris connaissance de l'utilisation des données pour gérer le compte et le suivi pédagogique. Si l'apprenant est mineur, l'accord du parent ou tuteur légal a été obtenu.</span></label></>:null}
        <div className="felix-field"><label htmlFor="felix-reference">Référence de transaction MVola (facultatif)</label><input id="felix-reference" name="reference" maxLength={100}/></div>
        <div className="felix-field"><label htmlFor="felix-proof">Preuve MVola obligatoire (JPG, PNG, WEBP ou PDF · 5 Mo maximum) *</label><input id="felix-proof" name="proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required/></div>
        <div className="felix-field wide"><div className="felix-notice"><strong>Montant : {money(FEE)}.</strong><br/>{MVOLA_NUMBER?"Numéro MVola officiel : "+MVOLA_NUMBER:"Le numéro MVola officiel doit être configuré par le gestionnaire avant l'ouverture des paiements."}<br/>Le dépôt de la preuve ne donne pas immédiatement accès aux cours.</div></div>
        <div className="felix-actions"><button className="felix-btn" type="submit" disabled={busy||!MVOLA_NUMBER||!!currentMonthPayment}>{busy?"Envoi…":"Envoyer mon dossier"}</button><span className="felix-help">Année scolaire déclarée : {SCHOOL_YEAR}.</span></div>
      </form>}
      <div style={{marginTop:18}}><h3 style={{fontSize:13}}>Mes paiements</h3>{payments.length===0?<div className="felix-empty">Aucun paiement enregistré.</div>:<div className="felix-table-wrap"><table className="felix-table"><thead><tr><th>Période</th><th>Montant</th><th>Statut</th><th>Motif</th></tr></thead><tbody>{payments.map(p=><tr key={p.id}><td>{fmtDate(p.period_month)}</td><td>{money(p.amount_ariary)}</td><td><span className={"felix-status "+p.status}>{stateLabel(p.status)}</span></td><td>{p.rejection_reason||"—"}</td></tr>)}</tbody></table></div>}</div>
    </div>:null}

    {!loading&&tab==="register"&&manager?<>
      <div className="felix-panel"><div className="felix-panel-heading"><div><h3>Élèves inscrits</h3><p>Liste réservée aux gestionnaires habilités; les données sont limitées à l'administration pédagogique.</p></div></div>{enrollments.length===0?<div className="felix-empty">Aucun dossier d'inscription.</div>:<div className="felix-table-wrap"><table className="felix-table"><thead><tr><th>Apprenant</th><th>Niveau / série</th><th>Année</th><th>Statut</th><th>Ticket</th></tr></thead><tbody>{enrollments.map(e=>{const ticket=tickets.find(t=>t.enrollment_id===e.id&&t.status==="active"&&new Date(t.valid_until)>new Date());return <tr key={e.id}><td><strong>{e.student_name}</strong><small>{e.contact_phone||"Contact non renseigné"}</small></td><td>{levelLabel(e.level)}<small>{trackName(e.series_code)}</small></td><td>{e.school_year}</td><td><span className={"felix-status "+e.status}>{stateLabel(e.status)}</span></td><td>{ticket?fmtDate(ticket.valid_until):"Inactif"}</td></tr>;})}</tbody></table></div>}</div>
      <div className="felix-panel"><div className="felix-panel-heading"><div><h3>Preuves de paiement à valider</h3><p>Contrôlez la preuve et la référence MVola auprès du canal officiel, sans confondre dépôt et encaissement.</p></div></div>{pending.length===0?<div className="felix-empty">Aucun paiement en attente.</div>:<div className="felix-table-wrap"><table className="felix-table"><thead><tr><th>Apprenant</th><th>Période</th><th>Montant</th><th>Preuve</th><th>Référence</th><th>Motif du rejet</th><th>Décision</th></tr></thead><tbody>{pending.map(p=><tr key={p.id}><td>{learnerName(p.user_id)}</td><td>{fmtDate(p.period_month)}</td><td>{money(p.amount_ariary)}</td><td>{proofUrls[p.id]?<a href={proofUrls[p.id]} target="_blank" rel="noreferrer">Ouvrir ↗</a>:"—"}</td><td>{p.transaction_reference||"—"}</td><td><input aria-label="Motif de rejet" value={notes[p.id]??""} onChange={e=>setNotes(v=>({...v,[p.id]:e.target.value}))} placeholder="Motif court"/></td><td><div className="felix-actions"><button className="felix-btn" type="button" disabled={busy} onClick={()=>decidePayment(p,"approved")}>Valider</button><button className="felix-btn danger" type="button" disabled={busy} onClick={()=>decidePayment(p,"rejected")}>Rejeter</button></div></td></tr>)}</tbody></table></div>}</div>
    </>:null}

    {!loading&&tab==="courses"&&manager?<div className="felix-grid">
      <div className="felix-panel"><div className="felix-panel-heading"><div><h3>Créer un cours</h3><p>Le cours sera créé en brouillon et restera invisible aux élèves jusqu'à publication.</p></div></div><form className="felix-form" onSubmit={createCourse}>
        <div className="felix-field wide"><label htmlFor="fx-course-title">Titre du cours *</label><input id="fx-course-title" name="title" required maxLength={180}/></div>
        <div className="felix-field"><label htmlFor="fx-course-subject">Matière *</label><input id="fx-course-subject" name="subject" required maxLength={100}/></div>
        <div className="felix-field"><label>Classe concernée</label><div className="felix-static-value">Terminale T12 <span>Progression pédagogique de Terminale</span></div><input type="hidden" name="level" value="terminale"/></div>
        <div className="felix-field wide"><label htmlFor="fx-course-series">Parcours T12 *</label><select id="fx-course-series" name="series_code" required><option value="">Choisir un parcours T12</option>{availableTracks.map(t=><option key={t.track_code} value={t.track_code}>{t.label}</option>)}</select></div>
        <div className="felix-field wide"><label htmlFor="fx-course-description">Objectifs / description</label><textarea id="fx-course-description" name="description" maxLength={4000}/></div>
        <div className="felix-actions"><button className="felix-btn" disabled={busy}>Créer le brouillon</button></div>
      </form></div>
      <div className="felix-panel"><div className="felix-panel-heading"><div><h3>Planifier une séance</h3><p>Une séance publiée est visible aux apprenants de la série qui ont un ticket actif.</p></div></div><form className="felix-form" onSubmit={createSession}>
        <div className="felix-field wide"><label htmlFor="fx-session-course">Cours *</label><select id="fx-session-course" name="course_id" required>{courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
        <div className="felix-field wide"><label htmlFor="fx-session-title">Titre de la séance *</label><input id="fx-session-title" name="title" required maxLength={180}/></div>
        <div className="felix-field"><label htmlFor="fx-session-start">Début *</label><input id="fx-session-start" name="starts_at" type="datetime-local" required/></div>
        <div className="felix-field"><label htmlFor="fx-session-end">Fin *</label><input id="fx-session-end" name="ends_at" type="datetime-local" required/></div>
        <div className="felix-field"><label htmlFor="fx-session-place">Salle / lieu</label><input id="fx-session-place" name="location"/></div>
        <div className="felix-field"><label htmlFor="fx-session-url">Lien de classe virtuelle</label><input id="fx-session-url" name="meeting_url" type="url" placeholder="https://…"/></div>
        <div className="felix-actions"><button className="felix-btn" disabled={busy||courses.length===0}>Créer la séance</button></div>
      </form></div>
    </div>:null}

    {!loading&&tab==="courses"&&manager?<div className="felix-panel"><div className="felix-panel-heading"><div><h3>Catalogue des cours</h3><p>Publiez les cours après vérification de leur série, programme, progression et année de référence.</p></div><span className="felix-status">{courses.length} cours</span></div>{courses.length===0?<div className="felix-empty">Aucun cours créé.</div>:<div className="felix-table-wrap"><table className="felix-table"><thead><tr><th>Cours</th><th>Niveau / série</th><th>Statut</th><th>Action</th></tr></thead><tbody>{courses.map(course=><tr key={course.id}><td><strong>{course.title}</strong><small>{course.subject}</small></td><td>{levelLabel(course.level)}<small>{trackName(course.series_code)}</small></td><td><span className={"felix-status "+course.status}>{stateLabel(course.status)}</span></td><td>{course.status==="draft"?<button className="felix-btn" type="button" disabled={busy} onClick={()=>publishCourse(course)}>Publier</button>:"—"}</td></tr>)}</tbody></table></div>}</div>:null}

    {!loading&&tab==="courses"&&!manager?<div className="felix-panel"><div className="felix-panel-heading"><div><h3>Mes cours et mon calendrier</h3><p>Les cours accessibles dépendent de votre parcours T12 et de la validité de votre ticket.</p></div></div>{learnerCourses.length===0?<div className="felix-empty">Aucun cours publié accessible. Vérifiez le statut de votre inscription et de votre ticket.</div>:<div className="felix-grid">{learnerCourses.map(c=><article key={c.id} className="felix-card"><h4>{c.title}</h4><p>{c.subject} · {levelLabel(c.level)} · {trackName(c.series_code)}</p><small>{c.description}</small></article>)}</div>}</div>:null}

    {!loading&&tab==="courses"?<div className="felix-panel"><div className="felix-panel-heading"><div><h3>{manager?"Séances et publication du calendrier":"Prochaines séances"}</h3><p>Les horaires sont affichés dans le fuseau de votre navigateur.</p></div></div>{(manager?sessions:learnerSessions).length===0?<div className="felix-empty">Aucune séance planifiée.</div>:<div className="felix-table-wrap"><table className="felix-table"><thead><tr><th>Date / heure</th><th>Séance</th><th>Cours</th><th>Statut</th>{manager?<th>Action</th>:null}</tr></thead><tbody>{(manager?sessions:learnerSessions).map(s=><tr key={s.id}><td>{fmtDateTime(s.starts_at)}<small>Fin : {fmtDateTime(s.ends_at)}</small></td><td><strong>{s.title}</strong><small>{s.location||""} {s.meeting_url?<a href={s.meeting_url} target="_blank" rel="noreferrer">Accéder ↗</a>:null}</small></td><td>{courseName(s.course_id)}</td><td><span className={"felix-status "+s.status}>{stateLabel(s.status)}</span></td>{manager?<td>{s.status==="draft"?<button className="felix-btn" type="button" disabled={busy} onClick={()=>publishSession(s)}>Publier</button>:"—"}</td>:null}</tr>)}</tbody></table></div>}</div>:null}

    {!loading&&tab==="progress"&&manager?<div className="felix-panel"><div className="felix-panel-heading"><div><h3>Enregistrer une activité pédagogique</h3><p>Présence, leçon, devoir ou évaluation formative. Le retour saisi est visible par l'apprenant concerné.</p></div></div><form className="felix-form" onSubmit={recordProgress}>
      <div className="felix-field"><label htmlFor="fx-progress-student">Apprenant *</label><select id="fx-progress-student" name="student_user_id" required>{enrollments.map(e=><option key={e.id} value={e.user_id}>{e.student_name}</option>)}</select></div>
      <div className="felix-field"><label htmlFor="fx-progress-course">Cours</label><select id="fx-progress-course" name="course_id"><option value="">Activité générale</option>{courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
      <div className="felix-field"><label htmlFor="fx-progress-type">Activité *</label><select id="fx-progress-type" name="activity_type"><option value="attendance">Présence</option><option value="lesson">Leçon</option><option value="assignment">Devoir</option><option value="quiz">Quiz interne</option><option value="assessment">Évaluation formative</option><option value="feedback">Retour pédagogique</option></select></div>
      <div className="felix-field"><label htmlFor="fx-progress-state">Avancement *</label><select id="fx-progress-state" name="mastery_status"><option value="in_progress">En cours</option><option value="completed">Terminé</option><option value="needs_support">À accompagner</option><option value="not_started">À commencer</option></select></div>
      <div className="felix-field"><label htmlFor="fx-progress-score">Résultat (facultatif)</label><input id="fx-progress-score" name="score" type="number" min="0" step="0.01"/></div>
      <div className="felix-field"><label htmlFor="fx-progress-max">Maximum (facultatif)</label><input id="fx-progress-max" name="max_score" type="number" min="0.01" step="0.01"/></div>
      <div className="felix-field wide"><label htmlFor="fx-progress-feedback">Commentaire pédagogique (visible par l'élève)</label><textarea id="fx-progress-feedback" name="feedback" maxLength={2000}/></div>
      <div className="felix-actions"><button className="felix-btn" disabled={busy||enrollments.length===0}>Enregistrer le suivi</button></div>
    </form></div>:null}

    {!loading&&tab==="progress"?<div className="felix-panel"><div className="felix-panel-heading"><div><h3>{manager?"Registre de suivi pédagogique":"Mon suivi pédagogique"}</h3><p>Historique des activités consignées de manière transparente.</p></div></div>{progress.length===0?<div className="felix-empty">Aucune activité enregistrée.</div>:<div className="felix-table-wrap"><table className="felix-table"><thead><tr>{manager?<th>Apprenant</th>:null}<th>Date</th><th>Activité</th><th>Avancement</th><th>Résultat</th><th>Commentaire</th></tr></thead><tbody>{progress.map(p=><tr key={p.id}>{manager?<td>{learnerName(p.student_user_id)}</td>:null}<td>{fmtDate(p.created_at)}</td><td>{stateLabel(p.activity_type)}</td><td><span className={"felix-status "+p.mastery_status}>{stateLabel(p.mastery_status)}</span></td><td>{p.score===null||p.score===undefined?"—":p.score+"/"+p.max_score}</td><td>{p.feedback||"—"}</td></tr>)}</tbody></table></div>}</div>:null}

    {!loading&&tab==="accounting"&&manager?<><div className="felix-kpis"><div className="felix-kpi"><small>Recettes du mois</small><strong>{money(income)}</strong></div><div className="felix-kpi"><small>Dépenses du mois</small><strong>{money(expenses)}</strong></div><div className="felix-kpi"><small>Solde net</small><strong>{money(income-expenses)}</strong></div><div className="felix-kpi"><small>Écritures du mois</small><strong>{monthRows.length}</strong></div></div>
      <div className="felix-grid"><div className="felix-panel"><div className="felix-panel-heading"><div><h3>Ajouter une écriture</h3><p>Les paiements d'abonnement approuvés sont enregistrés automatiquement.</p></div></div><form className="felix-form" onSubmit={addLedger}>
        <div className="felix-field"><label htmlFor="fx-ledger-direction">Sens *</label><select id="fx-ledger-direction" name="direction"><option value="expense">Dépense</option><option value="income">Autre recette</option></select></div>
        <div className="felix-field"><label htmlFor="fx-ledger-category">Catégorie *</label><input id="fx-ledger-category" name="category" required maxLength={80}/></div>
        <div className="felix-field wide"><label htmlFor="fx-ledger-description">Libellé *</label><input id="fx-ledger-description" name="description" required maxLength={300}/></div>
        <div className="felix-field"><label htmlFor="fx-ledger-amount">Montant (Ar) *</label><input id="fx-ledger-amount" name="amount" type="number" required min="1" step="1"/></div>
        <div className="felix-field"><label htmlFor="fx-ledger-date">Date *</label><input id="fx-ledger-date" name="entry_date" type="date" required defaultValue={new Date().getFullYear()+"-"+String(new Date().getMonth()+1).padStart(2,"0")+"-"+String(new Date().getDate()).padStart(2,"0")}/></div>
        <div className="felix-actions"><button className="felix-btn" disabled={busy}>Ajouter au journal</button></div>
      </form></div><div className="felix-panel"><div className="felix-panel-heading"><div><h3>Rapprochement mensuel</h3><p>Le journal FELIX ne remplace pas un relevé bancaire ou MVola officiel.</p></div></div><div className="felix-notice">Avant de clôturer le mois, comparez les paiements approuvés au relevé MVola et aux justificatifs originaux. Les preuves déposées mais non validées ne sont pas comptabilisées comme encaissées.</div></div></div>
      <div className="felix-panel"><div className="felix-panel-heading"><div><h3>Journal comptable pédagogique</h3><p>Recettes et dépenses enregistrées pour l'activité de la plateforme.</p></div></div>{ledger.length===0?<div className="felix-empty">Aucune écriture.</div>:<div className="felix-table-wrap"><table className="felix-table"><thead><tr><th>Date</th><th>Sens</th><th>Catégorie</th><th>Libellé</th><th>Montant</th></tr></thead><tbody>{ledger.map(row=><tr key={row.id}><td>{fmtDate(row.entry_date)}</td><td>{row.direction==="income"?"Recette":"Dépense"}</td><td>{row.category}</td><td>{row.description}</td><td>{money(row.amount_ariary)}</td></tr>)}</tbody></table></div>}</div>
    </>:null}
      </div>
    </div>
  </section>;
}
