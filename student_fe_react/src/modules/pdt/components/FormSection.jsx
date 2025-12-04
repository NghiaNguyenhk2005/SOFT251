// src/components/FormSection.jsx
export default function FormSection({ title, fields, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.target));
      }}
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="text-sm font-medium text-slate-700">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            className="border rounded-md px-2 py-1 text-sm"
            required={field.required}
          />
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}