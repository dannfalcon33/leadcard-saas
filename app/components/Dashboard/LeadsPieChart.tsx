"use client";

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Convertidos", value: 3, color: "#10b981" }, // emerald-500
  { name: "Pendientes", value: 5, color: "#3b82f6" }, // blue-500
  { name: "Descartados", value: 2, color: "#ef4444" }, // red-500
];

export function LeadsPieChart() {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderColor: "#374151",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}
