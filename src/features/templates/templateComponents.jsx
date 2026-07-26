import { lazy, useState } from "react";
import {
  Bars,
  Button,
  css,
  Field,
  Metric,
  NavRail,
  Pill,
  TemplateApp,
  Toast,
  Toggle,
} from "./templatePrimitives.jsx";

function TemplateHeader({ eyebrow, title, description, actions }) {
  return (
    <header style={{ ...css.spread, alignItems: "flex-start", marginBottom: 22 }}>
      <div style={css.stack}>
        {eyebrow ? (
          <span style={{ color: "#718096", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase" }}>
            {eyebrow}
          </span>
        ) : null}
        <h1 style={css.title}>{title}</h1>
        {description ? <p style={css.subtitle}>{description}</p> : null}
      </div>
      {actions ? <div style={css.row}>{actions}</div> : null}
    </header>
  );
}

function WorkspaceLayout({ children, active = "overview", onNavigate }) {
  const items = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "activity", label: "Activity", icon: "↗" },
    { id: "reports", label: "Reports", icon: "▤" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];
  return (
    <TemplateApp>
      <div style={{ display: "flex", gap: 26, minHeight: 640 }}>
        <NavRail items={items} active={active} onChange={onNavigate} footer={<span style={{ fontSize: 11, color: "#8792a2" }}>v2.4 · Local preview</span>} />
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </TemplateApp>
  );
}

export function DashboardTemplate() {
  const [active, setActive] = useState("overview");
  return (
    <WorkspaceLayout active={active} onNavigate={setActive}>
      <TemplateHeader
        eyebrow="Monday, 18 September"
        title="Good morning, Maya"
        description="Here is what is happening across your workspace today."
        actions={<><Button variant="secondary">Export</Button><Button>New report</Button></>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
        <Metric label="Total revenue" value="$48,290" trend="+12.8%" />
        <Metric label="Active users" value="18,421" trend="+8.4%" tone="green" />
        <Metric label="Conversion" value="6.24%" trend="+1.2%" tone="orange" />
        <Metric label="Open tickets" value="28" trend="-4.6%" tone="neutral" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 14 }}>
        <section style={{ ...css.panel, padding: 18 }}>
          <div style={{ ...css.spread, marginBottom: 20 }}>
            <div style={css.stack}><h2 style={css.sectionTitle}>Revenue overview</h2><span style={css.subtitle}>Last 7 days</span></div>
            <Pill tone="blue">Weekly</Pill>
          </div>
          <Bars values={[42, 62, 48, 76, 59, 86, 72]} />
          <div style={{ ...css.spread, color: "#8792a2", fontSize: 11, marginTop: 9 }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </section>
        <section style={{ ...css.panel, padding: 18 }}>
          <div style={{ ...css.spread, marginBottom: 14 }}><h2 style={css.sectionTitle}>Top channels</h2><Button variant="ghost" size="sm">View all</Button></div>
          {[["Organic search", "48%", "#315efb"], ["Direct", "26%", "#6f82f9"], ["Referral", "18%", "#9dacf7"], ["Other", "8%", "#d7defc"]].map(([label, value, color]) => (
            <div key={label} style={{ ...css.stack, gap: 6, marginTop: 13 }}>
              <div style={css.spread}><span>{label}</span><strong>{value}</strong></div>
              <div style={{ height: 7, borderRadius: 99, overflow: "hidden", background: "#eef1f6" }}><span style={{ display: "block", width: value, height: "100%", borderRadius: 99, background: color }} /></div>
            </div>
          ))}
        </section>
      </div>
      <section style={{ ...css.panel, padding: 18, marginTop: 14 }}>
        <div style={{ ...css.spread, marginBottom: 14 }}><h2 style={css.sectionTitle}>Recent activity</h2><Pill>12 updates</Pill></div>
        {["New team member invited", "Weekly report exported", "Billing details updated"].map((label, index) => (
          <div key={label} style={{ ...css.spread, padding: "11px 0", borderTop: index ? `1px solid ${css.divider.background}` : 0 }}>
            <span>{label}</span><span style={{ color: "#8792a2", fontSize: 12 }}>{index + 1}h ago</span>
          </div>
        ))}
      </section>
    </WorkspaceLayout>
  );
}

export function TableTemplate() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const rows = [
    ["Northstar Labs", "northstar.io", "Pro", "Active", "$2,480"],
    ["Field Notes", "fieldnotes.co", "Starter", "Trial", "$480"],
    ["Morrow Studio", "morrow.studio", "Pro", "Active", "$1,920"],
    ["Good Weather", "goodweather.design", "Team", "Paused", "$920"],
    ["Northwind", "northwind.dev", "Pro", "Active", "$3,240"],
  ];
  const filtered = rows.filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase()));
  const toggleRow = (name) => setSelected((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  return (
    <TemplateApp>
      <TemplateHeader eyebrow="Workspace / Accounts" title="Accounts" description="Manage customers, plans and billing status." actions={<Button>Invite account</Button>} />
      <section style={{ ...css.panel, overflow: "hidden" }}>
        <div style={{ ...css.spread, padding: 16, borderBottom: `1px solid ${css.divider.background}` }}>
          <Field label="" value={query} onChange={setQuery} placeholder="Search accounts..." />
          <div style={css.row}><Button variant="secondary">Filter</Button><Button variant="secondary">Columns</Button></div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 640 }}>
            <thead><tr>{["", "Account", "Plan", "Status", "MRR", ""].map((heading) => <th key={heading} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#8792a2", fontWeight: 800, textTransform: "uppercase" }}>{heading}</th>)}</tr></thead>
            <tbody>
              {filtered.map(([name, domain, plan, status, mrr]) => (
                <tr key={name} style={{ borderTop: `1px solid ${css.divider.background}` }}>
                  <td style={{ padding: "14px 16px" }}><input aria-label={`Select ${name}`} type="checkbox" checked={selected.includes(name)} onChange={() => toggleRow(name)} /></td>
                  <td style={{ padding: "14px 16px" }}><div style={css.stack}><strong>{name}</strong><span style={{ color: "#8792a2", fontSize: 12 }}>{domain}</span></div></td>
                  <td style={{ padding: "14px 16px" }}><Pill tone={plan === "Pro" ? "blue" : "neutral"}>{plan}</Pill></td>
                  <td style={{ padding: "14px 16px" }}><Pill tone={status === "Active" ? "green" : status === "Trial" ? "orange" : "neutral"}>{status}</Pill></td>
                  <td style={{ padding: "14px 16px", fontWeight: 700 }}>{mrr}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}><Button variant="ghost" size="sm">•••</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer style={{ ...css.spread, padding: "12px 16px", borderTop: `1px solid ${css.divider.background}`, color: "#8792a2", fontSize: 12 }}>
          <span>{selected.length ? `${selected.length} selected` : `${filtered.length} accounts`}</span><div style={css.row}><Button variant="secondary" size="sm">Previous</Button><Button variant="secondary" size="sm">Next</Button></div>
        </footer>
      </section>
    </TemplateApp>
  );
}

export function FormTwoColumnTemplate() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <TemplateApp>
      <TemplateHeader eyebrow="Settings / Profile" title="Tell us about your team" description="This helps us tailor your workspace to the way you work." />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: 16, alignItems: "start" }}>
        <section style={{ ...css.panel, padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="First name" value="Maya" onChange={() => {}} />
            <Field label="Last name" value="Lin" onChange={() => {}} />
          </div>
          <div style={{ marginTop: 14 }}><Field label="Work email" value={email} onChange={setEmail} placeholder="you@company.com" type="email" /></div>
          <div style={{ marginTop: 14 }}><Field label="Company" value="Northstar Labs" onChange={() => {}} /></div>
          <div style={{ ...css.spread, marginTop: 20 }}><span style={{ color: "#8792a2", fontSize: 12 }}>You can change this later.</span><Button onClick={() => setSubmitted(true)}>Save changes</Button></div>
          {submitted ? <div style={{ marginTop: 14 }}><Toast>Profile saved successfully</Toast></div> : null}
        </section>
        <aside style={{ ...css.softPanel, padding: 18 }}>
          <h2 style={css.sectionTitle}>Workspace preview</h2>
          <p style={{ ...css.subtitle, marginTop: 7 }}>Your team will see this name in the navigation and account switcher.</p>
          <div style={{ ...css.panel, padding: 14, marginTop: 18 }}><div style={css.row}><span style={{ width: 30, height: 30, borderRadius: 10, background: "#dfe7ff", display: "grid", placeItems: "center", color: "#315efb", fontWeight: 800 }}>N</span><div style={css.stack}><strong>Northstar Labs</strong><span style={{ color: "#8792a2", fontSize: 11 }}>Team workspace</span></div></div></div>
        </aside>
      </div>
    </TemplateApp>
  );
}

export function LoginSplitTemplate() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <TemplateApp style={{ background: "#f4f6f8", padding: 32 }}>
      <div style={{ ...css.panel, maxWidth: 900, minHeight: 560, margin: "0 auto", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <section style={{ padding: 42, background: "#172131", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={css.stack}><strong style={{ fontSize: 18 }}>northstar</strong><div style={{ marginTop: 56 }}><h1 style={{ ...css.title, fontSize: 38, maxWidth: 330 }}>Work with clarity.</h1><p style={{ color: "#b8c2d2", maxWidth: 280, marginTop: 14 }}>A calm space for teams to plan, build and ship meaningful work.</p></div></div>
          <span style={{ color: "#a8b1c2", fontSize: 12 }}>Trusted by 2,000+ thoughtful teams</span>
        </section>
        <section style={{ padding: 42, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ ...css.stack, gap: 9, marginBottom: 24 }}><h2 style={{ ...css.title, fontSize: 27 }}>Welcome back</h2><p style={css.subtitle}>Sign in to your workspace.</p></div>
          <div style={css.stack}><Field label="Email address" value={email} onChange={setEmail} placeholder="you@company.com" /><label style={{ ...css.stack, gap: 6 }}><span style={{ fontSize: 12, fontWeight: 700, color: "#657184" }}>Password</span><div style={{ position: "relative" }}><input type={showPassword ? "text" : "password"} defaultValue="password" style={{ boxSizing: "border-box", width: "100%", minHeight: 38, border: `1px solid ${css.divider.background}`, borderRadius: 10, padding: "8px 64px 8px 11px", font: "inherit" }} /><button type="button" onClick={() => setShowPassword((value) => !value)} style={{ position: "absolute", right: 8, top: 7, border: 0, background: "transparent", color: "#657184", font: "inherit", cursor: "pointer", fontSize: 12 }}>{showPassword ? "Hide" : "Show"}</button></div></label><Button>Sign in</Button><Button variant="secondary">Continue with Google</Button></div>
          <p style={{ color: "#8792a2", fontSize: 12, textAlign: "center", marginTop: 20 }}>New here? <span style={{ color: "#315efb", fontWeight: 700 }}>Create an account</span></p>
        </section>
      </div>
    </TemplateApp>
  );
}

export function SettingsSidebarTemplate() {
  const [section, setSection] = useState("General");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const sections = ["General", "Notifications", "Security", "Members"];
  return (
    <TemplateApp>
      <TemplateHeader eyebrow="Workspace" title="Settings" description="Manage your account and workspace preferences." />
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 28, maxWidth: 820 }}>
        <nav style={css.stack}>{sections.map((item) => <button key={item} type="button" onClick={() => setSection(item)} style={{ border: 0, borderRadius: 9, padding: "9px 10px", background: section === item ? "#eef2ff" : "transparent", textAlign: "left", font: "inherit", color: section === item ? "#315efb" : "#657184", fontWeight: section === item ? 750 : 550, cursor: "pointer" }}>{item}</button>)}</nav>
        <section style={{ ...css.panel, padding: 20 }}>
          <div style={{ ...css.spread, marginBottom: 18 }}><div><h2 style={css.sectionTitle}>{section}</h2><p style={{ ...css.subtitle, marginTop: 5 }}>Set the defaults for this workspace.</p></div><Pill tone="blue">Saved locally</Pill></div>
          {section === "General" ? <div style={css.stack}><Field label="Workspace name" value="Northstar Labs" onChange={() => {}} /><Field label="Workspace URL" value="northstar" onChange={() => {}} /><Button style={{ alignSelf: "flex-start" }}>Save changes</Button></div> : null}
          {section === "Notifications" ? <div style={css.stack}><div style={{ ...css.spread }}><div><strong>Email updates</strong><p style={{ ...css.subtitle, marginTop: 4, fontSize: 12 }}>Weekly product and usage summaries.</p></div><Toggle checked={emailUpdates} onChange={setEmailUpdates} /></div><div style={{ ...css.divider }} /><div style={{ ...css.spread }}><div><strong>Activity digest</strong><p style={{ ...css.subtitle, marginTop: 4, fontSize: 12 }}>A daily digest of workspace activity.</p></div><Toggle checked={true} onChange={() => {}} /></div></div> : null}
          {section === "Security" ? <div style={css.stack}><div style={{ ...css.spread }}><div><strong>Two-factor authentication</strong><p style={{ ...css.subtitle, marginTop: 4, fontSize: 12 }}>Protect your account with an extra step.</p></div><Toggle checked={twoFactor} onChange={setTwoFactor} /></div><div style={{ ...css.divider }} /><Button variant="danger" style={{ alignSelf: "flex-start" }}>Sign out of all devices</Button></div> : null}
          {section === "Members" ? <div style={css.stack}>{["Maya Lin", "Jules Kim", "Owen Hart"].map((name) => <div key={name} style={{ ...css.spread, padding: "11px 0", borderBottom: `1px solid ${css.divider.background}` }}><div style={css.row}><span style={{ width: 30, height: 30, borderRadius: "50%", background: "#e1e8ff", display: "grid", placeItems: "center", color: "#315efb", fontWeight: 800 }}>{name[0]}</span><span>{name}</span></div><Pill>{name === "Maya Lin" ? "Owner" : "Member"}</Pill></div>)}</div> : null}
        </section>
      </div>
    </TemplateApp>
  );
}

export function AiChatTemplate() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi Maya — what are we exploring today?" },
    { role: "user", text: "Summarise the latest account activity." },
    { role: "assistant", text: "Three accounts grew this week. Morrow Studio has the largest expansion at 24%." },
  ]);
  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((current) => [...current, { role: "user", text }, { role: "assistant", text: "I’ll look into that and bring back a concise answer." }]);
    setInput("");
  };
  return (
    <TemplateApp style={{ background: "#f6f7fa" }}>
      <div style={{ maxWidth: 850, margin: "0 auto", minHeight: 640, display: "flex", flexDirection: "column" }}>
        <div style={{ ...css.spread, paddingBottom: 16, borderBottom: `1px solid ${css.divider.background}` }}><strong style={{ fontSize: 17 }}>Studio AI</strong><div style={css.row}><Pill tone="blue">Workspace context</Pill><Button variant="ghost" size="sm">•••</Button></div></div>
        <div style={{ flex: 1, padding: "38px 0 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          {messages.map((message, index) => <div key={`${message.role}-${index}`} style={{ alignSelf: message.role === "user" ? "flex-end" : "flex-start", maxWidth: "76%", display: "flex", gap: 10, alignItems: "flex-start" }}><span style={{ width: 26, height: 26, borderRadius: 9, background: message.role === "user" ? "#dce5ff" : "#172131", color: message.role === "user" ? "#315efb" : "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800 }}>{message.role === "user" ? "M" : "AI"}</span><div style={{ ...css.panel, padding: "11px 14px", background: message.role === "user" ? "#eaf0ff" : "#fff", borderColor: message.role === "user" ? "#d8e2ff" : css.divider.background }}>{message.text}</div></div>)}
        </div>
        <div style={{ ...css.panel, padding: 10, display: "flex", gap: 10 }}><input aria-label="Message Studio AI" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Ask anything about your workspace..." style={{ flex: 1, border: 0, outline: 0, font: "inherit", padding: "8px 4px" }} /><Button onClick={send}>Send</Button></div>
        <div style={{ ...css.row, justifyContent: "center", marginTop: 10, color: "#8792a2", fontSize: 11 }}><span>⌘ K</span><span>·</span><span>Ask a follow-up</span></div>
      </div>
    </TemplateApp>
  );
}

export function ClassicGalleryTemplate() {
  const [active, setActive] = useState("All");
  const categories = ["All", "Objects", "Places", "People"];
  const cards = [
    ["Soft geometry", "Objects", "01"],
    ["Morning light", "Places", "02"],
    ["Close to home", "People", "03"],
    ["Quiet systems", "Objects", "04"],
    ["Field notes", "Places", "05"],
    ["Everyday rituals", "People", "06"],
  ];
  const visible = active === "All" ? cards : cards.filter((card) => card[1] === active);
  return (
    <TemplateApp style={{ background: "#faf9f7" }}>
      <TemplateHeader eyebrow="Collection / 2024" title="The quiet archive" description="A considered collection of objects, places and people." actions={<Button variant="secondary">About the archive</Button>} />
      <div style={{ ...css.row, marginBottom: 18 }}>{categories.map((item) => <button key={item} type="button" onClick={() => setActive(item)} style={{ border: 0, borderRadius: 99, padding: "7px 12px", font: "inherit", background: active === item ? "#172131" : "#eceae6", color: active === item ? "#fff" : "#657184", cursor: "pointer" }}>{item}</button>)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>{visible.map(([title, category, index]) => <article key={title} style={{ ...css.panel, overflow: "hidden", background: "#fff" }}><div style={{ height: 132, background: `linear-gradient(135deg, hsl(${185 + Number(index) * 17} 54% 88%), hsl(${205 + Number(index) * 11} 40% 64%))`, display: "grid", placeItems: "center", color: "#fff", fontSize: 28, fontWeight: 800 }}>{index}</div><div style={{ padding: 14 }}><div style={{ ...css.spread }}><strong>{title}</strong><Pill>{category}</Pill></div><p style={{ ...css.subtitle, marginTop: 8, fontSize: 12 }}>A small study in form, texture and attention.</p></div></article>)}</div>
    </TemplateApp>
  );
}

export function DocumentationTemplate() {
  const [active, setActive] = useState("Getting started");
  const sections = ["Getting started", "Foundations", "Components", "Patterns", "Changelog"];
  return (
    <TemplateApp>
      <div style={{ ...css.spread, marginBottom: 20 }}><div style={css.row}><strong style={{ fontSize: 17 }}>Northstar Docs</strong><Pill>v1.8</Pill></div><div style={css.row}><Button variant="ghost">Search</Button><Button variant="secondary">GitHub</Button></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 150px", gap: 30, minHeight: 580 }}>
        <nav style={css.stack}>{sections.map((item) => <button key={item} type="button" onClick={() => setActive(item)} style={{ border: 0, borderRadius: 8, padding: "8px 10px", textAlign: "left", font: "inherit", background: active === item ? "#eef2ff" : "transparent", color: active === item ? "#315efb" : "#657184", fontWeight: active === item ? 750 : 550 }}>{item}</button>)}</nav>
        <article style={{ maxWidth: 650 }}><Pill tone="blue">Guide</Pill><h1 style={{ ...css.title, fontSize: 34, marginTop: 12 }}>{active}</h1><p style={{ ...css.subtitle, marginTop: 10 }}>A calm, practical guide to designing and shipping thoughtful product experiences.</p><div style={{ ...css.divider, margin: "26px 0" }} /><h2 style={{ ...css.sectionTitle, fontSize: 20 }}>Start with the interface</h2><p style={{ color: "#657184", marginTop: 9 }}>Keep the first interaction clear and make the next step obvious. This page keeps navigation close while giving the main content enough space to breathe.</p><pre style={{ ...css.softPanel, padding: 14, overflow: "auto", color: "#315efb", fontSize: 12 }}>{`const workspace = createWorkspace({\\n  mode: \"focused\",\\n  density: \"comfortable\",\\n});`}</pre><Button>Copy example</Button></article>
        <aside style={{ ...css.stack, gap: 8, color: "#8792a2", fontSize: 12 }}><strong style={{ color: "#657184" }}>On this page</strong><span style={{ color: "#315efb" }}>Overview</span><span>Examples</span><span>Next steps</span></aside>
      </div>
    </TemplateApp>
  );
}

export function KanbanBoardTemplate() {
  const [cards, setCards] = useState({
    Backlog: ["Audit onboarding", "Write release notes"],
    "In progress": ["Design empty state", "Review dashboard"],
    Done: ["Set up workspace", "Ship v2.4"],
  });
  const addCard = (column) => setCards((current) => ({ ...current, [column]: [...current[column], `New ${column} task`] }));
  return (
    <TemplateApp style={{ background: "#f7f8fb" }}>
      <TemplateHeader eyebrow="Project / Q3 launch" title="Launch board" description="Keep the next important thing visible." actions={<Button>Invite team</Button>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>{Object.entries(cards).map(([column, items]) => <section key={column} style={{ ...css.softPanel, padding: 12, minHeight: 390 }}><div style={{ ...css.spread, marginBottom: 12 }}><div style={css.row}><strong>{column}</strong><Pill>{items.length}</Pill></div><Button variant="ghost" size="sm" onClick={() => addCard(column)}>＋</Button></div><div style={css.stack}>{items.map((item, index) => <article key={`${item}-${index}`} draggable style={{ ...css.panel, padding: 13, cursor: "grab", boxShadow: "0 4px 14px rgba(25,38,58,.05)" }}><p style={{ margin: 0, fontWeight: 650 }}>{item}</p><div style={{ ...css.spread, marginTop: 14 }}><span style={{ width: 23, height: 23, borderRadius: "50%", background: index % 2 ? "#ffe0bd" : "#dce5ff", color: "#315efb", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 800 }}>{String.fromCharCode(77 + index)}</span><span style={{ color: "#8792a2", fontSize: 11 }}>Due Thu</span></div></article>)}</div></section>)}</div>
    </TemplateApp>
  );
}

export function ShellTopNavTemplate() {
  const [active, setActive] = useState("Home");
  return (
    <TemplateApp style={{ background: "#f5f5f3" }}>
      <header style={{ ...css.spread, padding: "2px 0 18px", borderBottom: `1px solid ${css.divider.background}` }}><strong style={{ fontSize: 18 }}>Studio</strong><nav style={css.row}>{["Home", "Stories", "About", "Contact"].map((item) => <button key={item} type="button" onClick={() => setActive(item)} style={{ border: 0, background: active === item ? "#e7e7e4" : "transparent", borderRadius: 99, padding: "7px 12px", font: "inherit", color: active === item ? "#18212f" : "#657184" }}>{item}</button>)}</nav><div style={css.row}><Button variant="ghost" size="sm">⌕</Button><Button size="sm">Get started</Button></div></header>
      <section style={{ maxWidth: 700, margin: "74px auto 48px", textAlign: "center" }}><Pill tone="blue">A simpler way to work</Pill><h1 style={{ ...css.title, fontSize: 46, marginTop: 18 }}>Make room for good ideas.</h1><p style={{ ...css.subtitle, margin: "14px auto 22px", maxWidth: 500 }}>A focused space for thoughtful teams to move from a first thought to a finished thing.</p><div style={{ ...css.row, justifyContent: "center" }}><Button>Explore the studio</Button><Button variant="secondary">Read our story</Button></div></section>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 14 }}>{["A clear canvas", "Small rituals", "Better together"].map((title, index) => <article key={title} style={{ ...css.panel, padding: 18, minHeight: 150 }}><span style={{ color: "#315efb", fontWeight: 800 }}>0{index + 1}</span><h2 style={{ ...css.sectionTitle, marginTop: 32 }}>{title}</h2><p style={{ ...css.subtitle, marginTop: 8, fontSize: 12 }}>Carefully chosen defaults keep your day moving.</p></article>)}</div>
    </TemplateApp>
  );
}

export function ProductDetailTemplate() {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <TemplateApp style={{ background: "#f8f8f6" }}>
      <div style={{ ...css.spread, marginBottom: 26 }}><strong style={{ fontSize: 18 }}>Morrow Objects</strong><div style={css.row}><span style={{ color: "#657184" }}>Shop</span><span style={{ color: "#657184" }}>Journal</span><Button variant="secondary" size="sm">Bag (0)</Button></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 30, alignItems: "start" }}>
        <div style={{ ...css.panel, overflow: "hidden" }}><div style={{ minHeight: 480, display: "grid", placeItems: "center", background: "linear-gradient(135deg, #e4e8ef, #c0cad8)", color: "#fff", fontSize: 86, fontWeight: 800 }}>M</div><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, padding: 10 }}><div style={{ height: 62, borderRadius: 9, background: "#c6d0de" }} /><div style={{ height: 62, borderRadius: 9, background: "#d9d7d2" }} /><div style={{ height: 62, borderRadius: 9, background: "#d9c8c2" }} /></div></div>
        <section style={{ paddingTop: 14 }}><Pill tone="orange">Limited edition</Pill><h1 style={{ ...css.title, fontSize: 38, marginTop: 14 }}>Linen throw</h1><p style={{ ...css.subtitle, marginTop: 11 }}>A textured layer for slower mornings and cooler evenings.</p><strong style={{ display: "block", fontSize: 24, marginTop: 28 }}>$86.00</strong><div style={{ ...css.divider, margin: "24px 0" }} /><div style={css.stack}><strong style={{ fontSize: 12 }}>Quantity</strong><div style={{ ...css.row, justifyContent: "space-between", border: `1px solid ${css.divider.background}`, borderRadius: 10, padding: "4px 8px", maxWidth: 128 }}><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ border: 0, background: "transparent", fontSize: 18 }}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} style={{ border: 0, background: "transparent", fontSize: 18 }}>＋</button></div><Button onClick={() => setAdded(true)}>Add to bag · ${86 * quantity}</Button>{added ? <Toast>Added to your bag</Toast> : null}</div><div style={{ ...css.divider, margin: "24px 0" }} /><div style={{ ...css.stack, gap: 11, color: "#657184", fontSize: 12 }}><span>Free delivery in 3–5 days</span><span>30 day returns</span><span>Designed in Copenhagen</span></div></section>
      </div>
    </TemplateApp>
  );
}

