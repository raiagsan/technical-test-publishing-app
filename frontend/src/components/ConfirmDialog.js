"use client";

export default function ConfirmDialog({
  isOpen,
  title = "Konfirmasi",
  message = "Apakah kamu yakin ingin melakukan tindakan ini?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "🗑️",
      iconBg: "bg-red-100",
      confirmBtn:
        "bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400",
    },
    warning: {
      icon: "⚠️",
      iconBg: "bg-yellow-100",
      confirmBtn:
        "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 disabled:bg-yellow-300",
    },
    info: {
      icon: "ℹ️",
      iconBg: "bg-blue-100",
      confirmBtn:
        "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400",
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel?.();
      }}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <div className="p-6">
          <div
            className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center text-2xl mb-4 mx-auto`}
          >
            {styles.icon}
          </div>
          <h3
            id="confirm-dialog-title"
            className="text-lg font-semibold text-center mb-2 text-gray-800"
          >
            {title}
          </h3>
          <p
            id="confirm-dialog-message"
            className="text-sm text-gray-500 text-center leading-relaxed"
          >
            {message}
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 disabled:cursor-not-allowed transition ${styles.confirmBtn}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Deleting...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
