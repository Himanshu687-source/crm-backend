import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const API = (import.meta.env.VITE_API_URL || "https://crm-backend-jxjt.onrender.com").replace(/\/$/, "");

const STATUS_CONFIG = {
  New:       { color: "#06B6D4", bg: "rgba(6,182,212,0.12)",  glow: "rgba(6,182,212,0.35)",  icon: "✦" },
  Contacted: { color: "#A78BFA", bg: "rgba(167,139,250,0.12)", glow: "rgba(167,139,250,0.35)", icon: "◎" },
  Closed:    { color: "#34D399", bg: "rgba(52,211,153,0.12)",  glow: "rgba(52,211,153,0.35)",  icon: "✔" },
};

const COLORS = ["#06B6D4", "#A78BFA", "#34D399"];

const NavIcon = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "11px 14px", borderRadius: "12px", border: "none",
      background: active ? "rgba(124,58,237,0.18)" : "transparent",
      color: active ? "#A78BFA" : "#64748B",
      cursor: "pointer", width: "100%", textAlign: "left",
      fontSize: "14px", fontWeight: active ? 600 : 400,
      transition: "all 0.2s",
      borderLeft: active ? "2px solid #7C3AED" : "2px solid transparent",
    }}
  >
    <span style={{ fontSize: "18px", width: "22px", textAlign: "center" }}>{icon}</span>
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, color, glow, icon, sub }) => (
  <div style={{
    background: "linear-gradient(135deg, #0D1526 0%, #111827 100%)",
    borderRadius: "16px", padding: "22px 24px",
    border: `1px solid ${color}22`,
    boxShadow: `0 0 0 0px ${glow}, 0 4px 24px rgba(0,0,0,0.4)`,
    position: "relative", overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 0 0 1px ${glow}, 0 8px 32px rgba(0,0,0,0.5)`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 0 0px ${glow}, 0 4px 24px rgba(0,0,0,0.4)`; }}
  >
    <div style={{
      position: "absolute", top: -20, right: -20,
      width: 80, height: 80, borderRadius: "50%",
      background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
    }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <span style={{ fontSize: "12px", color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: "20px", background: `${color}18`, borderRadius: "8px", padding: "4px 8px" }}>{icon}</span>
    </div>
    <div style={{ fontSize: "36px", fontWeight: 800, color: "#F1F5F9", lineHeight: 1, letterSpacing: "-1px" }}>{value}</div>
    {sub && <div style={{ fontSize: "12px", color: color, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
  </div>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.New;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 10px", borderRadius: "20px",
      background: cfg.bg, color: cfg.color,
      fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em",
      border: `1px solid ${cfg.color}33`,
      boxShadow: `0 0 8px ${cfg.glow}`,
    }}>
      {cfg.icon} {status}
    </span>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value } = payload[0].payload;
    const cfg = STATUS_CONFIG[name];
    return (
      <div style={{ background: "#0D1526", border: `1px solid ${cfg?.color}44`, borderRadius: "10px", padding: "10px 14px" }}>
        <div style={{ color: cfg?.color, fontWeight: 700 }}>{name}</div>
        <div style={{ color: "#F1F5F9", fontSize: "20px", fontWeight: 800 }}>{value}</div>
      </div>
    );
  }
  return null;
};