export function EditorTemplate() {
  const [tool, setTool] = useState("Select");
  const tools = ["Select", "Frame", "Text", "Image"];
  return (
    <TemplateApp style={{ background: "#f1f3f6", padding: 14 }}>
      <div style={{ ...css.spread, marginBottom: 12 }}><div style={css.row}><strong style={{ fontSize: 17 }}>Canvas</strong><Pill tone="green">Saved</Pill></div><div style={css.row}><Button variant="secondary" size="sm">Share</Button><Button size="sm">Publish</Button></div></div>
      <div style={{ ...css.panel, display: "grid", gridTemplateColumns: "52px 1fr 190px", minHeight: 590, overflow: "hidden" }}>
        <aside style={{ borderRight: `1px solid ${css.divider.background}`, padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>{tools.map((item) => <button type="button" key={item} onClick={() => setTool(item)} style={{ border: 0, borderRadius: 8, background: tool === item ? "#eaf0ff" : "transparent", color: tool === item ? "#315efb" : "#657184", padding: "10px 4px", fontSize: 10, fontWeight: 700 }}>{item.slice(0, 1)}<span style={{ display: "block", marginTop: 3 }}>{item}</span></button>)}</aside>
        <main style={{ padding: 34, display: "grid", placeItems: "center", background: "#e9ebf0" }}><div style={{ width: "82%", maxWidth: 520, minHeight: 360, background: "#fff", borderRadius: 12, boxShadow: "0 14px 30px rgba(24,33,47,.13)", padding: 26 }}><Pill tone="blue">Hero section</Pill><h2 style={{ fontSize: 28, margin: "20px 0 8px" }}>Make room for good ideas.</h2><p style={css.subtitle}>Selected tool: {tool}. This canvas is a live local template preview.</p><div style={{ display: "flex", gap: 10, marginTop: 28 }}><div style={{ width: 92, height: 10, borderRadius: 99, background: "#dce5ff" }} /><div style={{ width: 54, height: 10, borderRadius: 99, background: "#e9ecf2" }} /></div></div></main>
        <aside style={{ borderLeft: `1px solid ${css.divider.background}`, padding: 14 }}><h2 style={css.sectionTitle}>Properties</h2><div style={{ ...css.stack, marginTop: 18 }}><Field label="Width" value="520px" onChange={() => {}} /><Field label="Radius" value="12px" onChange={() => {}} /><Toggle checked label="Responsive" /></div></aside>
      </div>
    </TemplateApp>
  );
}

const lazyLocal = (Component) => lazy(() => Promise.resolve({ default: Component }));

export const TEMPLATE_COMPONENTS = {
  dashboard: lazyLocal(DashboardTemplate),
  table: lazyLocal(TableTemplate),
  "form-two-column": lazyLocal(FormTwoColumnTemplate),
  "login-split": lazyLocal(LoginSplitTemplate),
  "settings-sidebar": lazyLocal(SettingsSidebarTemplate),
  "ai-chat": lazyLocal(AiChatTemplate),
  "classic-gallery": lazyLocal(ClassicGalleryTemplate),
  documentation: lazyLocal(DocumentationTemplate),
  "kanban-board": lazyLocal(KanbanBoardTemplate),
  "shell-top-nav": lazyLocal(ShellTopNavTemplate),
  "product-detail": lazyLocal(ProductDetailTemplate),
  editor: lazyLocal(EditorTemplate),
};

export function getTemplateComponent(slug) {
  return TEMPLATE_COMPONENTS[slug];
}

export function renderTemplate(slug) {
  const Component = getTemplateComponent(slug);
  return Component ? <Component /> : null;
}
