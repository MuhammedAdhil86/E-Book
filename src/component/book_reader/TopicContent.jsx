import React, { useEffect } from "react";

export default function ContentArea({
  loading,
  selectedTopic,
  bookInfo,
  getImageUrl,
  zoom,
  contentRefs,
  contentContainerRef,
}) {
  useEffect(() => {
    if (selectedTopic && contentRefs.current[selectedTopic.id]) {
      contentRefs.current[selectedTopic.id].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTopic, contentRefs]);

  return (
    <div
      ref={contentContainerRef}
      className="overflow-y-auto p-4 flex-grow rounded-b-2xl bg-white"
      style={{ fontSize: `${zoom}%` }}
    >
      {loading && <p>Loading content...</p>}

      {!loading && selectedTopic && (
        <div ref={(el) => (contentRefs.current[selectedTopic.id] = el)}>
          <h1 className="text-2xl font-bold mb-2">{selectedTopic.header}</h1>
          {selectedTopic.title && <h2 className="text-xl italic text-gray-600 mb-4">{selectedTopic.title}</h2>}

          {selectedTopic.image_url && (
            <img
              src={getImageUrl(selectedTopic.image_url)}
              alt="Topic Illustration"
              className="mb-4 max-w-full rounded"
            />
          )}

          <div dangerouslySetInnerHTML={{ __html: selectedTopic.content || "<p>No content available.</p>" }} />
        </div>
      )}

      {!loading && !selectedTopic && (
        <div>
          <h1 className="text-xl font-bold">Welcome to {bookInfo?.title || "this book"}</h1>
          <p>Select a topic from the sidebar to start reading.</p>
        </div>
      )}
    </div>
  );
}