const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("signin");
  const [fullName, setFullName] = useState("Admin");
  const [email, setEmail] = useState("admin@crmpro.com");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Sales Manager");

  const authInputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #1E2D45",
    background: "#081120",
    color: "#E2E8F0",
    fontSize: "14px",
    outline: "none",
  };

  const submitAuth = (e) => {
    e.preventDefault();
    onLogin({
      name: mode === "signup" ? fullName || "Admin" : email.split("@")[0] || "Admin",
      email,
      role,
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060B18 0%, #0A1020 48%, #101827 100%)",
      color: "#E2E8F0",
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <section style={{ padding: "56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "12px",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 22px rgba(124,58,237,0.45)",
            fontWeight: 800,
          }}>C</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "18px", color: "#F8FAFC" }}>CRM Pro</div>
            <div style={{ fontSize: "11px", color: "#64748B", letterSpacing: "0.1em" }}>PIPELINE WORKSPACE</div>
          </div>
        </div>

        <div style={{ maxWidth: "560px" }}>
          <div style={{ fontSize: "12px", color: "#06B6D4", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "12px" }}>
            SALES COMMAND CENTER
          </div>
          <h1 style={{ margin: 0, color: "#F8FAFC", fontSize: "48px", lineHeight: 1.05, fontWeight: 850 }}>
            Sign in to manage leads, deals, and follow-ups.
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "16px", lineHeight: 1.7, margin: "18px 0 0" }}>
            Keep your sales team focused with one clean dashboard for new leads, contacted prospects, and closed revenue.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px", maxWidth: "620px" }}>
          {[
            ["24/7", "Pipeline access"],
            ["3", "Lead stages"],
            ["Live", "Atlas data"],
          ].map(([value, label]) => (
            <div key={label} style={{ border: "1px solid #1E2D45", borderRadius: "14px", padding: "16px", background: "rgba(13,21,38,0.72)" }}>
              <div style={{ color: "#F8FAFC", fontSize: "24px", fontWeight: 800 }}>{value}</div>
              <div style={{ color: "#64748B", fontSize: "12px", marginTop: "4px" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <form onSubmit={submitAuth} style={{
          width: "100%",
          maxWidth: "420px",
          background: "#0D1526",
          border: "1px solid #1E2D45",
          borderRadius: "18px",
          padding: "28px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.42)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "22px" }}>
            {[
              ["signin", "Sign in"],
              ["signup", "Create account"],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                onClick={() => setMode(value)}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: `1px solid ${mode === value ? "#7C3AED" : "#1E2D45"}`,
                  background: mode === value ? "rgba(124,58,237,0.18)" : "transparent",
                  color: mode === value ? "#C4B5FD" : "#64748B",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ color: "#F8FAFC", fontSize: "24px", fontWeight: 800 }}>
              {mode === "signin" ? "Welcome back" : "Start your workspace"}
            </div>
            <div style={{ color: "#64748B", fontSize: "13px", marginTop: "6px" }}>
              {mode === "signin" ? "Use any email and password to enter demo mode." : "Create a local demo profile for this browser."}
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {mode === "signup" && (
              <input style={authInputStyle} placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            )}
            <input style={authInputStyle} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input style={authInputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {mode === "signup" && (
              <select style={{ ...authInputStyle, cursor: "pointer" }} value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Sales Manager</option>
                <option>Account Executive</option>
                <option>Founder</option>
              </select>
            )}
          </div>

          <button type="submit" style={{
            width: "100%",
            marginTop: "18px",
            padding: "12px 18px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
            color: "white",
            fontSize: "14px",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 0 22px rgba(124,58,237,0.36)",
          }}>
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("crmUser");
    return saved ? JSON.parse(saved) : null;
  });
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

  const statuses = ["New", "Contacted", "Closed"];

  const login = (profile) => {
    localStorage.setItem("crmUser", JSON.stringify(profile));
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("crmUser");
    setUser(null);
  };

  const getLeads = async () => {
    try {
      const res = await fetch(`${API}/leads`);
      const data = await res.json();
      setLeads(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { getLeads(); }, []);

  const addLead = async () => {
    if (!name) return;
    setAdding(true);
    await fetch(`${API}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  const updateLead = async (id, currentStatus) => {
    const idx = statuses.indexOf(currentStatus);
    const next = statuses[(idx + 1) % statuses.length];
    await fetch(`${API}/leads/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    getLeads();
  };

  const filtered = leads.filter(l => l.name?.toLowerCase().includes(search.toLowerCase()));
  const totalLeads = leads.length;
  const newLeads   = leads.filter(l => l.status === "New").length;
  const contacted  = leads.filter(l => l.status === "Contacted").length;
  const closed     = leads.filter(l => l.status === "Closed").length;
  const totalValue = leads.reduce((s, l) => s + (parseFloat(l.dealValue) || 0), 0);

  const chartData = [
    { name: "New",       value: newLeads   },
    { name: "Contacted", value: contacted  },
    { name: "Closed",    value: closed     },
  ];

  const inputStyle = {
    padding: "11px 14px", borderRadius: "10px",
    background: "#0A1020", border: "1px solid #1E2D45",
    color: "#E2E8F0", fontSize: "14px", outline: "none",
    transition: "border-color 0.2s",
    width: "100%", boxSizing: "border-box",
  };

  if (!user) return <AuthScreen onLogin={login} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060B18", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#E2E8F0" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: "220px", minWidth: "220px", background: "#080F1E",
        borderRight: "1px solid #111E33", display: "flex", flexDirection: "column",
        padding: "0", position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid #111E33" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "10px",
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", boxShadow: "0 0 16px rgba(124,58,237,0.5)",
            }}>⚡</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "16px", color: "#F1F5F9", letterSpacing: "-0.3px" }}>CRM Pro</div>
              <div style={{ fontSize: "10px", color: "#475569", letterSpacing: "0.06em" }}>WORKSPACE</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <div style={{ fontSize: "10px", color: "#334155", letterSpacing: "0.1em", fontWeight: 700, padding: "0 10px", marginBottom: "8px" }}>MAIN MENU</div>
          {[
            { icon: "◈", label: "Dashboard" },
            { icon: "◉", label: "Leads" },
            { icon: "◐", label: "Analytics" },
          ].map(({ icon, label }) => (
            <NavIcon key={label} icon={icon} label={label} active={activeNav === label} onClick={() => setActiveNav(label)} />
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #111E33" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 700, color: "white",
            }}>A</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#CBD5E1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ fontSize: "11px", color: "#475569" }}>{user.role || "Pro Plan"}</div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              style={{ background: "transparent", border: "1px solid #1E2D45", color: "#64748B", borderRadius: "8px", cursor: "pointer", padding: "5px 8px", fontSize: "12px" }}
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxWidth: "calc(100vw - 220px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#475569", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "4px" }}>OVERVIEW</div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.8px", lineHeight: 1.1 }}>
              Lead Dashboard
            </h1>
            <p style={{ margin: "6px 0 0", color: "#475569", fontSize: "14px" }}>
              Track and manage your sales pipeline
            </p>
          </div>
          <button
            onClick={() => setFormOpen(!formOpen)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              color: "white", border: "none", borderRadius: "12px",
              padding: "11px 20px", fontSize: "14px", fontWeight: 600,
              cursor: "pointer", boxShadow: "0 0 20px rgba(124,58,237,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 28px rgba(124,58,237,0.6)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(124,58,237,0.4)"}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span> Add Lead
          </button>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <StatCard label="Total Leads"  value={totalLeads} color="#7C3AED" glow="rgba(124,58,237,0.3)"  icon="◈" sub={`₹${totalValue.toLocaleString()} pipeline`} />
          <StatCard label="New"          value={newLeads}   color="#06B6D4" glow="rgba(6,182,212,0.3)"   icon="✦" sub="Awaiting contact" />
          <StatCard label="Contacted"    value={contacted}  color="#A78BFA" glow="rgba(167,139,250,0.3)" icon="◎" sub="In progress" />
          <StatCard label="Closed"       value={closed}     color="#34D399" glow="rgba(52,211,153,0.3)"  icon="✔" sub="Deals won" />
        </div>

        {/* Chart + Add Form Row */}
        <div style={{ display: "grid", gridTemplateColumns: formOpen ? "1fr 1.2fr" : "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

          {/* Pie Chart */}
          <div style={{ background: "#0D1526", borderRadius: "18px", padding: "24px", border: "1px solid #1E2D45" }}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", color: "#475569", letterSpacing: "0.1em", fontWeight: 700 }}>ANALYTICS</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#F1F5F9", marginTop: "2px" }}>Pipeline Distribution</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} strokeWidth={0} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "8px" }}>
              {chartData.map((d, i) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#94A3B8" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i], display: "inline-block" }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{ background: "#0D1526", borderRadius: "18px", padding: "24px", border: "1px solid #1E2D45" }}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", color: "#475569", letterSpacing: "0.1em", fontWeight: 700 }}>BREAKDOWN</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#F1F5F9", marginTop: "2px" }}>Status Overview</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.06)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add Lead Form */}
        {formOpen && (
          <div style={{
            background: "#0D1526", borderRadius: "18px", padding: "24px",
            border: "1px solid #7C3AED44", marginBottom: "24px",
            boxShadow: "0 0 32px rgba(124,58,237,0.12)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#7C3AED", letterSpacing: "0.1em", fontWeight: 700 }}>NEW LEAD</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#F1F5F9", marginTop: "2px" }}>Add Lead Details</div>
              </div>
              <button onClick={() => setFormOpen(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {[
                { ph: "Full Name *", val: name, set: setName },
                { ph: "Email Address", val: email, set: setEmail },
                { ph: "Phone Number", val: phone, set: setPhone },
                { ph: "Company", val: company, set: setCompany },
                { ph: "Deal Value (₹)", val: dealValue, set: setDealValue },
              ].map(({ ph, val, set }) => (
                <input key={ph} style={inputStyle} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                  onFocus={e => e.target.style.borderColor = "#7C3AED"}
                  onBlur={e => e.target.style.borderColor = "#1E2D45"}
                />
              ))}

              <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value)}>
                <option>New</option>
                <option>Contacted</option>
                <option>Closed</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => setFormOpen(false)} style={{
                padding: "10px 20px", borderRadius: "10px", border: "1px solid #1E2D45",
                background: "transparent", color: "#64748B", cursor: "pointer", fontSize: "14px", fontWeight: 500,
              }}>Cancel</button>
              <button onClick={addLead} disabled={adding} style={{
                padding: "10px 24px", borderRadius: "10px", border: "none",
                background: adding ? "#3730A3" : "linear-gradient(135deg, #7C3AED, #5B21B6)",
                color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 600,
                boxShadow: "0 0 16px rgba(124,58,237,0.4)",
              }}>
                {adding ? "Saving…" : "Save Lead"}
              </button>
            </div>
          </div>
        )}

        {/* Search + Leads Table */}
        <div style={{ background: "#0D1526", borderRadius: "18px", border: "1px solid #1E2D45", overflow: "hidden" }}>
          {/* Table Header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #111E33", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#475569", letterSpacing: "0.1em", fontWeight: 700 }}>ALL LEADS</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#F1F5F9", marginTop: "2px" }}>
                {filtered.length} {filtered.length === 1 ? "lead" : "leads"} {search && `for "${search}"`}
              </div>
            </div>
            <div style={{ position: "relative", flex: 1, maxWidth: "320px" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: "15px" }}>⌕</span>
              <input
                style={{ ...inputStyle, paddingLeft: "36px" }}
                placeholder="Search leads…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={e => e.target.style.borderColor = "#7C3AED"}
                onBlur={e => e.target.style.borderColor = "#1E2D45"}
              />
            </div>
          </div>

          {/* Column Headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1.5fr 1.2fr 1.2fr 1fr 1fr auto",
            padding: "10px 24px", background: "#080F1E",
            fontSize: "11px", color: "#334155", letterSpacing: "0.08em", fontWeight: 700, gap: "12px",
          }}>
            <span>NAME & COMPANY</span><span>EMAIL</span><span>PHONE</span>
            <span>DEAL VALUE</span><span>STATUS</span><span>ACTION</span><span></span>
          </div>

          {/* Rows */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ padding: "64px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>◈</div>
                <div style={{ color: "#475569", fontSize: "15px" }}>No leads found</div>
                <div style={{ color: "#334155", fontSize: "13px", marginTop: "4px" }}>
                  {search ? "Try a different search term" : "Add your first lead to get started"}
                </div>
              </div>
            ) : filtered.map((lead, i) => (
              <div key={lead._id} style={{
                display: "grid", gridTemplateColumns: "2fr 1.5fr 1.2fr 1.2fr 1fr 1fr auto",
                padding: "16px 24px", gap: "12px", alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid #0F1A2E",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Name + Company */}
                <div>
                  <div style={{ fontWeight: 600, color: "#F1F5F9", fontSize: "14px" }}>{lead.name}</div>
                  <div style={{ color: "#475569", fontSize: "12px", marginTop: "2px" }}>{lead.company || "—"}</div>
                </div>

                <div style={{ color: "#94A3B8", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lead.email || "—"}
                </div>
                <div style={{ color: "#94A3B8", fontSize: "13px" }}>{lead.phone || "—"}</div>
                <div style={{ color: "#34D399", fontSize: "14px", fontWeight: 600 }}>
                  {lead.dealValue ? `₹${parseFloat(lead.dealValue).toLocaleString()}` : "—"}
                </div>

                <div><StatusBadge status={lead.status} /></div>

                {/* Update */}
                <button
                  onClick={() => updateLead(lead._id, lead.status)}
                  style={{
                    padding: "6px 14px", borderRadius: "8px", border: "1px solid #1E2D45",
                    background: "transparent", color: "#A78BFA", cursor: "pointer",
                    fontSize: "12px", fontWeight: 600, transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(167,139,250,0.12)"; e.currentTarget.style.borderColor = "#A78BFA44"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#1E2D45"; }}
                >
                  Advance →
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteLead(lead._id)}
                  disabled={deleteId === lead._id}
                  style={{
                    padding: "6px 10px", borderRadius: "8px", border: "1px solid #1E2D45",
                    background: "transparent", color: "#EF4444", cursor: "pointer",
                    fontSize: "14px", transition: "all 0.15s",
                    opacity: deleteId === lead._id ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "#EF444444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#1E2D45"; }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "24px", textAlign: "center", color: "#1E2D45", fontSize: "12px" }}>
          CRM Pro · {new Date().getFullYear()} · {totalLeads} leads tracked
        </div>
      </main>
    </div>
  );
}
