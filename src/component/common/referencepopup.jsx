// ReferencePopup.js
import React from "react";

const ReferencePopup = ({ content, onClose }) => {
  if (!content) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md bg-white border border-blue-400 rounded-lg shadow-lg p-4"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-blue-700">{content.linkText}</h4>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-red-500 font-semibold"
        >
          ×
        </button>
      </div>
      <p className="italic text-gray-800">{content.body}</p>
    </div>
  );
};

export default ReferencePopup;
