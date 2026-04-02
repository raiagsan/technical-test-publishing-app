"use client";
import { useAuth } from "@/context/authContext";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome, {user?.name}! 👋
      </h1>
      <p className="text-gray-500">
        Manage your book catalog from the sidebar.
      </p>
      <div className="grid grid-cols-3 gap-6 mt-8">
        {[
          {
            label: "Authors",
            icon: "✍️",
            href: "/dashboard/authors",
            color: "bg-purple-100 text-purple-700",
          },
          {
            label: "Publishers",
            icon: "🏢",
            href: "/dashboard/publishers",
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Books",
            icon: "📚",
            href: "/dashboard/books",
            color: "bg-blue-100 text-blue-700",
          },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`${item.color} rounded-xl p-6 flex flex-col items-center gap-3 hover:opacity-80 transition`}
          >
            <span className="text-4xl">{item.icon}</span>
            <span className="font-semibold text-lg">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
