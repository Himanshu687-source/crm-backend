import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const API = "https://crm-backend-jxjt.onrender.com";

const STATUS_CONFIG = {
  New:       { color: "#06B6D4", bg: "rgba(6,182,212,0.12)",   glow: "rgba(6,182,212,0.35)",   icon: "✦" },
  Contacted: { color: "#A78BFA", bg: "rgba(167,139,250,0.12)", glow: "rgba(167,139,250,0.35)", icon: "◎" },
  Closed:    { color: "#34D399", bg: "rgba(52,211,153,0.12)",  glow: "rgba(52,211,153,0.35)",  icon: "✔" },
};
const COLORS = ["#06B6D4", "#A78BFA", "#34D399"];

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return m;
}

/* ══════════════════════════════════════════════════
   AUTH / LOGIN PAGE
══════════════════════════════════════════════════ */
const AuthScreen = ({ onLogin }) => {
  const isMobile = useIsMobile();
  const [mode,     setMode]     = useState("signin");
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("admin@crmpro.com");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState("Sales Manager");

  const inp = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1px solid #1E2D45", background: "#081120",
    color: "#E2E8F0", fontSize: 14, outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
  };

  const submit = (e) => {
    e.preventDefault();
    onLogin({
      name: mode === "signup" ? (fullName || "Admin") : (email.split("@")[0] || "Admin"),
      email,
      role,
    });
  };

  /* ── MOBILE AUTH ── */
  if (isMobile) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#060B18 0%,#0A1020 60%,#101827 100%)",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        color: "#E2E8F0",
        display: "flex", flexDirection: "column",
      }}>
        {/* Mobile top brand bar */}
        <div style={{ padding: "28px 24px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(124,58,237,0.45)", fontSize: 18 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#F8FAFC" }}>CRM Pro</div>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em" }}>PIPELINE WORKSPACE</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ fontSize: 11, color: "#06B6D4", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 8 }}>SALES COMMAND CENTER</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 850, color: "#F8FAFC", lineHeight: 1.2 }}>
            Manage leads, deals &amp; follow-ups.
          </h1>
          <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.6, margin: "10px 0 0" }}>
            One clean dashboard for your entire sales pipeline.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "0 24px 28px" }}>
          {[["24/7", "Access"], ["3", "Lead stages"], ["Live", "Atlas data"]].map(([v, l]) => (
            <div key={l} style={{ border: "1px solid #1E2D45", borderRadius: 12, padding: "12px 10px", background: "rgba(13,21,38,0.72)", textAlign: "center" }}>
              <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800 }}>{v}</div>
              <div style={{ color: "#475569", fontSize: 10, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={{ flex: 1, background: "#0D1526", borderTop: "1px solid #1E2D45", borderRadius: "24px 24px 0 0", padding: "24px 24px 40px" }}>
          {/* Mode toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
            {[["signin", "Sign in"], ["signup", "Create account"]].map(([val, label]) => (
              <button key={val} type="button" onClick={() => setMode(val)} style={{
                padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
                border: `1px solid ${mode === val ? "#7C3AED" : "#1E2D45"}`,
                background: mode === val ? "rgba(124,58,237,0.18)" : "transparent",
                color: mode === val ? "#C4B5FD" : "#64748B",
              }}>{label}</button>
            ))}
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>
              {mode === "signin" ? "Welcome back 👋" : "Start your workspace"}
            </div>
            <div style={{ color: "#64748B", fontSize: 12, marginTop: 5 }}>
              {mode === "signin" ? "Use any email and password to enter demo mode." : "Create a local demo profile."}
            </div>
          </div>

          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            {mode === "signup" && (
              <input style={inp} placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)}
                onFocus={e => e.target.style.borderColor = "#7C3AED"} onBlur={e => e.target.style.borderColor = "#1E2D45"} />
            )}
            <input style={inp} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
              onFocus={e => e.target.style.borderColor = "#7C3AED"} onBlur={e => e.target.style.borderColor = "#1E2D45"} />
            <input style={inp} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
              onFocus={e => e.target.style.borderColor = "#7C3AED"} onBlur={e => e.target.style.borderColor = "#1E2D45"} />
            {mode === "signup" && (
              <select style={{ ...inp, cursor: "pointer" }} value={role} onChange={e => setRole(e.target.value)}>
                <option>Sales Manager</option>
                <option>Account Executive</option>
                <option>Founder</option>
              </select>
            )}
            <button type="submit" style={{
              marginTop: 4, padding: "14px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
              color: "white", fontSize: 15, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 0 24px rgba(124,58,237,0.4)",
            }}>
              {mode === "signin" ? "Sign in →" : "Create account →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── DESKTOP AUTH ── */
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#060B18 0%,#0A1020 48%,#101827 100%)",
      fontFamily: "'Inter','Segoe UI',sans-serif",
      color: "#E2E8F0",
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
    }}>
      {/* Left hero */}
      <section style={{ padding: "56px 64px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 22px rgba(124,58,237,0.45)", fontSize: 20 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#F8FAFC" }}>CRM Pro</div>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.1em" }}>PIPELINE WORKSPACE</div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ maxWidth: 560 }}>
          <div style={{ fontSize: 12, color: "#06B6D4", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 14 }}>SALES COMMAND CENTER</div>
          <h1 style={{ margin: 0, color: "#F8FAFC", fontSize: 48, lineHeight: 1.05, fontWeight: 850 }}>
            Sign in to manage leads, deals, and follow-ups.
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: 1.7, margin: "18px 0 0" }}>
            Keep your sales team focused with one clean dashboard for new leads, contacted prospects, and closed revenue.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, maxWidth: 460 }}>
          {[["24/7", "Pipeline access"], ["3", "Lead stages"], ["Live", "Atlas data"]].map(([v, l]) => (
            <div key={l} style={{ border: "1px solid #1E2D45", borderRadius: 14, padding: "18px 16px", background: "rgba(13,21,38,0.72)" }}>
              <div style={{ color: "#F8FAFC", fontSize: 24, fontWeight: 800 }}>{v}</div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Right form */}
      <section style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
        <form onSubmit={submit} style={{
          width: "100%", maxWidth: 420,
          background: "#0D1526", border: "1px solid #1E2D45",
          borderRadius: 18, padding: 30,
          boxShadow: "0 24px 80px rgba(0,0,0,0.42)",
        }}>
          {/* Mode toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
            {[["signin", "Sign in"], ["signup", "Create account"]].map(([val, label]) => (
              <button key={val} type="button" onClick={() => setMode(val)} style={{
                padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
                border: `1px solid ${mode === val ? "#7C3AED" : "#1E2D45"}`,
                background: mode === val ? "rgba(124,58,237,0.18)" : "transparent",
                color: mode === val ? "#C4B5FD" : "#64748B",
              }}>{label}</button>
            ))}
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 800 }}>
              {mode === "signin" ? "Welcome back" : "Start your workspace"}
            </div>
            <div style={{ color: "#64748B", fontSize: 13, marginTop: 6 }}>
              {mode === "signin" ? "Use any email and password to enter demo mode." : "Create a local demo profile for this browser."}
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {mode === "signup" && (
              <input style={inp} placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)}
                onFocus={e => e.target.style.borderColor = "#7C3AED"} onBlur={e => e.target.style.borderColor = "#1E2D45"} />
            )}
            <input style={inp} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
              onFocus={e => e.target.style.borderColor = "#7C3AED"} onBlur={e => e.target.style.borderColor = "#1E2D45"} />
            <input style={inp} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
              onFocus={e => e.target.style.borderColor = "#7C3AED"} onBlur={e => e.target.style.borderColor = "#1E2D45"} />
            {mode === "signup" && (
              <select style={{ ...inp, cursor: "pointer" }} value={role} onChange={e => setRole(e.target.value)}>
                <option>Sales Manager</option><option>Account Executive</option><option>Founder</option>
              </select>
            )}
          </div>

          <button type="submit" style={{
            width: "100%", marginTop: 20, padding: "13px 18px",
            borderRadius: 12, border: "none",
            background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
            color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer",
            boxShadow: "0 0 22px rgba(124,58,237,0.36)",
          }}>
            {mode === "signin" ? "Sign in →" : "Create account →"}
          </button>
        </form>
      </section>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════ */
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
    borderRadius: 14, padding: "14px 16px",
    border: `1px solid ${color}22`,
    position: "relative", overflow: "hidden",
    transition: "transform 0.2s",
  }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
  >
    <div style={{ position: "absolute", top: -16, right: -16, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle,${color}22 0%,transparent 70%)` }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
      <span style={{ fontSize: 9, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 15, background: `${color}18`, borderRadius: 6, padding: "2px 6px" }}>{icon}</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: "#F1F5F9", lineHeight: 1, letterSpacing: "-1px" }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color, marginTop: 4, fontWeight: 500 }}>{sub}</div>}
  </div>
);

/* ══════════════════════════════════════════════════
   MAIN DASHBOARD APP
══════════════════════════════════════════════════ */
export default function App() {
  const isMobile = useIsMobile();

  // Auth state — persisted in localStorage
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("crmUser")); } catch { return null; }
  });

  const login  = (profile) => { localStorage.setItem("crmUser", JSON.stringify(profile)); setUser(profile); };
  const logout = ()        => { localStorage.removeItem("crmUser"); setUser(null); };

  const [leads,     setLeads]     = useState([]);
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [company,   setCompany]   = useState("");
  const [dealValue, setDealValue] = useState("");
  const [status,    setStatus]    = useState("New");
  const [search,    setSearch]    = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [adding,    setAdding]    = useState(false);
  const [formOpen,  setFormOpen]  = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);
  const [menuOpen,  setMenuOpen]  = useState(false);

  const statuses = ["New", "Contacted", "Closed"];

  const getLeads = async () => {
    try { const r = await fetch(`${API}/leads`); setLeads(await r.json()); }
    catch (e) { console.error(e); }
  };
  useEffect(() => { if (user) getLeads(); }, [user]);

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

  // ── Show login page if not authenticated ──
  if (!user) return <AuthScreen onLogin={login} />;

  const filtered   = leads.filter(l => l.name?.toLowerCase().includes(search.toLowerCase()));
  const totalLeads = leads.length;
  const newLeads   = leads.filter(l => l.status === "New").length;
  const contacted  = leads.filter(l => l.status === "Contacted").length;
  const closed     = leads.filter(l => l.status === "Closed").length;
  const totalValue = leads.reduce((s, l) => s + (parseFloat(l.dealValue) || 0), 0);
  const chartData  = [{ name: "New", value: newLeads }, { name: "Contacted", value: contacted }, { name: "Closed", value: closed }];

  const inp = {
    padding: "11px 14px", borderRadius: 10,
    background: "#0A1020", border: "1px solid #1E2D45",
    color: "#E2E8F0", fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  const NAV = [{ icon: "◈", label: "Dashboard" }, { icon: "◉", label: "Leads" }, { icon: "◐", label: "Analytics" }];
  const initial = user.name?.[0]?.toUpperCase() || "A";

  return (
    <div className="app-shell">

      {/* ══ DESKTOP SIDEBAR ══ */}
      <aside className="sidebar">
        <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid #111E33", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: "0 0 14px rgba(124,58,237,0.5)" }}>⚡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#F1F5F9" }}>CRM Pro</div>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.08em" }}>WORKSPACE</div>
          </div>
        </div>
        <nav style={{ padding: "14px 10px", flex: 1 }}>
          <div style={{ fontSize: 9, color: "#334155", letterSpacing: "0.1em", fontWeight: 700, padding: "0 8px", marginBottom: 8 }}>MAIN MENU</div>
          {NAV.map(({ icon, label }) => (
            <button key={label} className={`nav-btn${activeNav === label ? " active" : ""}`} onClick={() => setActiveNav(label)}>
              <span style={{ fontSize: 16 }}>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 18px", borderTop: "1px solid #111E33", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>{initial}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>{user.role || "Pro Plan"}</div>
            </div>
          </div>
          <button onClick={logout} title="Sign out" style={{ background: "transparent", border: "1px solid #1E2D45", color: "#64748B", borderRadius: 7, cursor: "pointer", padding: "4px 8px", fontSize: 11, flexShrink: 0 }}>Exit</button>
        </div>
      </aside>

      {/* ══ MOBILE SLIDE MENU ══ */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)" }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201, width: 220, background: "#080F1E", borderLeft: "1px solid #111E33", display: "flex", flexDirection: "column", padding: "20px 14px", animation: "slideInRight 0.22s ease" }}>
            <button onClick={() => setMenuOpen(false)} style={{ alignSelf: "flex-end", background: "none", border: "none", color: "#475569", fontSize: 20, cursor: "pointer", marginBottom: 20 }}>✕</button>
            <div style={{ fontSize: 10, color: "#334155", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8, paddingLeft: 8 }}>MENU</div>
            {NAV.map(({ icon, label }) => (
              <button key={label} className={`nav-btn${activeNav === label ? " active" : ""}`} onClick={() => { setActiveNav(label); setMenuOpen(false); }}>
                <span style={{ fontSize: 16 }}>{icon}</span>{label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ borderTop: "1px solid #111E33", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white" }}>{initial}</div>
                <div><div style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1" }}>{user.name}</div><div style={{ fontSize: 10, color: "#475569" }}>{user.role || "Pro Plan"}</div></div>
              </div>
              <button onClick={logout} style={{ background: "transparent", border: "1px solid #1E2D45", color: "#EF4444", borderRadius: 7, cursor: "pointer", padding: "5px 8px", fontSize: 11 }}>Exit</button>
            </div>
          </div>
        </>
      )}

      {/* ══ ADD LEAD MODAL ══ */}
      {formOpen && (
        <>
          <div onClick={() => setFormOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(3px)" }} />
          <div style={{
            position: "fixed", zIndex: 301,
            ...(isMobile
              ? { left: 0, right: 0, bottom: 0, borderRadius: "20px 20px 0 0", padding: "16px 16px 36px", animation: "slideUp 0.25s ease" }
              : { top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(540px,92vw)", borderRadius: 18, padding: 28, animation: "fadeInScale 0.22s ease" }
            ),
            background: "#0D1526", border: "1px solid #7C3AED44",
            boxShadow: "0 0 48px rgba(124,58,237,0.2)",
          }}>
            {isMobile && <div style={{ width: 40, height: 4, background: "#1E2D45", borderRadius: 2, margin: "0 auto 18px" }} />}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 10, color: "#7C3AED", letterSpacing: "0.1em", fontWeight: 700 }}>NEW LEAD</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", marginTop: 2 }}>Add Lead Details</div>
              </div>
              <button onClick={() => setFormOpen(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {[
                { ph: "Full Name *", val: name,      set: setName      },
                { ph: "Email",       val: email,     set: setEmail     },
                { ph: "Phone",       val: phone,     set: setPhone     },
                { ph: "Company",     val: company,   set: setCompany   },
                { ph: "Deal Value (₹)", val: dealValue, set: setDealValue },
              ].map(({ ph, val, set }) => (
                <input key={ph} style={inp} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                  onFocus={e => e.target.style.borderColor = "#7C3AED"}
                  onBlur={e => e.target.style.borderColor = "#1E2D45"} />
              ))}
              <select style={{ ...inp, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value)}>
                <option>New</option><option>Contacted</option><option>Closed</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={() => setFormOpen(false)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid #1E2D45", background: "transparent", color: "#64748B", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>Cancel</button>
              <button onClick={addLead} disabled={adding} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: adding ? "#3730A3" : "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
                {adding ? "Saving…" : "Save Lead"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══ CONTENT WRAPPER ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* ── MOBILE TOP BAR (CSS hidden on desktop) ── */}
        <header className="mobile-header" style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "#080F1E", borderBottom: "1px solid #111E33",
          padding: "12px 16px", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 0 12px rgba(124,58,237,0.5)" }}>⚡</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#F1F5F9" }}>CRM Pro</div>
              <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.08em" }}>WORKSPACE</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setFormOpen(true)} style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 14px rgba(124,58,237,0.4)" }}>
              + Add
            </button>
            <button onClick={() => setMenuOpen(o => !o)} style={{ background: "transparent", border: "1px solid #1E2D45", borderRadius: 8, color: "#94A3B8", padding: "8px 11px", cursor: "pointer", fontSize: 16 }}>
              ☰
            </button>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, overflowY: "auto" }} className="main-content">
          <style>{`
            .main-content { padding: 28px 32px; }
            @media(max-width:767px){ .main-content { padding: 14px 12px 80px !important; } }
            .page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; }
            @media(max-width:767px){ .page-header { display:none; } }
            .mobile-title { display:none; margin-bottom:14px; }
            @media(max-width:767px){ .mobile-title { display:block !important; } }
          `}</style>

          {/* Desktop header */}
          <div className="page-header">
            <div>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 3 }}>OVERVIEW</div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.6px" }}>Lead Dashboard</h1>
              <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 13 }}>Welcome back, {user.name} 👋</p>
            </div>
            <button onClick={() => setFormOpen(true)} style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 18px rgba(124,58,237,0.4)", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 26px rgba(124,58,237,0.6)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 18px rgba(124,58,237,0.4)"}
            >+ Add Lead</button>
          </div>

          {/* Mobile title */}
          <div className="mobile-title">
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", fontWeight: 700 }}>OVERVIEW</div>
            <h1 style={{ margin: "3px 0 0", fontSize: 20, fontWeight: 800, color: "#F1F5F9" }}>Lead Dashboard</h1>
          </div>

          {/* ── Stat Cards ── */}
          <div className="stat-grid">
            <StatCard label="Total Leads" value={totalLeads} color="#7C3AED" icon="◈" sub={`₹${totalValue.toLocaleString()}`} />
            <StatCard label="New"         value={newLeads}   color="#06B6D4" icon="✦" sub="Awaiting" />
            <StatCard label="Contacted"   value={contacted}  color="#A78BFA" icon="◎" sub="In progress" />
            <StatCard label="Closed"      value={closed}     color="#34D399" icon="✔" sub="Won" />
          </div>

          {/* ── Charts ── */}
          <div className="chart-grid">
            <div style={{ background: "#0D1526", borderRadius: 16, padding: "18px 16px", border: "1px solid #1E2D45" }}>
              <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", fontWeight: 700 }}>ANALYTICS</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", marginTop: 2, marginBottom: 12 }}>Pipeline Split</div>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={4} dataKey="value">
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }}>
                {chartData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#94A3B8" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS[i], display: "inline-block" }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0D1526", borderRadius: 16, padding: "18px 16px", border: "1px solid #1E2D45" }}>
              <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", fontWeight: 700 }}>BREAKDOWN</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", marginTop: 2, marginBottom: 12 }}>Status Overview</div>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={chartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.06)" }} />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Leads Section ── */}
          <div style={{ background: "#0D1526", borderRadius: 16, border: "1px solid #1E2D45", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #111E33", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", fontWeight: 700 }}>ALL LEADS</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", marginTop: 2 }}>
                  {filtered.length} {filtered.length === 1 ? "lead" : "leads"}{search ? ` for "${search}"` : ""}
                </div>
              </div>
              <div style={{ position: "relative", flex: 1, maxWidth: 300, minWidth: 180 }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 14 }}>⌕</span>
                <input style={{ ...inp, paddingLeft: 32, fontSize: 13 }}
                  placeholder="Search leads…" value={search} onChange={e => setSearch(e.target.value)}
                  onFocus={e => e.target.style.borderColor = "#7C3AED"}
                  onBlur={e => e.target.style.borderColor = "#1E2D45"} />
              </div>
            </div>

            {/* Desktop column headers */}
            <div className="col-headers" style={{ background: "#080F1E", fontSize: 10, color: "#334155", letterSpacing: "0.08em", fontWeight: 700 }}>
              <span>NAME &amp; COMPANY</span><span>EMAIL</span><span>PHONE</span>
              <span>DEAL VALUE</span><span>STATUS</span><span>ACTION</span><span></span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>◈</div>
                <div style={{ color: "#475569", fontSize: 14 }}>No leads found</div>
                <div style={{ color: "#334155", fontSize: 12, marginTop: 4 }}>
                  {search ? "Try a different search term" : "Add your first lead to get started"}
                </div>
              </div>
            ) : (
              <>
                {/* Desktop rows */}
                <div>
                  {filtered.map((lead, i) => (
                    <div key={lead._id} className="lead-row" style={{ borderTop: i === 0 ? "none" : "1px solid #0F1A2E" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#F1F5F9", fontSize: 13 }}>{lead.name}</div>
                        <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{lead.company || "—"}</div>
                      </div>
                      <div style={{ color: "#94A3B8", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.email || "—"}</div>
                      <div style={{ color: "#94A3B8", fontSize: 12 }}>{lead.phone || "—"}</div>
                      <div style={{ color: "#34D399", fontSize: 13, fontWeight: 600 }}>{lead.dealValue ? `₹${parseFloat(lead.dealValue).toLocaleString()}` : "—"}</div>
                      <div><StatusBadge status={lead.status} /></div>
                      <button className="btn-advance" onClick={() => updateLead(lead._id, lead.status)}>Advance →</button>
                      <button className="btn-delete" disabled={deleteId === lead._id} onClick={() => deleteLead(lead._id)} style={{ opacity: deleteId === lead._id ? 0.5 : 1 }}>✕</button>
                    </div>
                  ))}
                </div>

                {/* Mobile cards */}
                <div className="mobile-cards" style={{ padding: "10px 10px" }}>
                  {filtered.map(lead => (
                    <div key={lead._id} style={{ background: "#080F1E", borderRadius: 14, padding: "14px", border: "1px solid #1E2D45", marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 14 }}>{lead.name}</div>
                          <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{lead.company || "—"}</div>
                        </div>
                        <StatusBadge status={lead.status} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginBottom: 12 }}>
                        {[
                          { label: "Email",      val: lead.email || "—" },
                          { label: "Phone",      val: lead.phone || "—" },
                          { label: "Deal Value", val: lead.dealValue ? `₹${parseFloat(lead.dealValue).toLocaleString()}` : "—" },
                        ].map(({ label, val }) => (
                          <div key={label}>
                            <div style={{ fontSize: 9, color: "#334155", letterSpacing: "0.08em", fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
                            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2, wordBreak: "break-all" }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => updateLead(lead._id, lead.status)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid #A78BFA33", background: "rgba(167,139,250,0.08)", color: "#A78BFA", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Advance →</button>
                        <button onClick={() => deleteLead(lead._id)} disabled={deleteId === lead._id} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #EF444433", background: "rgba(239,68,68,0.08)", color: "#EF4444", fontSize: 13, cursor: "pointer", opacity: deleteId === lead._id ? 0.5 : 1 }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: 20, textAlign: "center", color: "#1E2D45", fontSize: 11 }}>
            CRM Pro · {new Date().getFullYear()} · {totalLeads} leads tracked
          </div>
        </main>
      </div>
    </div>
  );
}