import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const API = "https://crm-backend-jxjt.onrender.com";

const STATUS_CONFIG = {
  New:       { color: "#06B6D4", bg: "rgba(6,182,212,0.12)",   glow: "rgba(6,182,212,0.35)",   icon: "✦" },
  Contacted: { color: "#A78BFA", bg: "rgba(167,139,250,0.12)", glow: "rgba(167,139,250,0.35)", icon: "◎" },
  Closed:    { color: "#34D399", bg: "rgba(52,211,153,0.12)",  glow: "rgba(52,211,153,0.35)",  icon: "✔" },
};
const COLORS = ["#06B6D4", "#A78BFA", "#34D399"];

/* ── tiny responsive hook ── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.New;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 20,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
      border: `1px solid ${cfg.color}33`,
      boxShadow: `0 0 8px ${cfg.glow}`,
      whiteSpace: "nowrap",
    }}>{cfg.icon} {status}</span>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  const cfg = STATUS_CONFIG[name];
  return (
    <div style={{ background: "#0D1526", border: `1px solid ${cfg?.color}44`, borderRadius: 10, padding: "8px 12px" }}>
      <div style={{ color: cfg?.color, fontWeight: 700, fontSize: 12 }}>{name}</div>
      <div style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 800 }}>{value}</div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon, sub }) => (
  <div style={{
    background: "linear-gradient(135deg,#0D1526,#111827)",
    borderRadius: 14, padding: "16px 18px",
    border: `1px solid ${color}22`,
    position: "relative", overflow: "hidden",
    transition: "transform 0.2s",
  }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
  >
    <div style={{ position: "absolute", top: -16, right: -16, width: 64, height: 64, borderRadius: "50%", background: `radial-gradient(circle,${color}22 0%,transparent 70%)` }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
      <span style={{ fontSize: 10, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 16, background: `${color}18`, borderRadius: 7, padding: "3px 7px" }}>{icon}</span>
    </div>
    <div style={{ fontSize: 30, fontWeight: 800, color: "#F1F5F9", lineHeight: 1, letterSpacing: "-1px" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color, marginTop: 5, fontWeight: 500 }}>{sub}</div>}
  </div>
);

export default function App() {
  const isMobile = useIsMobile();
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [status, setStatus] = useState("New");
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [adding, setAdding] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const statuses = ["New", "Contacted", "Closed"];

  const getLeads = async () => {
    try { const res = await fetch(`${API}/leads`); setLeads(await res.json()); }
    catch (e) { console.error(e); }
  };
  useEffect(() => { getLeads(); }, []);

  const addLead = async () => {
    if (!name) return;
    setAdding(true);
    await fetch(`${API}/leads`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, company, dealValue, status }),
    });
    setName(""); setEmail(""); setPhone(""); setCompany(""); setDealValue(""); setStatus("New");
    setFormOpen(false);
    await getLeads();
    setAdding(false);
  };

  const deleteLead = async (id) => {
    setDeleteId(id);
    await fetch(`${API}/leads/${id}`, { method: "DELETE" });
    setDeleteId(null);
    getLeads();
  };

  const updateLead = async (id, cur) => {
    const next = statuses[(statuses.indexOf(cur) + 1) % statuses.length];
    await fetch(`${API}/leads/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    getLeads();
  };

  const filtered    = leads.filter(l => l.name?.toLowerCase().includes(search.toLowerCase()));
  const totalLeads  = leads.length;
  const newLeads    = leads.filter(l => l.status === "New").length;
  const contacted   = leads.filter(l => l.status === "Contacted").length;
  const closed      = leads.filter(l => l.status === "Closed").length;
  const totalValue  = leads.reduce((s, l) => s + (parseFloat(l.dealValue) || 0), 0);
  const chartData   = [{ name:"New",value:newLeads },{ name:"Contacted",value:contacted },{ name:"Closed",value:closed }];

  const inp = {
    padding: "11px 14px", borderRadius: 10,
    background: "#0A1020", border: "1px solid #1E2D45",
    color: "#E2E8F0", fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  const NAV_ITEMS = [
    { icon: "◈", label: "Dashboard" },
    { icon: "◉", label: "Leads" },
    { icon: "◐", label: "Analytics" },
  ];

  /* ────────────────────────────────────────────────────── MOBILE TOP BAR */
  const MobileHeader = () => (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "#080F1E", borderBottom: "1px solid #111E33",
      padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 0 12px rgba(124,58,237,0.5)" }}>⚡</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#F1F5F9" }}>CRM Pro</div>
          <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.08em" }}>WORKSPACE</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => { setFormOpen(true); setMobileMenuOpen(false); }} style={{
          background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", border: "none",
          borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>+ Add</button>
        <button onClick={() => setMobileMenuOpen(o => !o)} style={{
          background: "transparent", border: "1px solid #1E2D45", borderRadius: 8,
          color: "#94A3B8", padding: "7px 10px", cursor: "pointer", fontSize: 16,
        }}>☰</button>
      </div>
    </header>
  );

  /* ────────────────────────────────────────────────────── MOBILE SLIDE MENU */
  const MobileMenu = () => (
    <>
      {/* backdrop */}
      <div onClick={() => setMobileMenuOpen(false)} style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)",
      }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: 220, background: "#080F1E", borderLeft: "1px solid #111E33",
        display: "flex", flexDirection: "column", padding: "20px 14px",
        animation: "slideInRight 0.22s ease",
      }}>
        <button onClick={() => setMobileMenuOpen(false)} style={{ alignSelf: "flex-end", background: "none", border: "none", color: "#475569", fontSize: 20, cursor: "pointer", marginBottom: 20 }}>✕</button>
        <div style={{ fontSize: 10, color: "#334155", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8, paddingLeft: 8 }}>MENU</div>
        {NAV_ITEMS.map(({ icon, label }) => (
          <button key={label} onClick={() => { setActiveNav(label); setMobileMenuOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "11px 12px",
            borderRadius: 10, border: "none", borderLeft: `2px solid ${activeNav===label?"#7C3AED":"transparent"}`,
            background: activeNav===label ? "rgba(124,58,237,0.16)" : "transparent",
            color: activeNav===label ? "#A78BFA" : "#64748B",
            fontSize: 13, fontWeight: activeNav===label ? 600 : 400, cursor: "pointer",
            width: "100%", textAlign: "left", marginBottom: 2,
          }}>
            <span style={{ fontSize: 16 }}>{icon}</span>{label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 8px", borderTop: "1px solid #111E33" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"white" }}>A</div>
          <div><div style={{ fontSize:12, fontWeight:600, color:"#CBD5E1" }}>Admin</div><div style={{ fontSize:10, color:"#475569" }}>Pro Plan</div></div>
        </div>
      </div>
    </>
  );

  /* ────────────────────────────────────────────────────── ADD LEAD MODAL */
  const AddLeadModal = () => (
    <>
      <div onClick={() => setFormOpen(false)} style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(3px)" }} />
      <div style={{
        position:"fixed", zIndex:301, inset: isMobile ? "0 0 0 0" : "auto",
        top: isMobile ? "auto" : "50%", left: isMobile ? 0 : "50%",
        bottom: isMobile ? 0 : "auto",
        transform: isMobile ? "none" : "translate(-50%,-50%)",
        width: isMobile ? "100%" : "min(560px,92vw)",
        background:"#0D1526", border:"1px solid #7C3AED44",
        borderRadius: isMobile ? "20px 20px 0 0" : 18,
        padding: isMobile ? "20px 16px 32px" : 28,
        boxShadow:"0 0 48px rgba(124,58,237,0.2)",
        animation: isMobile ? "slideUp 0.25s ease" : "fadeInScale 0.22s ease",
      }}>
        {/* drag handle on mobile */}
        {isMobile && <div style={{ width:40, height:4, background:"#1E2D45", borderRadius:2, margin:"0 auto 18px" }} />}

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:10, color:"#7C3AED", letterSpacing:"0.1em", fontWeight:700 }}>NEW LEAD</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#F1F5F9", marginTop:2 }}>Add Lead Details</div>
          </div>
          <button onClick={() => setFormOpen(false)} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:20 }}>✕</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
          {[
            { ph:"Full Name *",      val:name,      set:setName      },
            { ph:"Email Address",    val:email,     set:setEmail     },
            { ph:"Phone Number",     val:phone,     set:setPhone     },
            { ph:"Company",          val:company,   set:setCompany   },
            { ph:"Deal Value (₹)",   val:dealValue, set:setDealValue },
          ].map(({ ph, val, set }) => (
            <input key={ph} style={inp} placeholder={ph} value={val} onChange={e => set(e.target.value)}
              onFocus={e => e.target.style.borderColor="#7C3AED"}
              onBlur={e => e.target.style.borderColor="#1E2D45"}
            />
          ))}
          <select style={{ ...inp, cursor:"pointer" }} value={status} onChange={e => setStatus(e.target.value)}>
            <option>New</option><option>Contacted</option><option>Closed</option>
          </select>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:18, justifyContent:"flex-end" }}>
          <button onClick={() => setFormOpen(false)} style={{
            flex: isMobile ? 1 : "unset",
            padding:"11px 20px", borderRadius:10, border:"1px solid #1E2D45",
            background:"transparent", color:"#64748B", cursor:"pointer", fontSize:14, fontWeight:500,
          }}>Cancel</button>
          <button onClick={addLead} disabled={adding} style={{
            flex: isMobile ? 1 : "unset",
            padding:"11px 24px", borderRadius:10, border:"none",
            background: adding ? "#3730A3" : "linear-gradient(135deg,#7C3AED,#5B21B6)",
            color:"white", cursor:"pointer", fontSize:14, fontWeight:600,
            boxShadow:"0 0 16px rgba(124,58,237,0.4)",
          }}>{adding ? "Saving…" : "Save Lead"}</button>
        </div>
      </div>
    </>
  );

  /* ────────────────────────────────────────────────────── LEAD CARD (mobile) */
  const LeadCard = ({ lead }) => (
    <div style={{
      background:"#0D1526", borderRadius:14, padding:"14px 16px",
      border:"1px solid #1E2D45", marginBottom:10,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div style={{ fontWeight:700, color:"#F1F5F9", fontSize:14 }}>{lead.name}</div>
          <div style={{ color:"#475569", fontSize:11, marginTop:2 }}>{lead.company || "—"}</div>
        </div>
        <StatusBadge status={lead.status} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 12px", marginBottom:12 }}>
        {[
          { label:"Email",   val: lead.email   || "—" },
          { label:"Phone",   val: lead.phone   || "—" },
          { label:"Deal",    val: lead.dealValue ? `₹${parseFloat(lead.dealValue).toLocaleString()}` : "—" },
        ].map(({ label, val }) => (
          <div key={label}>
            <div style={{ fontSize:9, color:"#334155", letterSpacing:"0.08em", fontWeight:700, textTransform:"uppercase" }}>{label}</div>
            <div style={{ fontSize:12, color:"#94A3B8", marginTop:1, wordBreak:"break-all" }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={() => updateLead(lead._id, lead.status)} style={{
          flex:1, padding:"8px", borderRadius:8, border:"1px solid #A78BFA33",
          background:"rgba(167,139,250,0.08)", color:"#A78BFA",
          fontSize:12, fontWeight:600, cursor:"pointer",
        }}>Advance →</button>
        <button onClick={() => deleteLead(lead._id)} disabled={deleteId===lead._id} style={{
          padding:"8px 14px", borderRadius:8, border:"1px solid #EF444433",
          background:"rgba(239,68,68,0.08)", color:"#EF4444",
          fontSize:13, cursor:"pointer", opacity: deleteId===lead._id ? 0.5 : 1,
        }}>✕</button>
      </div>
    </div>
  );

  /* ────────────────────────────────────────────────────── DESKTOP TABLE ROW */
  const LeadRow = ({ lead, i }) => (
    <div style={{
      display:"grid", gridTemplateColumns:"2fr 1.6fr 1.1fr 1.1fr 1fr 1fr auto",
      padding:"14px 24px", gap:12, alignItems:"center",
      borderTop: i===0 ? "none" : "1px solid #0F1A2E",
      transition:"background 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.background="rgba(124,58,237,0.04)"}
      onMouseLeave={e => e.currentTarget.style.background="transparent"}
    >
      <div>
        <div style={{ fontWeight:600, color:"#F1F5F9", fontSize:13 }}>{lead.name}</div>
        <div style={{ color:"#475569", fontSize:11, marginTop:2 }}>{lead.company||"—"}</div>
      </div>
      <div style={{ color:"#94A3B8", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lead.email||"—"}</div>
      <div style={{ color:"#94A3B8", fontSize:12 }}>{lead.phone||"—"}</div>
      <div style={{ color:"#34D399", fontSize:13, fontWeight:600 }}>{lead.dealValue?`₹${parseFloat(lead.dealValue).toLocaleString()}`:"—"}</div>
      <div><StatusBadge status={lead.status} /></div>
      <button onClick={() => updateLead(lead._id, lead.status)} style={{
        padding:"5px 12px", borderRadius:7, border:"1px solid #1E2D45",
        background:"transparent", color:"#A78BFA", cursor:"pointer",
        fontSize:11, fontWeight:600, transition:"all 0.15s", whiteSpace:"nowrap",
      }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(167,139,250,0.12)";e.currentTarget.style.borderColor="#A78BFA44";}}
        onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="#1E2D45";}}
      >Advance →</button>
      <button onClick={() => deleteLead(lead._id)} disabled={deleteId===lead._id} style={{
        padding:"5px 9px", borderRadius:7, border:"1px solid #1E2D45",
        background:"transparent", color:"#EF4444", cursor:"pointer", fontSize:13,
        transition:"all 0.15s", opacity: deleteId===lead._id?0.5:1,
      }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.1)";e.currentTarget.style.borderColor="#EF444444";}}
        onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="#1E2D45";}}
      >✕</button>
    </div>
  );

  /* ────────────────────────────────────────────────────── RENDER */
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#060B18", fontFamily:"'Inter','Segoe UI',sans-serif", color:"#E2E8F0" }}>

      {/* ── Desktop Sidebar ── */}
      {!isMobile && (
        <aside style={{ width:210, minWidth:210, background:"#080F1E", borderRight:"1px solid #111E33", display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh" }}>
          <div style={{ padding:"22px 18px 18px", borderBottom:"1px solid #111E33", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#7C3AED,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, boxShadow:"0 0 14px rgba(124,58,237,0.5)" }}>⚡</div>
            <div>
              <div style={{ fontWeight:800, fontSize:14, color:"#F1F5F9" }}>CRM Pro</div>
              <div style={{ fontSize:9, color:"#475569", letterSpacing:"0.08em" }}>WORKSPACE</div>
            </div>
          </div>
          <nav style={{ padding:"14px 10px", flex:1 }}>
            <div style={{ fontSize:9, color:"#334155", letterSpacing:"0.1em", fontWeight:700, padding:"0 8px", marginBottom:8 }}>MAIN MENU</div>
            {NAV_ITEMS.map(({ icon, label }) => (
              <button key={label} onClick={() => setActiveNav(label)} style={{
                display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                borderRadius:10, border:"none", borderLeft:`2px solid ${activeNav===label?"#7C3AED":"transparent"}`,
                background: activeNav===label ? "rgba(124,58,237,0.16)" : "transparent",
                color: activeNav===label ? "#A78BFA" : "#64748B",
                cursor:"pointer", width:"100%", textAlign:"left",
                fontSize:13, fontWeight: activeNav===label ? 600 : 400, marginBottom:2, transition:"all 0.2s",
              }}>
                <span style={{ fontSize:16 }}>{icon}</span>{label}
              </button>
            ))}
          </nav>
          <div style={{ padding:"14px 18px", borderTop:"1px solid #111E33", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AED,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"white" }}>A</div>
            <div><div style={{ fontSize:12, fontWeight:600, color:"#CBD5E1" }}>Admin</div><div style={{ fontSize:10, color:"#475569" }}>Pro Plan</div></div>
          </div>
        </aside>
      )}

      {/* ── Mobile Header ── */}
      {isMobile && <MobileHeader />}

      {/* ── Modals / Drawers ── */}
      {mobileMenuOpen && <MobileMenu />}
      {formOpen && <AddLeadModal />}

      {/* ── Main Content ── */}
      <main style={{ flex:1, padding: isMobile ? "16px 14px 80px" : "28px 32px", overflowY:"auto", minWidth:0 }}>

        {/* Desktop header */}
        {!isMobile && (
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
            <div>
              <div style={{ fontSize:10, color:"#475569", letterSpacing:"0.1em", fontWeight:700, marginBottom:3 }}>OVERVIEW</div>
              <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:"#F1F5F9", letterSpacing:"-0.6px" }}>Lead Dashboard</h1>
              <p style={{ margin:"4px 0 0", color:"#475569", fontSize:13 }}>Track and manage your sales pipeline</p>
            </div>
            <button onClick={() => setFormOpen(true)} style={{
              display:"flex", alignItems:"center", gap:8,
              background:"linear-gradient(135deg,#7C3AED,#5B21B6)", color:"white",
              border:"none", borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:600,
              cursor:"pointer", boxShadow:"0 0 18px rgba(124,58,237,0.4)", transition:"all 0.2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 0 26px rgba(124,58,237,0.6)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="0 0 18px rgba(124,58,237,0.4)"}
            >+ Add Lead</button>
          </div>
        )}

        {/* Mobile page title */}
        {isMobile && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:9, color:"#475569", letterSpacing:"0.1em", fontWeight:700 }}>OVERVIEW</div>
            <h1 style={{ margin:"3px 0 0", fontSize:20, fontWeight:800, color:"#F1F5F9", letterSpacing:"-0.5px" }}>Lead Dashboard</h1>
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
          gap: isMobile ? 10 : 14,
          marginBottom: isMobile ? 16 : 20,
        }}>
          <StatCard label="Total Leads" value={totalLeads} color="#7C3AED" icon="◈" sub={`₹${totalValue.toLocaleString()}`} />
          <StatCard label="New"         value={newLeads}   color="#06B6D4" icon="✦" sub="Awaiting" />
          <StatCard label="Contacted"   value={contacted}  color="#A78BFA" icon="◎" sub="In progress" />
          <StatCard label="Closed"      value={closed}     color="#34D399" icon="✔" sub="Won" />
        </div>

        {/* ── Charts ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 12 : 14,
          marginBottom: isMobile ? 16 : 20,
        }}>
          {/* Pie */}
          <div style={{ background:"#0D1526", borderRadius:16, padding: isMobile ? "16px 12px" : "20px 20px", border:"1px solid #1E2D45" }}>
            <div style={{ fontSize:9, color:"#475569", letterSpacing:"0.1em", fontWeight:700 }}>ANALYTICS</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#F1F5F9", marginTop:2, marginBottom:12 }}>Pipeline Split</div>
            <ResponsiveContainer width="100%" height={isMobile ? 180 : 200}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={isMobile?50:55} outerRadius={isMobile?78:85} paddingAngle={4} dataKey="value">
                  {chartData.map((_,i) => <Cell key={i} fill={COLORS[i]} strokeWidth={0} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:4, flexWrap:"wrap" }}>
              {chartData.map((d,i) => (
                <div key={d.name} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#94A3B8" }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:COLORS[i], display:"inline-block" }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>

          {/* Bar */}
          <div style={{ background:"#0D1526", borderRadius:16, padding: isMobile ? "16px 12px" : "20px 20px", border:"1px solid #1E2D45" }}>
            <div style={{ fontSize:9, color:"#475569", letterSpacing:"0.1em", fontWeight:700 }}>BREAKDOWN</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#F1F5F9", marginTop:2, marginBottom:12 }}>Status Overview</div>
            <ResponsiveContainer width="100%" height={isMobile ? 180 : 200}>
              <BarChart data={chartData} barSize={isMobile?30:38}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="name" tick={{ fill:"#64748B", fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"#64748B", fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(124,58,237,0.06)" }} />
                <Bar dataKey="value" radius={[5,5,0,0]}>
                  {chartData.map((_,i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Leads Section ── */}
        <div style={{ background:"#0D1526", borderRadius:16, border:"1px solid #1E2D45", overflow:"hidden" }}>
          {/* Table / List header */}
          <div style={{
            padding: isMobile ? "14px 14px" : "18px 22px",
            borderBottom:"1px solid #111E33",
            display:"flex", alignItems:"center",
            flexDirection: isMobile ? "column" : "row",
            justifyContent:"space-between", gap:10,
          }}>
            <div style={{ width: isMobile ? "100%" : "auto" }}>
              <div style={{ fontSize:9, color:"#475569", letterSpacing:"0.1em", fontWeight:700 }}>ALL LEADS</div>
              <div style={{ fontSize:15, fontWeight:700, color:"#F1F5F9", marginTop:2 }}>
                {filtered.length} {filtered.length===1?"lead":"leads"}{search?` for "${search}"`:""}
              </div>
            </div>
            <div style={{ position:"relative", width: isMobile ? "100%" : 280 }}>
              <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#475569", fontSize:14 }}>⌕</span>
              <input style={{ ...inp, paddingLeft:32, fontSize:13 }}
                placeholder="Search leads…" value={search} onChange={e=>setSearch(e.target.value)}
                onFocus={e=>e.target.style.borderColor="#7C3AED"}
                onBlur={e=>e.target.style.borderColor="#1E2D45"}
              />
            </div>
          </div>

          {/* Desktop column headers */}
          {!isMobile && (
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1.6fr 1.1fr 1.1fr 1fr 1fr auto", padding:"9px 24px", background:"#080F1E", fontSize:10, color:"#334155", letterSpacing:"0.08em", fontWeight:700, gap:12 }}>
              <span>NAME & COMPANY</span><span>EMAIL</span><span>PHONE</span>
              <span>DEAL VALUE</span><span>STATUS</span><span>ACTION</span><span></span>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div style={{ padding:"48px 24px", textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>◈</div>
              <div style={{ color:"#475569", fontSize:14 }}>No leads found</div>
              <div style={{ color:"#334155", fontSize:12, marginTop:4 }}>
                {search?"Try a different search":"Add your first lead to get started"}
              </div>
            </div>
          ) : isMobile ? (
            <div style={{ padding:"10px 10px" }}>
              {filtered.map(lead => <LeadCard key={lead._id} lead={lead} />)}
            </div>
          ) : (
            <div>
              {filtered.map((lead,i) => <LeadRow key={lead._id} lead={lead} i={i} />)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop:20, textAlign:"center", color:"#1E2D45", fontSize:11 }}>
          CRM Pro · {new Date().getFullYear()} · {totalLeads} leads tracked
        </div>
      </main>
    </div>
  );
}