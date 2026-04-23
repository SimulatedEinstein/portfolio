"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ── Types ──
interface Project {
  type: string;
  title: string;
  desc: string;
  tech: string[];
  link: string;
}

interface Skill {
  group: string;
  items: string[];
}

interface Stat {
  label: string;
  value: number | string;
  suffix?: string;
  static?: boolean;
}

const PROJECTS: Project[] = [
  {
    type: "PINN · Fluid Dynamics",
    title: "Jet Impingement Cooling PINN",
    desc: "Physics-informed neural network (4-hidden-layer, 2→128→128→128→128→4) solving coupled Navier–Stokes and heat transfer equations with <2% error vs benchmark CFD results. Trained on 7,000 collocation + 1,200 boundary points.",
    tech: ["PyTorch", "PINNs", "Adam", "L-BFGS", "CFD", "Nusselt Analysis"],
    link: "https://github.com/SimulatedEinstein/PINN_For_Jet_Impingement_Cooling",
  },
  {
    type: "PINN · Thermal",
    title: "2D Heat Conduction PINN",
    desc: "Solved 2D steady-state heat equation using PINNs, validated against finite difference numerical methods.",
    tech: ["PINNs", "PyTorch", "FDM", "CFD"],
    link: "https://github.com/SimulatedEinstein/Physics-Informed-Neural-Network-for-2D-Steady-State-Heat-Conduction",
  },
  {
    type: "PINN · 1D Analysis",
    title: "1D Heat Transfer PINN",
    desc: "Steady-state 1D heat transfer modeled with PINN, enforcing boundary conditions through custom loss functions.",
    tech: ["PINNs", "PyTorch"],
    link: "https://github.com/SimulatedEinstein/PINN_For_Steady_State_Heat_Transfer_1-D",
  },
  {
    type: "ML · Predictive Maintenance",
    title: "RF vs LSTM Degradation Model",
    desc: "Benchmarked LSTM (92% accuracy) vs Random Forest (87% accuracy) on NASA C-MAPSS dataset. 12 engineered features for RUL prediction; identified 8× inference speed advantage with RF.",
    tech: ["Python", "Random Forest", "LSTM", "Feature Engineering", "NASA C-MAPSS"],
    link: "https://github.com/SimulatedEinstein/Comparative-Analysis-of-Random-Forest-and-LSTM-Models-for-Predictive-Maintenance",
  },
  {
    type: "Automation · PLC",
    title: "Bottling Plant Mixing Automation",
    desc: "PLC ladder logic + 3-screen HMI in Siemens TIA Portal automating 6 production parameters, cutting manual intervention ~40% and fault detection response time ~30%.",
    tech: ["PLC", "Siemens TIA Portal", "HMI", "Ladder Logic"],
    link: "#",
  },
  {
    type: "AI · IoT — SIH 2023",
    title: "AI Irrigation System",
    desc: "Runner-Up at Smart India Hackathon 2023. AI-driven irrigation integrating soil moisture sensors, real-time weather data, and IoT edge computing — achieving up to 30% reduction in water consumption.",
    tech: ["ML", "IoT", "Edge Computing", "Python"],
    link: "#",
  },
];

const SKILLS: Skill[] = [
  {
    group: "AI / ML",
    items: ["Physics-Informed Neural Networks", "LSTM / Recurrent Networks", "Random Forest", "PyTorch", "TensorFlow", "Scikit-learn"],
  },
  {
    group: "Simulation / CFD",
    items: ["Navier–Stokes Solvers", "Finite Difference Method", "Heat Transfer Modeling", "Ansys / Fluent", "OpenFOAM", "FEA"],
  },
  {
    group: "CAD / CAE",
    items: ["SolidWorks", "CATIA", "Creo", "AutoCAD", "Ansys Structural"],
  },
  {
    group: "Industrial Automation",
    items: ["PLC Programming (Siemens TIA Portal)", "HMI Development", "Variable Frequency Drives", "Servo Drives", "IoT Sensor Integration"],
  },
  {
    group: "Programming",
    items: ["Python", "MATLAB", "C / C++", "HTML / CSS", "NumPy / Pandas / Matplotlib", "Ladder Logic"],
  },
  {
    group: "Engineering Domains",
    items: ["Hydraulic Systems", "Control Systems & PID", "Predictive Maintenance", "Mechatronics", "Robotics"],
  },
];

