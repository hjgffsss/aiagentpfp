"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Node {
  id: number;
  x: number;
  y: number;
  r: number;
  delay: number;
}

// Deterministic pseudo-random layout so server/client markup matches.
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateNodes(count: number): Node[] {
  const rand = seededRandom(42);
  const nodes: Node[] = [];
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = 60 + rand() * 220;
    nodes.push({
      id: i,
      x: 250 + Math.cos(angle) * radius,
      y: 250 + Math.sin(angle) * radius,
      r: 1.5 + rand() * 2.5,
      delay: rand() * 4,
    });
  }
  return nodes;
}

const NODES = generateNodes(34);

function dist(a: Node, b: Node) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Precompute edges between nearby nodes (constellation lines).
const EDGES: [number, number][] = [];
for (let i = 0; i < NODES.length; i++) {
  for (let j = i + 1; j < NODES.length; j++) {
    if (dist(NODES[i], NODES[j]) < 95) {
      EDGES.push([i, j]);
    }
  }
}

export default function AgentConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 250, y: 250 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 500;
      const y = ((e.clientY - rect.top) / rect.height) * 500;
      setMouse({ x, y });
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseenter", () => setActive(true));
    el.addEventListener("mouseleave", () => setActive(false));
    return () => {
      el.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg viewBox="0 0 500 500" className="w-full h-full">
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ambient glow */}
        <circle cx="250" cy="250" r="220" fill="url(#coreGlow)" />

        {/* edges */}
        {EDGES.map(([a, b], i) => {
          const n1 = NODES[a];
          const n2 = NODES[b];
          const midX = (n1.x + n2.x) / 2;
          const midY = (n1.y + n2.y) / 2;
          const distToMouse = Math.hypot(midX - mouse.x, midY - mouse.y);
          const proximity = active ? Math.max(0, 1 - distToMouse / 160) : 0;
          return (
            <line
              key={i}
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke="url(#edgeGrad)"
              strokeWidth={0.6 + proximity * 1.4}
              opacity={0.12 + proximity * 0.55}
            />
          );
        })}

        {/* central agent core */}
        <g>
          <circle
            cx="250"
            cy="250"
            r="34"
            fill="#0A0C14"
            stroke="url(#edgeGrad)"
            strokeWidth="1.5"
          />
          <motion.circle
            cx="250"
            cy="250"
            r="34"
            fill="none"
            stroke="url(#edgeGrad)"
            strokeWidth="1"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.6, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="250" cy="250" r="12" fill="url(#edgeGrad)" />
        </g>

        {/* nodes */}
        {NODES.map((n) => {
          const distToMouse = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          const proximity = active ? Math.max(0, 1 - distToMouse / 140) : 0;
          return (
            <motion.circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={n.r + proximity * 2}
              fill={proximity > 0.3 ? "#67E8F9" : "#A78BFA"}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.95, 0.5] }}
              transition={{
                duration: 3 + (n.id % 4),
                repeat: Infinity,
                delay: n.delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
