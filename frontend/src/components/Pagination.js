export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total, limit } = pagination;

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <span>
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
        {total} records
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
        >
          ← Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => Math.abs(p - page) <= 2)
          .map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 border rounded-lg ${p === page ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"}`}
            >
              {p}
            </button>
          ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
