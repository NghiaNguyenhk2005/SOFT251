// src/components/charts/BarChartDemo.jsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { subject: "CSE", tutors: 16 },
  { subject: "EEE", tutors: 12 },
  { subject: "ME", tutors: 10 },
  { subject: "CE", tutors: 8 },
  { subject: "CHE", tutors: 9 },
  { subject: "MSE", tutors: 7 },
  { subject: "ENV", tutors: 6 },
  { subject: "TE", tutors: 5 },
  { subject: "IM", tutors: 11 },
];

// Custom Tooltip to remove "tutors:" prefix
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const mapping = {
      CSE: "Khoa Khoa học & Kỹ thuật Máy tính",
      EEE: "Khoa Điện - Điện tử",
      ME: "Khoa Cơ khí",
      CE: "Khoa Xây dựng",
      CHE: "Khoa Kỹ thuật Hóa học",
      MSE: "Khoa Công nghệ Vật liệu",
      ENV: "Khoa Kỹ thuật Môi trường",
      TE: "Khoa Kỹ thuật Giao thông",
      IM: "Khoa Quản lý Công nghiệp",
    };
    return (
      <div style={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: "8px" }}>
        <p style={{ margin: 0, fontWeight: "bold" }}>{mapping[label] || label}</p>
        <p style={{ margin: 0 }}>{payload[0].value} tutor</p>
      </div>
    );
  }
  return null;
};

export default function BarChartDemo() {
  return (
    <ResponsiveContainer width="100%" height={650}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="subject"
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-30}
          textAnchor="end"
        />
        <YAxis
          label={{
            value: "Số lượng tutor đang hoạt động",
            angle: -90,
            position: "insideLeft",
            offset: 0,
            style: { textAnchor: "middle" },
          }}
        />
        {/* ✅ Use custom tooltip */}
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="tutors"
          fill="#10b981"
          barSize={40}
          label={{ position: "top" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}