const STATS: Stat[] = [
  { label: "Projects", value: 6 },
  { label: "Bar Hydraulics", value: 150 },
  { label: "DOF Robotics", value: 3 },
  { label: "Precision", value: "±0.5mm", static: true },
];

// ── Animated Counter ──
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count}</span>;
}

// ── Atom Canvas Background ──
function AtomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Warm amber/gold accent instead of cyan
    const atoms = [
      { cx: 0.12, cy: 0.22, size: 95, speed: 1.0, color: "212,175,55" },
      { cx: 0.85, cy: 0.18, size: 72, speed: 1.3, color: "180,140,40" },
      { cx: 0.72, cy: 0.78, size: 110, speed: 0.7, color: "212,175,55" },
      { cx: 0.08, cy: 0.82, size: 62, speed: 1.6, color: "230,200,100" },
      { cx: 0.52, cy: 0.48, size: 52, speed: 1.1, color: "212,175,55" },
    ];

    let t = 0;

    const drawAtom = (cx: number, cy: number, size: number, t: number, speed: number, colorStr: string, alpha: number) => {
      const W = canvas.width;
      const H = canvas.height;
      const x = cx * W;
      const y = cy * H;
      const r = size;

      ctx.beginPath();
      ctx.arc(x, y, r * 0.10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorStr},${alpha * 0.9})`;
      ctx.fill();

      const nucGlow = ctx.createRadialGradient(x, y, 0, x, y, r * 0.25);
      nucGlow.addColorStop(0, `rgba(${colorStr},${alpha * 0.4})`);
      nucGlow.addColorStop(1, `rgba(${colorStr},0)`);
      ctx.beginPath();
      ctx.arc(x, y, r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = nucGlow;
      ctx.fill();

      for (let p = 0; p < 3; p++) {
        const pa = (p / 3) * Math.PI * 2 + t * speed * 0.5;
        const px = x + Math.cos(pa) * r * 0.06;
        const py = y + Math.sin(pa) * r * 0.06;
        ctx.beginPath();
        ctx.arc(px, py, r * 0.04, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,180,80,${alpha * 0.9})`;
        ctx.fill();
      }

      const orbits = [
        { rx: r, ry: r * 0.35, tilt: 0, electronSpeed: 1.0, electronOffset: 0 },
        { rx: r, ry: r * 0.35, tilt: Math.PI / 3, electronSpeed: 0.8, electronOffset: 2.1 },
        { rx: r, ry: r * 0.35, tilt: -Math.PI / 3, electronSpeed: 1.2, electronOffset: 4.2 },
      ];

      orbits.forEach((orb) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(orb.tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, orb.rx, orb.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${colorStr},${alpha * 0.2})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const angle = t * speed * orb.electronSpeed + orb.electronOffset;
        const ex = orb.rx * Math.cos(angle);
        const ey = orb.ry * Math.sin(angle);

        for (let trail = 1; trail <= 6; trail++) {
          const ta = t * speed * orb.electronSpeed + orb.electronOffset - trail * 0.08;
          const tex = orb.rx * Math.cos(ta);
          const tey = orb.ry * Math.sin(ta);
          ctx.beginPath();
          ctx.arc(tex, tey, r * 0.04 * (1 - trail / 7), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorStr},${alpha * 0.3 * (1 - trail / 7)})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(ex, ey, r * 0.07, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorStr},${alpha * 1.0})`;
        ctx.fill();

        const eGlow = ctx.createRadialGradient(ex, ey, 0, ex, ey, r * 0.18);
        eGlow.addColorStop(0, `rgba(${colorStr},${alpha * 0.5})`);
        eGlow.addColorStop(1, `rgba(${colorStr},0)`);
        ctx.beginPath();
        ctx.arc(ex, ey, r * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = eGlow;
        ctx.fill();

        ctx.restore();
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;
      atoms.forEach((a) => drawAtom(a.cx, a.cy, a.size, t, a.speed, a.color, 0.15));
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ── Project Card ──
function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, boxShadow: "0 0 32px rgba(212,175,55,0.10)" }}
      style={{
        background: "rgba(10,8,4,0.93)",
        border: "0.5px solid rgba(212,175,55,0.12)",
        borderRadius: 3,
        padding: "1.5rem",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.25s",
        backdropFilter: "blur(4px)",
      }}
      className="project-card"
    >
      <div style={{ fontSize: 11, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", color: GOLD, letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
        {project.type}
      </div>
      <div style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem", lineHeight: 1.3, fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0e8d0" }}>
        {project.title}
      </div>
      <p style={{ fontSize: 13.5, color: "#8a8070", lineHeight: 1.75, marginBottom: "1rem", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {project.desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1rem" }}>
        {project.tech.map((t) => (
          <span key={t} style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 11, padding: "3px 10px", background: "rgba(212,175,55,0.06)", color: GOLD, border: "0.5px solid rgba(212,175,55,0.2)", borderRadius: 2, letterSpacing: "0.03em" }}>
            {t}
          </span>
        ))}
      </div>
      <a href={project.link} target="_blank" rel="noreferrer"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12, color: "#5a5248", textDecoration: "none", letterSpacing: "0.03em", display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = GOLD)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#5a5248")}
      >
        {project.link === "#" ? "In Progress →" : "View Code →"}
      </a>
    </motion.div>
  );
}

const GOLD = "#d4af37";
const GOLD_DIM = "rgba(212,175,55,0.22)";

// ── Experience Item ──
function ExpItem({ company, role, period, desc, delay }: { company: string; role: string; period: string; desc: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      style={{ display: "grid", gridTemplateColumns: "140px 1px 1fr", gap: "0 2rem", paddingBottom: "2.5rem" }}
    >
      <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 13, color: "#5a5248", textAlign: "right", paddingTop: 4, lineHeight: 1.4 }}>
        {period}
      </div>
      <div style={{ width: 1, background: GOLD_DIM, position: "relative" }}>
        <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: GOLD, boxShadow: `0 0 8px ${GOLD}` }} />
      </div>
      <div style={{ paddingBottom: "2rem" }}>
        <div style={{ fontSize: 12, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", color: GOLD, letterSpacing: "0.05em", marginBottom: 4 }}>
          {company}
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0e8d0" }}>{role}</div>
        <p style={{ fontSize: 13.5, color: "#8a8070", lineHeight: 1.75, fontFamily: "Georgia, 'Times New Roman', serif" }}>{desc}</p>
      </div>
    </motion.div>
  );
}

// ── Skill Group ──
function SkillGroup({ group, items, delay }: { group: string; items: string[]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{ background: "rgba(10,8,4,0.92)", border: "0.5px solid rgba(212,175,55,0.12)", borderRadius: 3, padding: "1.2rem", backdropFilter: "blur(4px)" }}
    >
      <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 700 }}>
        {group}
      </div>
      <ul style={{ listStyle: "none" }}>
        {items.map((item) => (
          <li key={item} style={{ fontSize: 13, color: "#8a8070", padding: "3px 0", display: "flex", alignItems: "center", gap: 8, fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <span style={{ width: 4, height: 4, background: GOLD, borderRadius: "50%", opacity: 0.55, flexShrink: 0, display: "inline-block" }} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ── Resume Section ──
function ResumeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const certifications = [
    "Supervised Machine Learning — Stanford Online / Coursera",
    "Bajaj Manufacturing System CP — Bajaj Auto Ltd.",
    "Bajaj Manufacturing System ACP — Bajaj Auto Ltd.",
    "Introduction to Data Science — Cisco Networking Academy",
  ];

  return (
    <section id="resume" style={{ padding: "5rem 2rem", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 10 }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>Curriculum Vitae</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.01em", fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0e8d0" }}>Résumé</h2>
        </div>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <a href="#"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0.8rem 2rem", border: `1px solid ${GOLD_DIM}`, borderRadius: 3, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 14, color: GOLD, textDecoration: "none", background: "rgba(212,175,55,0.04)", transition: "background 0.2s, border-color 0.2s", letterSpacing: "0.05em" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.1)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(212,175,55,0.5)`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.04)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = GOLD_DIM; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Full CV (PDF)
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem", borderBottom: `0.5px solid ${GOLD_DIM}`, paddingBottom: "0.5rem", fontWeight: 700 }}>
              Education
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1rem", fontWeight: 700, marginBottom: 4, color: "#f0e8d0" }}>B.Tech, Mechanical Engineering</div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 13, color: GOLD, marginBottom: 4 }}>Bajaj Institute of Technology, Wardha</div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 12, color: "#5a5248", marginBottom: 8 }}>Jul 2022 – Jun 2026 · Maharashtra, India</div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: "#5a5248", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Relevant Coursework</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {["Fluid Mechanics", "Thermodynamics", "Heat Transfer", "Strength of Materials", "Machine Design"].map(c => (
                  <span key={c} style={{ fontSize: 11, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", padding: "2px 8px", background: "rgba(212,175,55,0.05)", color: "#8a8070", border: "0.5px solid rgba(212,175,55,0.15)", borderRadius: 2 }}>{c}</span>
                ))}
              </div>
            </div>

            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", borderBottom: `0.5px solid ${GOLD_DIM}`, paddingBottom: "0.5rem", marginTop: "2rem", fontWeight: 700 }}>
              Achievements
            </div>
            {[
              { title: "Smart India Hackathon 2023 — Runner-Up", sub: "Top 5 among 390 teams nationally, Govt. of India" },
              { title: "Shiksha Mandal Badminton Champion", sub: "3× consecutive first place; Interzonal Runner-Up" },
            ].map(a => (
              <div key={a.title} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "0.9rem" }}>
                <span style={{ width: 5, height: 5, background: GOLD, borderRadius: "50%", opacity: 0.7, flexShrink: 0, marginTop: 5 }} />
                <div>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 13, color: "#c0b898", display: "block", fontWeight: 600 }}>{a.title}</span>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12, color: "#5a5248" }}>{a.sub}</span>
                </div>
              </div>
            ))}

            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", borderBottom: `0.5px solid ${GOLD_DIM}`, paddingBottom: "0.5rem", marginTop: "2rem", fontWeight: 700 }}>
              Key Competencies
            </div>
            {[
              "Physics-Informed Machine Learning",
              "Computational Fluid Dynamics",
              "Predictive Maintenance Systems",
              "Industrial Automation & PLC",
              "Robotics & Control Systems",
              "Scientific Computing (Python, MATLAB)",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 4, height: 4, background: GOLD, borderRadius: "50%", opacity: 0.6, flexShrink: 0 }} />
                <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 13, color: "#8a8070" }}>{item}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem", borderBottom: `0.5px solid ${GOLD_DIM}`, paddingBottom: "0.5rem", fontWeight: 700 }}>
              Certifications
            </div>
            {certifications.map((cert) => (
              <div key={cert} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "0.9rem" }}>
                <span style={{ width: 5, height: 5, background: GOLD, borderRadius: "50%", opacity: 0.7, flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 13, color: "#8a8070", lineHeight: 1.5 }}>{cert}</span>
              </div>
            ))}

            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem", borderBottom: `0.5px solid ${GOLD_DIM}`, paddingBottom: "0.5rem", marginTop: "2rem", fontWeight: 700 }}>
              Languages & Tools
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Python", "C / C++", "MATLAB", "PyTorch", "TensorFlow", "Scikit-learn", "NumPy", "Pandas", "SolidWorks", "CATIA", "Creo", "Ansys", "OpenFOAM", "PLC (Siemens TIA)", "Git", "LaTeX", "HTML / CSS"].map((tool) => (
                <span key={tool} style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 11, padding: "4px 10px", background: "rgba(212,175,55,0.05)", color: GOLD, border: "0.5px solid rgba(212,175,55,0.18)", borderRadius: 2 }}>
                  {tool}
                </span>
              ))}
            </div>

            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", borderBottom: `0.5px solid ${GOLD_DIM}`, paddingBottom: "0.5rem", marginTop: "2rem", fontWeight: 700 }}>
              Contact
            </div>
            {[
              { label: "Email", val: "ojaskidilay04@gmail.com" },
              { label: "Location", val: "Wardha, Maharashtra" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", gap: 10, marginBottom: 7, fontSize: 13, fontFamily: "Georgia, 'Times New Roman', serif" }}>
                <span style={{ color: "#5a5248", minWidth: 55, fontStyle: "italic" }}>{c.label}</span>
                <span style={{ color: "#8a8070" }}>{c.val}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── MAIN PORTFOLIO ──
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#080604", color: "#e8dfc8", fontFamily: "Georgia, 'Times New Roman', serif", overflowX: "hidden", minHeight: "100vh" }}>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .project-card:hover { border-color: rgba(212,175,55,0.28) !important; }
        @keyframes pulse-line { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
      `}</style>

      <AtomCanvas />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem",
        background: scrolled ? "rgba(8,6,4,0.92)" : "rgba(8,6,4,0.55)",
        backdropFilter: "blur(14px)",
        borderBottom: `0.5px solid rgba(212,175,55,0.1)`,
        transition: "background 0.3s",
      }}>
        <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", color: GOLD, fontSize: 15, letterSpacing: "0.05em" }}>O. Kidilay</span>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["experience", "projects", "skills", "resume", "contact"].map((s) => (
            <a key={s} href={`#${s}`}
              style={{ color: "#5a5248", textDecoration: "none", fontSize: 14, letterSpacing: "0.05em", transition: "color 0.2s", fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = GOLD)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#5a5248")}
            >
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "6rem 2rem 4rem", position: "relative", zIndex: 10 }}>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 13, color: GOLD, letterSpacing: "0.18em", marginBottom: "1.5rem" }}>
          Physics + AI · Mechatronics · Scientific ML
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "1.5rem", fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0e8d0" }}>
          Ojas Kidilay<br />
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: "clamp(14px, 2vw, 17px)", color: "#5a5248", marginBottom: "2rem" }}>
          Graduate Trainee Engineer &amp; AI Researcher
        </motion.p>

        {/* ── RESEARCHER INTRODUCTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          style={{ maxWidth: 700, background: "rgba(212,175,55,0.03)", border: `0.5px solid rgba(212,175,55,0.14)`, borderRadius: 3, padding: "1.8rem 2rem", marginBottom: "2.5rem", backdropFilter: "blur(8px)" }}
        >
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 11, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "0.9rem" }}>
            — Research Statement —
          </div>

          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 15.5, lineHeight: 1.85, color: "#b8a888", marginBottom: "1rem" }}>
            I build <em style={{ color: "rgba(203, 154, 39, 1)" }}>physics-informed machine learning models</em> that solve real engineering systems. My work focuses on Physics-Informed Neural Networks (PINNs), where governing equations like Navier–Stokes and heat transfer are embedded directly into the training process.
          </p>

          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 15.5, lineHeight: 1.85, color: "#8a8070" }}>
            This enables neural networks to learn physically consistent solutions without large datasets, combining the rigor of physics with the flexibility of deep learning. My goal is to reduce the computational cost of simulation while maintaining <em style={{ color: "#d4b870" }}>engineering-level accuracy</em>.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.6 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#projects" style={{ padding: "0.7rem 2rem", borderRadius: 3, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 14, letterSpacing: "0.05em", background: GOLD, color: "#080604", textDecoration: "none", transition: "background 0.2s", fontWeight: 700 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#e8c84a")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = GOLD)}>
            View Projects
          </a>
          <a href="/OjasResume (4).pdf" style={{ padding: "0.7rem 2rem", borderRadius: 3, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 14, letterSpacing: "0.05em", background: "transparent", color: GOLD, border: `1px solid rgba(212,175,55,0.3)`, textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")}>
            View Résumé
          </a>
          <a href="https://github.com/SimulatedEinstein" target="_blank" rel="noreferrer"
            style={{ padding: "0.7rem 2rem", borderRadius: 3, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 14, letterSpacing: "0.05em", background: "transparent", color: "#5a5248", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = GOLD; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#5a5248"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
            GitHub →
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#5a5248", fontSize: 11, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", letterSpacing: "0.1em" }}>
          <span>scroll</span>
          <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${GOLD}, transparent)`, animation: "pulse-line 2s ease infinite" }} />
        </motion.div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: "5rem 2rem", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>Career</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.01em", fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0e8d0" }}>Experience</h2>
        </div>
        <div>
          <ExpItem
            company="Bajaj Engineering Skills Training"
            role="Graduate Trainee Engineer"
            period="Nov 2025 – Present"
            desc="Designed a hydraulic steering circuit for heavy-vehicle applications (150 bar / 12 L·min⁻¹), validated in SolidWorks within ±5% of theoretical values. Built PLC ladder logic and a 3-screen HMI in Siemens TIA Portal to automate a bottling plant mixing process — cutting manual intervention ~40% and fault detection time ~30%. Benchmarked LSTM vs Random Forest on NASA C-MAPSS for RUL prediction (92% vs 87% accuracy; 8× inference speed trade-off)."
            delay={0}
          />
          <ExpItem
            company="Intrainz Innovation Pvt. Ltd."
            role="Robotics Intern"
            period="May 2023 – Jul 2023"
            desc="Designed and tested a 3-DOF robotic claw mechanism achieving ±0.5 mm positional accuracy through PID control and multi-sensor fusion. Documented dynamic model, kinematic equations, and PID tuning methodology; findings guided iterative design improvements across 3 prototype iterations."
            delay={0.15}
          />
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>Research &amp; Engineering</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.01em", fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0e8d0" }}>Projects</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>Technical</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.01em", fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0e8d0" }}>Skills</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1rem" }}>
          {SKILLS.map((s, i) => (
            <SkillGroup key={s.group} group={s.group} items={s.items} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── RESUME ── */}
      <ResumeSection />

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "5rem 2rem", textAlign: "center", borderTop: "0.5px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 10 }}>
        <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>Get in Touch</span>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "1.5rem", fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0e8d0" }}>Let's Collaborate</h2>
        <a href="mailto:ojaskidilay04@gmail.com"
          style={{ fontSize: "clamp(1rem, 2.5vw, 1.6rem)", fontWeight: 700, color: GOLD, textDecoration: "none", display: "block", marginBottom: "1.5rem", transition: "opacity 0.2s", fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.65")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}>
          ojaskidilay04@gmail.com
        </a>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
          {[
            { label: "GitHub", href: "https://github.com/SimulatedEinstein" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/ojas-kidilay-12616b259/" },
          ].map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 13, color: "#5a5248", textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = GOLD)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#5a5248")}>
              {l.label}
            </a>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "1.5rem 2rem", textAlign: "center", fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12, color: "#3a3028", borderTop: "0.5px solid rgba(255,255,255,0.04)", letterSpacing: "0.05em", position: "relative", zIndex: 10 }}>
        Ojas Kidilay — Physics × AI × Engineering
      </footer>
    </div>
  );
}