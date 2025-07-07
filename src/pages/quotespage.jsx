// File: src/pages/QuotesPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useQuoteStore from '../store/useQuoteStore';

export default function QuotesPage() {
  const { selectedQuote } = useQuoteStore();
  const navigate = useNavigate();

  if (!selectedQuote) {
    return (
      <div className="p-6 text-center">
        No quote selected. Go back and try again.
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/')}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Back to Home
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">{selectedQuote.EbookContent?.title}</h2>
      <div
        className="prose max-w-none border p-4 rounded bg-white shadow"
        dangerouslySetInnerHTML={{
          __html:
            selectedQuote.EbookContent?.verified_content ||
            "<p>No verified content available.</p>",
        }}
      />
    </div>
  );
}
