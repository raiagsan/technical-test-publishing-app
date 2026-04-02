"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";

const INITIAL_FORM = {
  title: "",
  isbn: "",
  year: "",
  authorId: "",
  publisherId: "",
};

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterPublisher, setFilterPublisher] = useState("");
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // State untuk ConfirmDialog delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get("/authors", { params: { limit: 100 } })
      .then((r) => setAuthors(r.data.data));
    api
      .get("/publishers", { params: { limit: 100 } })
      .then((r) => setPublishers(r.data.data));
  }, []);

  const fetchBooks = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 10, search };
        if (filterAuthor) params.authorId = filterAuthor;
        if (filterPublisher) params.publisherId = filterPublisher;
        const res = await api.get("/books", { params });
        setBooks(res.data.data);
        setPagination(res.data.pagination);
      } catch {}
      setLoading(false);
    },
    [search, filterAuthor, filterPublisher],
  );

  useEffect(() => {
    fetchBooks(1);
  }, [fetchBooks]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.authorId) errs.authorId = "Author is required";
    if (!form.publisherId) errs.publisherId = "Publisher is required";
    if (form.year && (isNaN(form.year) || form.year < 1000 || form.year > 9999))
      errs.year = "Year must be a valid 4-digit number";
    return errs;
  };

  const openCreate = () => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setModal("create");
  };

  const openEdit = (b) => {
    setForm({
      title: b.title,
      isbn: b.isbn || "",
      year: b.year || "",
      authorId: b.authorId,
      publisherId: b.publisherId,
    });
    setEditId(b.id);
    setFormErrors({});
    setModal("edit");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        year: form.year ? parseInt(form.year) : null,
      };
      if (modal === "create") await api.post("/books", payload);
      else await api.put(`/books/${editId}`, payload);
      setModal(null);
      fetchBooks(pagination.page);
    } catch (err) {
      setFormErrors({
        server: err.response?.data?.message || "Something went wrong",
      });
    }
    setSubmitting(false);
  };

  const handleDeleteClick = (book) => {
    setDeleteTarget({ id: book.id, title: book.title });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/books/${deleteTarget.id}`);
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchBooks(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
    setDeleting(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Books</h1>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Add Book
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterAuthor}
          onChange={(e) => setFilterAuthor(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          value={filterPublisher}
          onChange={(e) => setFilterPublisher(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Publishers</option>
          {publishers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {(filterAuthor || filterPublisher || search) && (
          <button
            onClick={() => {
              setSearch("");
              setFilterAuthor("");
              setFilterPublisher("");
            }}
            className="text-sm text-gray-500 hover:text-red-500 px-2"
          >
            ✕ Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-left">Publisher</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">ISBN</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  No books found
                </td>
              </tr>
            ) : (
              books.map((book, idx) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">
                    {(pagination.page - 1) * 10 + idx + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">
                    {book.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {book.author?.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {book.publisher?.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {book.year || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {book.isbn || "-"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => openEdit(book)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(book)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={fetchBooks} />

      {modal && (
        <Modal
          title={modal === "create" ? "Add Book" : "Edit Book"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.server && (
              <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
                {formErrors.server}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.title ? "border-red-400" : "border-gray-300"}`}
              />
              {formErrors.title && (
                <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={form.isbn}
                  onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="e.g. 2023"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.year ? "border-red-400" : "border-gray-300"}`}
                />
                {formErrors.year && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.year}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <select
                value={form.authorId}
                onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.authorId ? "border-red-400" : "border-gray-300"}`}
              >
                <option value="">Select author...</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {formErrors.authorId && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.authorId}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publisher *
              </label>
              <select
                value={form.publisherId}
                onChange={(e) =>
                  setForm({ ...form, publisherId: e.target.value })
                }
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.publisherId ? "border-red-400" : "border-gray-300"}`}
              >
                <option value="">Select publisher...</option>
                {publishers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {formErrors.publisherId && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.publisherId}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) {
            setConfirmOpen(false);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
