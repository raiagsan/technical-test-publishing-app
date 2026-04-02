"use client";
import { useAuth } from "@/context/authContext";
import { usePathname } from "next/navigation";

const PAGE_LABELS = {
  "/dashboard": "Dashboard",
  "/dashboard/authors": "Authors",
  "/dashboard/publishers": "Publishers",
  "/dashboard/books": "Books",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const pageTitle = PAGE_LABELS[pathname] || "Dashboard";

  const breadcrumbs = [{ label: "Home", href: "/dashboard" }];
  if (pathname !== "/dashboard") {
    breadcrumbs.push({ label: pageTitle, href: pathname });
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Kiri: Breadcrumb + Page Title */}
      <div>
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {idx > 0 && <span>/</span>}
              <a
                href={crumb.href}
                className={
                  idx === breadcrumbs.length - 1
                    ? "text-blue-600 font-medium"
                    : "hover:text-gray-600 transition"
                }
              >
                {crumb.label}
              </a>
            </span>
          ))}
        </nav>
        <h2 className="text-base font-semibold text-gray-800 leading-tight">
          {pageTitle}
        </h2>
      </div>

      {/* Kanan: User info + logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold select-none">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-400 leading-tight">{user?.email}</p>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        <button
          onClick={logout}
          title="Logout"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
