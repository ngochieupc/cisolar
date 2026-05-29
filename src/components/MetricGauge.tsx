import React from "react";

interface MetricGaugeProps {
  value: number;
  min: number;
  max: number;
  title: string;
  unit: string;
  color?: string;
  type?: "pf" | "mba" | "general";
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({
  value,
  min,
  max,
  title,
  unit,
  color,
  type = "general",
}) => {
  // Constrain value
  const val = Math.max(min, Math.min(max, value));
  const percent = (val - min) / (max - min || 1);
  
  // Choose standard color based on value / type if not provided
  let activeColor = color || "var(--cyan)";
  if (!color) {
    if (type === "pf") {
      activeColor = val < 0.85 ? "#ff4444" : val < 0.90 ? "#ffb020" : "#00ff88";
    } else if (type === "mba") {
      activeColor = val > 85 ? "#ff4444" : val > 70 ? "#ffb020" : "#00d4ff";
    }
  }

  // SVG parameters
  const size = 180;
  const radius = 70;
  const strokeWidth = 12;
  const cx = size / 2;
  const cy = size - 30; // Shift down for semi-circle
  
  // Semi-circle arc definitions (starts at 180deg (-Math.PI) to 0deg (0))
  // The perimeter of a full circle is 2 * PI * r
  // Semi-circle perimeter is PI * r
  const circ = Math.PI * radius;
  const strokeDashoffset = circ * (1 - percent);

  // Calulate needle tip coordinates
  const angle = Math.PI + percent * Math.PI; // from PI to 2*PI rad
  const needleLen = radius - 10;
  const needleX = cx + needleLen * Math.cos(angle);
  const needleY = cy + needleLen * Math.sin(angle);

  const isDark = typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false;
  const cardBgColor = isDark ? "bg-industrial-card" : "bg-white";
  const borderCol = isDark ? "border-[#23354e]/60" : "border-[#cbd5e1]";
  const arcBgColor = isDark ? "#1e293b" : "#e2e8f0";
  const labelColor = isDark ? "#7aa3c8" : "#475569";
  const needleColor = isDark ? "#ffffff" : "#0f172a";
  const innerKnobColor = isDark ? "#0d1520" : "#ffffff";
  const centerKnobColor = isDark ? "#ffffff" : "#0f172a";

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-lg ${cardBgColor} border ${borderCol} shadow-lg relative overflow-hidden group hover:border-[#0284c7]/50 transition-all duration-300`}>
      {/* Background glow aligned with dial value */}
      <div 
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full filter blur-[40px] opacity-10 transition-all duration-500"
        style={{ backgroundColor: activeColor }}
      />
      
      <span className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2 block">{title}</span>
      
      <svg width={size} height={size - 20} className="overflow-visible">
        <defs>
          <linearGradient id={`gaugeGrad-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? "#1e3248" : "#94a3b8"} />
            <stop offset="100%" stopColor={activeColor} />
          </linearGradient>
          <filter id="glow-heavy" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Gray Background Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={arcBgColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 5px ${activeColor}55)`
          }}
        />

        {/* Needle Line */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={needleColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Center Knob */}
        <circle cx={cx} cy={cy} r="6" fill={centerKnobColor} />
        <circle cx={cx} cy={cy} r="3" fill={innerKnobColor} />
        
        {/* Min / Max Labels */}
        <text x={cx - radius - 2} y={cy + 15} fill={labelColor} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
          {min.toFixed(type === "pf" ? 1 : 0)}
        </text>
        <text x={cx + radius + 2} y={cy + 15} fill={labelColor} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
          {max.toFixed(type === "pf" ? 1 : 0)}
        </text>
      </svg>
      
      <div className="text-center -mt-3 relative z-10">
        <span 
          className="text-2xl font-bold font-display tracking-tight transition-colors duration-500"
          style={{ 
            color: activeColor,
            textShadow: `0 0 10px ${activeColor}33` 
          }}
        >
          {type === "pf" ? value.toFixed(3) : value.toFixed(1)}{unit === "%" ? "" : " " + unit}
          {unit === "%" && <span className="text-sm ml-0.5">{unit}</span>}
        </span>
      </div>
    </div>
  );
};
