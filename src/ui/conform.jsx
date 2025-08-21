// components/Confirm.jsx
import React from "react";

export default function Confirm({ open, onClose, onConfirm, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-80 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}
