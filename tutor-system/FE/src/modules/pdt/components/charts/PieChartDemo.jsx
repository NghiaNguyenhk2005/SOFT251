// src/components/charts/PieChartDemo.jsx
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Khoa Khoa học & Kỹ thuật Máy tính (CSE)", value: 220 },
  { name: "Khoa Điện - Điện tử (EEE)", value: 180 },
  { name: "Khoa Cơ khí (ME)", value: 150 },
  { name: "Khoa Xây dựng (CE)", value: 120 },
  { name: "Khoa Kỹ thuật Hóa học (CHE)", value: 100 },
  { name: "Khoa Công nghệ Vật liệu (MSE)", value: 80 },
  { name: "Khoa Kỹ thuật Môi trường (ENV)", value: 70 },
  { name: "Khoa Kỹ thuật Giao thông (TE)", value: 60 },
  { name: "Khoa Quản lý Công nghiệp (IM)", value: 90 },
];

const COLORS = [
  "#2563eb", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export default function PieChartDemo() {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  return (
    <ResponsiveContainer width="100%" height="100%"margin={{ top: 20, right: 30, left: 40, bottom: 50 }}>
      <PieChart margin={{ right: 50 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="80%"
          dataKey="value"
          label={({percent }) => ` ${(percent * 100).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} sinh viên`} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: "14px", color: "#334155" }}
        />
        <text
          x="57%"
          y="18%"
          textAnchor="left"
          style={{
            fontSize: "14px",
            fontWeight: "600",
            fontFamily: "Arial, Helvetica, sans-serif",
            fill: "#2563eb" // matches chart color palette
          }}
          >
            Tổng số sinh viên hiện có: {total}
        </text>

      </PieChart>
    </ResponsiveContainer>
  );
}