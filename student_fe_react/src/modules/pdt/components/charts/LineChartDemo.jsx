import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { month: "Jan", students: 30 },
  { month: "Feb", students: 80 },
  { month: "Mar", students: 45 },
  { month: "Apr", students: 60 },
  { month: "May", students: 45 },
  { month: "Jun", students: 40 },
  { month: "Jul", students: 55 },
  { month: "Aug", students: 75 },
  { month: "Sep", students: 140 },
  { month: "Oct", students: 120 },
  { month: "Nov", students: 150 },
  { month: "Dec", students: 185 },
];

export default function LineChartDemo() {
  return (
    <div className="h-[350px]"> {/* or h-96 */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: "Tháng", position: "insideBottom", offset: -10 }} />
          <YAxis label={{ value: "Số lượng sinh viên",
                          angle: -90, 
                          position: "insideLeft", 
                          offset: 0,
                          style: { textAnchor: "middle" }}} />
          <Tooltip formatter={(value) => `${value} Sinh viên`} />
          <Line
            type="monotone"
            dataKey="students"
            name="Số lượng"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 6 }}
          />        
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}