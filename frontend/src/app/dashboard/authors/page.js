"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";

const INITIAL_FORM = { name: "", bio: "" };

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // 'create' | 'edit'
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // State untuk ConfirmDialog delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const fetchAuthors = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await api.get("/authors", {
          params: { page, limit: 10, search },
        });
        setAuthors(res.data.data);
        setPagination(res.data.pagination);
      } catch {}
      setLoading(false);
    },
    [search],
  );

  useEffect(() => {
    fetchAuthors(1);
  }, [fetchAuthors]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    return errs;
  };

  const openCreate = () => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setModal("create");
  };

  const openEdit = (author) => {
    setForm({ name: author.name, bio: author.bio || "" });
    setEditId(author.id);
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
      if (modal === "create") {
        await api.post("/authors", form);
      } else {
        await api.put(`/authors/${editId}`, form);
      }
      setModal(null);
      fetchAuthors(pagination.page);
    } catch (err) {
      setFormErrors({
        server: err.response?.data?.message || "Something went wrong",
      });
    }
    setSubmitting(false);
  };

  // Buka ConfirmDialog sebelum delete
  const handleDeleteClick = (author) => {
    setDeleteTarget({ id: author.id, name: author.name });
    setConfirmOpen(true);
  };

  // Eksekusi delete setelah konfirmasi
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/authors/${deleteTarget.id}`);
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchAuthors(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
    setDeleting(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Authors</h1>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Add Author
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Bio</th>
              <th className="px-4 py-3 text-left">Books</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : authors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No authors found
                </td>
              </tr>
            ) : (
              authors.map((author, idx) => (
                <tr key={author.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">
                    {(pagination.page - 1) * 10 + idx + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {author.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {author.bio || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                      {author._count?.books || 0} books
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => openEdit(author)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(author)}
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

      <Pagination pagination={pagination} onPageChange={fetchAuthors} />

      {/* Modal Create/Edit */}
      {modal && (
        <Modal
          title={modal === "create" ? "Add Author" : "Edit Author"}
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
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.name ? "border-red-400" : "border-gray-300"}`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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

      {/* ConfirmDialog Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Author"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
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
