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
// ── Aerodynamic Flow Canvas Background (Thermal Convection Spark Simulation) ──
function AerodynamicFlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animId: number;
    let time = 0;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particleCount = 140;
    const particles: {
      x: number;
      y: number;
      speed: number;
      size: number;
      life: number;
      maxLife: number;
      vy: number;
      temp: number; // 0 (cold) to 1 (white-hot)
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: 2 + Math.random() * 3,
        size: 1.0 + Math.random() * 1.5,
        life: Math.random() * 200,
        maxLife: 150 + Math.random() * 100,
        vy: (Math.random() - 0.5) * 0.2,
        temp: 0,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      // Clear canvas with high translucency for spark trails
      ctx.fillStyle = "rgba(9, 10, 15, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time += 1.0;
      
      const W = canvas.width;
      const H = canvas.height;

      // Hot Cylinder Core (heat-exchanger tube) at center-left
      const cx = W * 0.25;
      const cy = H * 0.5;
      const R = 45; // Cylinder radius

      // Draw the hot glowing cylinder tube
      ctx.save();
      const cylinderGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R + 30);
      cylinderGlow.addColorStop(0, "rgba(245, 158, 11, 0.28)");
      cylinderGlow.addColorStop(0.4, "rgba(217, 119, 6, 0.12)");
      cylinderGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R + 30, 0, Math.PI * 2);
      ctx.fillStyle = cylinderGlow;
      ctx.fill();

      // Outer solid metal shell with gold glowing border
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = "#111217";
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Update and Draw Sparks
      particles.forEach((p) => {
        p.x += p.speed;
        p.y += p.vy;
        p.life += 1;

        // Reset particle if off-screen or dead
        if (p.x > W || p.life > p.maxLife) {
          p.x = 0;
          p.y = Math.random() * H;
          p.life = 0;
          p.speed = 2.2 + Math.random() * 3;
          p.vy = (Math.random() - 0.5) * 0.25;
          p.temp = 0;
        }

        // 1. Distance to hot cylinder core
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const R_barrier = R + 12;

        if (dist < R_barrier) {
          const angle = Math.atan2(dy, dx);
          // Push spark around the cylinder barrier
          p.x = cx + Math.cos(angle) * R_barrier;
          p.y = cy + Math.sin(angle) * R_barrier;

          // Absorb heat: temperature snaps to white-hot
          p.temp = 1.0;

          // Thermal buoyancy: sparks rise upwards as they absorb heat
          p.vy = -1.2 + (Math.random() - 0.5) * 0.3;
        }

        // 2. Downstream cooling and convection wake
        if (dx > 0) {
          // Slowly cool down temperature
          p.temp *= 0.985;
          // Buoyancy slowly stabilizes back to horizontal flow
          p.vy *= 0.98;
          
          // Convective turbulence ripples
          const wakeWave = Math.sin(time * 0.08 - dx * 0.02) * Math.cos(time * 0.03) * 1.5 * Math.exp(-dx * 0.003);
          p.y += wakeWave;
        }

        // 3. Mouse Interaction (Acts as secondary heat target attracting sparks)
        if (mouseRef.current.active) {
          const mdx = p.x - mouseRef.current.x;
          const mdy = p.y - mouseRef.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 75) {
            // Heat up slightly
            p.temp = Math.max(p.temp, 0.4 * (1 - mdist / 75));
            // Pull upward
            p.vy -= 0.1;
          }
        }

        // Color interpolation based on temperature (white-hot -> gold -> amber -> deep red-orange)
        let colorStr = "120, 110, 115"; // Cold particles are neutral gray/slate
        let alphaVal = Math.min(1, 1 - p.life / p.maxLife) * 0.35;
        
        if (p.temp > 0.75) {
          colorStr = "255, 252, 230"; // White-hot
          alphaVal *= 1.8;
        } else if (p.temp > 0.4) {
          colorStr = "245, 158, 11"; // Supersonic Gold
          alphaVal *= 1.4;
        } else if (p.temp > 0.1) {
          colorStr = "217, 119, 6"; // Deep Amber
          alphaVal *= 1.1;
        } else if (p.temp > 0.02) {
          colorStr = "180, 83, 9"; // Red-orange
        } else {
          colorStr = "100, 105, 115"; // Cool state
          alphaVal *= 0.55;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + p.temp * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorStr}, ${alphaVal})`;
        
        // Add glowing shadow to hot active sparks
        if (p.temp > 0.4) {
          ctx.shadowColor = `rgba(${colorStr}, 0.55)`;
          ctx.shadowBlur = 5;
        }
        ctx.fill();
        ctx.restore();

        // Spark trail
        if (p.x > 8) {
          ctx.beginPath();
          ctx.moveTo(p.x - p.speed * 1.4, p.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${colorStr}, ${alphaVal * 0.32})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
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

const GOLD_ACCENT = "#f59e0b";
const GOLD_DIM_ACCENT = "rgba(245, 158, 11, 0.15)";
const GOLD = GOLD_ACCENT;
const GOLD_DIM = GOLD_DIM_ACCENT;

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

// ── PINN Simulator Section ──
function PinnSimulatorSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  
  const [epoch, setEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [showCollocation, setShowCollocation] = useState(true);
  const [customPoints, setCustomPoints] = useState<{ x: number; y: number }[]>([]);
  const [noiseGrid, setNoiseGrid] = useState<number[][]>([]);
  
  // Initialize noise grid once on client-side
  useEffect(() => {
    const grid = [];
    for (let i = 0; i < 30; i++) {
      const row = [];
      for (let j = 0; j < 30; j++) {
        row.push(Math.random() - 0.5);
      }
      grid.push(row);
    }
    setNoiseGrid(grid);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Exact 2D Laplace heat analytical solution
  const getAnalyticalT = (x: number, y: number) => {
    let T = 0;
    for (let n = 1; n < 30; n += 2) {
      const coeff = 400 / (n * Math.PI * Math.sinh(n * Math.PI));
      T += coeff * Math.sin(n * Math.PI * x) * Math.sinh(n * Math.PI * y);
    }
    return T;
  };

  const getSimulatedT = (x: number, y: number, ep: number, noise: number[][], gridX: number, gridY: number) => {
    if (!noise || noise.length === 0) return 0;
    if (ep === 0) {
      return (noise[gridX]?.[gridY] ?? 0) * 45 + 15;
    }
    
    const tBC = Math.min(1, ep / 50);
    const analytical = getAnalyticalT(x, y);
    
    // Boundary layer condition profiles (hot top boundary, cold other boundaries)
    const isTop = y > 0.95;
    const isBoundary = y < 0.05 || x < 0.05 || x > 0.95;
    const boundaryOnly = isTop ? 100 * tBC : isBoundary ? 0 : 0;
    
    const noiseLevel = Math.max(0, 1 - ep / 80);
    const currentNoise = (noise[gridX]?.[gridY] ?? 0) * 45 * noiseLevel;
    
    if (ep < 50) {
      const blend = ep / 50;
      return (boundaryOnly * (1 - blend)) + (analytical * blend * 0.3) + currentNoise;
    } else {
      const blend = (ep - 50) / 250; // 0 to 1
      const wave = Math.sin(x * 14 + ep * 0.12) * Math.cos(y * 14) * 7 * (1 - blend);
      return (analytical * (0.3 + 0.7 * blend)) + wave;
    }
  };

  const getTempColor = (t: number) => {
    const temp = Math.max(0, Math.min(100, t));
    if (temp < 25) {
      const ratio = temp / 25;
      const r = Math.round(11 * (1 - ratio) + 22 * ratio);
      const g = Math.round(14 * (1 - ratio) + 28 * ratio);
      const b = Math.round(23 * (1 - ratio) + 48 * ratio);
      return `rgb(${r},${g},${b})`;
    } else if (temp < 50) {
      const ratio = (temp - 25) / 25;
      const r = Math.round(22 * (1 - ratio) + 90 * ratio);
      const g = Math.round(28 * (1 - ratio) + 68 * ratio);
      const b = Math.round(48 * (1 - ratio) + 32 * ratio);
      return `rgb(${r},${g},${b})`;
    } else if (temp < 75) {
      const ratio = (temp - 50) / 25;
      const r = Math.round(90 * (1 - ratio) + 212 * ratio);
      const g = Math.round(68 * (1 - ratio) + 160 * ratio);
      const b = Math.round(32 * (1 - ratio) + 50 * ratio);
      return `rgb(${r},${g},${b})`;
    } else {
      const ratio = (temp - 75) / 25;
      const r = Math.round(212 * (1 - ratio) + 255 * ratio);
      const g = Math.round(160 * (1 - ratio) + 248 * ratio);
      const b = Math.round(50 * (1 - ratio) + 220 * ratio);
      return `rgb(${r},${g},${b})`;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || noiseGrid.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const size = 30;
    const cellW = canvas.width / size;
    const cellH = canvas.height / size;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const x = (i + 0.5) / size;
        const y = 1 - (j + 0.5) / size;
        const T = getSimulatedT(x, y, epoch, noiseGrid, i, j);
        ctx.fillStyle = getTempColor(T);
        ctx.fillRect(i * cellW, j * cellH, cellW + 0.5, cellH + 0.5);
      }
    }
    
    if (showCollocation) {
      // Boundary points (blue rings)
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(100, 180, 255, 0.5)";
      
      // Top boundary
      for (let i = 0; i < size; i += 2) {
        ctx.beginPath();
        ctx.arc((i + 0.5) * cellW, 0.5 * cellH, 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Bottom boundary
      for (let i = 0; i < size; i += 2) {
        ctx.beginPath();
        ctx.arc((i + 0.5) * cellW, (size - 0.5) * cellH, 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Left boundary
      for (let j = 0; j < size; j += 2) {
        ctx.beginPath();
        ctx.arc(0.5 * cellW, (j + 0.5) * cellH, 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Right boundary
      for (let j = 0; j < size; j += 2) {
        ctx.beginPath();
        ctx.arc((size - 0.5) * cellW, (j + 0.5) * cellH, 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Internal collocation points (dim gold rings)
      ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
      for (let i = 3; i < size - 3; i += 4) {
        for (let j = 3; j < size - 3; j += 4) {
          ctx.beginPath();
          ctx.arc((i + 0.5) * cellW, (j + 0.5) * cellH, 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      // Custom collocation points
      customPoints.forEach(p => {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#d4af37";
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 6, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
  }, [epoch, showCollocation, customPoints, noiseGrid]);

  useEffect(() => {
    if (!isTraining) return;
    let lastTime = performance.now();
    const interval = 35; // speed of training
    let animId = requestAnimationFrame(function loop(now) {
      if (now - lastTime >= interval) {
        setEpoch(prev => {
          if (prev >= 300) {
            setIsTraining(false);
            return 300;
          }
          return prev + 1;
        });
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(animId);
  }, [isTraining]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;
    
    if (clickX > 0.05 && clickX < 0.95 && clickY > 0.05 && clickY < 0.95) {
      setCustomPoints(prev => [...prev, { x: clickX, y: clickY }]);
    }
  };

  const handleReset = () => {
    setEpoch(0);
    setIsTraining(false);
    setCustomPoints([]);
    const grid = [];
    for (let i = 0; i < 30; i++) {
      const row = [];
      for (let j = 0; j < 30; j++) {
        row.push(Math.random() - 0.5);
      }
      grid.push(row);
    }
    setNoiseGrid(grid);
  };

  const getLossBC = () => {
    if (epoch === 0) return 0.8521;
    const base = 0.8521 * Math.pow(10, -3.2 * Math.min(1, epoch / 60));
    const noiseVal = Math.max(0.0001, 0.001 * (Math.random() - 0.4) * (1 - epoch / 100));
    return parseFloat((base + noiseVal).toFixed(4));
  };

  const getLossPDE = () => {
    if (epoch === 0) return 1.9423;
    const base = 1.9423 * Math.pow(10, -2.1 * Math.min(1, epoch / 300));
    const noiseVal = Math.max(0.001, 0.006 * (Math.random() - 0.4) * (1 - epoch / 280));
    return parseFloat((base + noiseVal).toFixed(4));
  };

  const lossBC = getLossBC();
  const lossPDE = getLossPDE();
  const lossTotal = parseFloat((lossBC + lossPDE).toFixed(4));

  return (
    <section id="pinn-simulator" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10 }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>Interactive Demo</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.01em", fontFamily: "Georgia, 'Times New Roman', serif", color: "#f0e8d0" }}>Physics-Informed Neural Network (PINN) Simulator</h2>
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 14, color: "#8a8070", maxWidth: 700, margin: "0.75rem auto 0", lineHeight: 1.5 }}>
            Solving the 2D Steady-State Heat Equation (Laplace Equation: <code style={{ color: GOLD }}>∇²T = ∂²T/∂x² + ∂²T/∂y² = 0</code>) by forcing the neural network to satisfy both physics conservation laws and boundary conditions.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2.5rem",
          background: "rgba(10,8,4,0.95)",
          border: "0.5px solid rgba(212,175,55,0.14)",
          borderRadius: 4,
          padding: "2rem",
          backdropFilter: "blur(8px)",
        }}>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <div style={{ position: "absolute", top: -20, left: 0, right: 0, textAlign: "center", fontSize: 11, fontFamily: "Georgia, 'Times New Roman', serif", color: GOLD, fontStyle: "italic" }}>
                Hot Wall (T = 100°C)
              </div>
              <div style={{ position: "absolute", bottom: -20, left: 0, right: 0, textAlign: "center", fontSize: 11, fontFamily: "Georgia, 'Times New Roman', serif", color: "rgba(100, 180, 255, 0.7)", fontStyle: "italic" }}>
                Cold Wall (T = 0°C)
              </div>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: -22, writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 11, fontFamily: "Georgia, 'Times New Roman', serif", color: "rgba(100, 180, 255, 0.7)", fontStyle: "italic", textAlign: "center" }}>
                Cold Wall (T = 0°C)
              </div>
              <div style={{ position: "absolute", top: 0, bottom: 0, right: -22, writingMode: "vertical-rl", fontSize: 11, fontFamily: "Georgia, 'Times New Roman', serif", color: "rgba(100, 180, 255, 0.7)", fontStyle: "italic", textAlign: "center" }}>
                Cold Wall (T = 0°C)
              </div>

              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                onClick={handleCanvasClick}
                style={{
                  border: "1px solid rgba(212,175,55,0.22)",
                  borderRadius: 2,
                  cursor: "crosshair",
                  display: "block",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
                }}
              />
            </div>
            <div style={{ fontSize: 12, fontStyle: "italic", color: "#6a6050", textAlign: "center", marginTop: "0.5rem" }}>
              💡 Click inside the domain to place custom **collocation points** for the PINN solver to optimize.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 12, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", borderBottom: `0.5px solid ${GOLD_DIM}`, paddingBottom: "0.5rem", fontWeight: 700 }}>
                Live Optimization Metrics
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.05)", borderRadius: 3, padding: "0.75rem", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#6a6050", textTransform: "uppercase", letterSpacing: "0.05em" }}>Epoch</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f0e8d0", fontFamily: "monospace", marginTop: 4 }}>
                    {epoch} <span style={{ fontSize: 11, color: "#5a5248", fontWeight: 400 }}>/ 300</span>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.05)", borderRadius: 3, padding: "0.75rem", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#6a6050", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Loss</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: GOLD, fontFamily: "monospace", marginTop: 4 }}>
                    {epoch === 0 ? "2.7944" : lossTotal}
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.05)", borderRadius: 3, padding: "0.75rem", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#6a6050", textTransform: "uppercase", letterSpacing: "0.05em" }}>Boundary Loss (L_BC)</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "rgba(100, 180, 255, 0.9)", fontFamily: "monospace", marginTop: 4 }}>
                    {epoch === 0 ? "0.8521" : lossBC}
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.05)", borderRadius: 3, padding: "0.75rem", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#6a6050", textTransform: "uppercase", letterSpacing: "0.05em" }}>PDE Loss (L_PDE)</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#cba33d", fontFamily: "monospace", marginTop: 4 }}>
                    {epoch === 0 ? "1.9423" : lossPDE}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ alignSelf: "flex-start", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                PINN Architecture (2 → 5 → 5 → 1)
              </div>
              <div style={{ background: "rgba(0,0,0,0.2)", border: "0.5px solid rgba(212,175,55,0.08)", borderRadius: 4, width: "100%", height: 140, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <svg width="220" height="120" style={{ overflow: "visible" }}>
                  {[80, 140].map((y1) =>
                    [20, 42, 64, 86, 108].map((y2) => (
                      <path
                        key={`c1-${y1}-${y2}`}
                        d={`M 25 ${y1 - 30} C 50 ${y1 - 30}, 50 ${y2}, 75 ${y2}`}
                        fill="none"
                        stroke={isTraining ? GOLD : "rgba(212,175,55,0.1)"}
                        strokeWidth="0.6"
                        strokeDasharray={isTraining ? "3 1.5" : "none"}
                        style={{
                          animation: isTraining ? "dash 1.2s linear infinite" : "none"
                        }}
                      />
                    ))
                  )}
                  {[20, 42, 64, 86, 108].map((y1) =>
                    [20, 42, 64, 86, 108].map((y2) => (
                      <path
                        key={`c2-${y1}-${y2}`}
                        d={`M 75 ${y1} C 105 ${y1}, 105 ${y2}, 135 ${y2}`}
                        fill="none"
                        stroke={isTraining ? GOLD : "rgba(212,175,55,0.1)"}
                        strokeWidth="0.5"
                        strokeDasharray={isTraining ? "2.5 1.5" : "none"}
                        style={{
                          animation: isTraining ? "dash 0.9s linear infinite" : "none"
                        }}
                      />
                    ))
                  )}
                  {[20, 42, 64, 86, 108].map((y1) => (
                    <path
                      key={`c3-${y1}`}
                      d={`M 135 ${y1} C 160 ${y1}, 160 64, 185 64`}
                      fill="none"
                      stroke={isTraining ? GOLD : "rgba(212,175,55,0.1)"}
                      strokeWidth="0.6"
                      strokeDasharray={isTraining ? "3 1.5" : "none"}
                      style={{
                        animation: isTraining ? "dash 0.8s linear infinite" : "none"
                      }}
                    />
                  ))}

                  {[80, 140].map((y, idx) => (
                    <g key={`in-${idx}`}>
                      <circle cx="25" cy={y - 30} r="5" fill="#080604" stroke="rgba(100, 180, 255, 0.8)" strokeWidth="1.2" />
                      <text x="5" y={y - 27} fill="#8a8070" fontSize="8" fontFamily="monospace">{idx === 0 ? "x" : "y"}</text>
                    </g>
                  ))}
                  {[20, 42, 64, 86, 108].map((y, idx) => (
                    <circle key={`h1-${idx}`} cx="75" cy={y} r="3.5" fill="#080604" stroke={isTraining ? GOLD : "rgba(212,175,55,0.4)"} strokeWidth="1" />
                  ))}
                  {[20, 42, 64, 86, 108].map((y, idx) => (
                    <circle key={`h2-${idx}`} cx="135" cy={y} r="3.5" fill="#080604" stroke={isTraining ? GOLD : "rgba(212,175,55,0.4)"} strokeWidth="1" />
                  ))}
                  <g>
                    <circle cx="185" cy="64" r="5.5" fill="#080604" stroke={GOLD} strokeWidth="1.5" style={{ filter: isTraining ? `drop-shadow(0 0 4px ${GOLD})` : "none" }} />
                    <text x="196" y="67" fill={GOLD} fontSize="8.5" fontWeight="bold" fontFamily="monospace">T</text>
                  </g>
                </svg>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <button
                  onClick={() => setIsTraining(!isTraining)}
                  style={{
                    flex: 2,
                    padding: "0.7rem 1.2rem",
                    background: isTraining ? "rgba(212,175,55,0.06)" : GOLD,
                    color: isTraining ? GOLD : "#080604",
                    border: `1px solid ${GOLD}`,
                    borderRadius: 3,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                    transition: "background 0.2s, color 0.2s"
                  }}
                >
                  {isTraining ? "Pause Optimizer" : epoch === 300 ? "Optimization Complete" : epoch === 0 ? "Train PINN" : "Resume Training"}
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    padding: "0.7rem 1rem",
                    background: "transparent",
                    color: "#8a8070",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 3,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "color 0.2s, border-color 0.2s"
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD; (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#8a8070"; }}
                >
                  Reset
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, fontFamily: "Georgia, 'Times New Roman', serif" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#8a8070", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={showCollocation}
                    onChange={(e) => setShowCollocation(e.target.checked)}
                    style={{ accentColor: GOLD, cursor: "pointer" }}
                  />
                  Show Collocation &amp; BC Points
                </label>
                
                <span style={{ color: "#5a5248", fontSize: 11, fontStyle: "italic" }}>
                  {customPoints.length} custom points added
                </span>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
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
          <a href="/OjasResume (9).pdf" target="_blank" rel="noreferrer"
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
    <div style={{ background: "#0a0a0d", color: "#f4f4f5", overflowX: "hidden", minHeight: "100vh" }}>

      <style>{`
        * { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
          font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif !important;
        }
        html { scroll-behavior: smooth; }

        /* Background grid pattern */
        body {
          background-image: radial-gradient(rgba(245, 158, 11, 0.05) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        /* Modernized wind-tunnel gold gradient headers */
        .gradient-title {
          background: linear-gradient(135deg, #ffb03a 0%, #d97706 100%) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          color: transparent !important;
        }

        /* Glassmorphic card styling overrides for carbon/gold theme */
        .project-card, #skills > div > div, #pinn-simulator > div > div {
          background: rgba(18, 19, 24, 0.76) !important;
          border: 0.5px solid rgba(245, 158, 11, 0.15) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 6px !important;
        }
        
        .project-card:hover {
          border-color: #f59e0b !important;
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.22) !important;
        }

        /* Custom scrollbar matching styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0d;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.4);
        }

        /* Simulator SVG tweaks mapping to Gold */
        #pinn-simulator svg path {
          stroke: rgba(245, 158, 11, 0.15) !important;
        }
        #pinn-simulator svg path[style*="animation"] {
          stroke: #f59e0b !important;
        }
        #pinn-simulator svg circle {
          stroke: rgba(245, 158, 11, 0.35) !important;
        }
        #pinn-simulator svg circle[stroke="#d4af37"] {
          stroke: #f59e0b !important;
        }

        /* Project card and CV tags overrides */
        .project-card span {
          background: rgba(245, 158, 11, 0.05) !important;
          border: 0.5px solid rgba(245, 158, 11, 0.22) !important;
          color: #f59e0b !important;
        }
        #resume span {
          background: rgba(245, 158, 11, 0.05) !important;
          border: 0.5px solid rgba(245, 158, 11, 0.18) !important;
          color: #f59e0b !important;
        }
        #resume a {
          background: rgba(245, 158, 11, 0.04) !important;
          border-color: rgba(245, 158, 11, 0.2) !important;
          color: #f59e0b !important;
        }
        #resume a:hover {
          background: rgba(245, 158, 11, 0.1) !important;
          border-color: rgba(245, 158, 11, 0.4) !important;
        }

        @keyframes pulse-line { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
        @keyframes dash { to { stroke-dashoffset: -20; } }
      `}</style>

      <AerodynamicFlowCanvas />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem",
        background: scrolled ? "rgba(18, 19, 24, 0.88)" : "rgba(18, 19, 24, 0.48)",
        backdropFilter: "blur(14px)",
        borderBottom: `0.5px solid rgba(245, 158, 11, 0.12)`,
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
          className="gradient-title"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
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
          <a href="/OjasResume (9).pdf" target="_blank" rel="noreferrer" style={{ padding: "0.7rem 2rem", borderRadius: 3, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 14, letterSpacing: "0.05em", background: "transparent", color: GOLD, border: `1px solid rgba(212,175,55,0.3)`, textDecoration: "none", transition: "background 0.2s" }}
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

      {/* ── PINN SIMULATOR ── */}
      <PinnSimulatorSection />

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