// src/components/DataTable.jsx
export default function DataTable({ columns, data }) {
  return (
    <table className="min-w-full border border-slate-200 rounded-md bg-white">
      <thead className="bg-slate-100">
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="px-4 py-2 text-left text-sm font-semibold text-slate-700"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-t hover:bg-slate-50">
            {columns.map((col) => (
              <td key={col} className="px-4 py-2 text-sm text-slate-600">
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}