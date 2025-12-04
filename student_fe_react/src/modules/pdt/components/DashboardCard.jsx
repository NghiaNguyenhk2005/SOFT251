// components/DashboardCard.jsx
export default function DashboardCard({
  title,
  description,
  icon,
  link,
  className = "",
}) {
  return (
    <a
      href={link}
      className={`rounded-lg shadow-lg overflow-hidden 
                  flex items-center justify-center text-center 
                  transition-transform hover:scale-[1.02] ${className}`}
    >
      <div className="p-6">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </a>
  );
}