import React from 'react';
import { useBookStore } from '../../store/useBookStore';

export default function PopupModal() {
  const { popupData, setPopupData } = useBookStore();
  if (!popupData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full">
        <h3 className="font-semibold mb-4">{popupData.header}</h3>
        <p className="whitespace-pre-line">{popupData.body}</p>
        <button onClick={() => setPopupData(null)} className="absolute right-4 top-4 text-gray-500">&times;</button>
      </div>
    </div>
  );
}
