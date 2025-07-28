import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import api from "../api/Instance";
import "@fontsource/pt-serif/400-italic.css";

Modal.setAppElement("#root");

export default function TestimonialCarousel() {
  const [testimonial, setTestimonial] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/quotes/getall")
      .then(resp => {
        const q = resp.data.responsedata?.[0];
        if (q) {
          setTestimonial({
            quote: q.quote,
            title: q.EbookContent?.title || "",
            author: q.author || "",
            verified: q.EbookContent?.verified_content || ""
          });
        }
      })
      .catch(console.error);
  }, []);

  if (!testimonial) return null;

  const { quote, title, author, verified } = testimonial;
  const hasVerified = Boolean(verified?.trim());

  return (
    <section className="bg-[#fbf5f1] px-4 font-serif text-center py-8">
      <div className="max-w-3xl mx-auto text-left">
        {/* 🔹 Styled Quote Paragraph */}
        <p className="text-lg sm:text-xl md:text-2xl italic text-gray-800 leading-relaxed max-w-3xl mx-auto mb-2">
          {quote}
        </p>

        {title && <p className="text-lg font-medium mb-1">{title}</p>}
        {author && <p className="text-base mb-4">— {author}</p>}

        {hasVerified && (
          <div className="mb-4">
            <div
              className="text-gray-700 line-clamp-3 mb-2"
              style={{
                fontFamily: "'PT Serif', serif",
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{ __html: verified }}
            />
            <button
              className="text-blue-600 underline"
              onClick={() => setShowModal(true)}
            >
              See more
            </button>
          </div>
        )}

        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.5)",
              overflowY: "auto"
            },
            content: {
              maxWidth: "600px",
              maxHeight: "80vh",
              margin: "auto",
              overflowY: "auto",
              fontFamily: "'PT Serif', serif",
              fontStyle: "italic",
              lineHeight: 1.6,
            }
          }}
        >
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-xl"
          >✕</button>
          <h3 className="text-xl font-bold mb-4">Content</h3>
          <div
            className="prose text-gray-800"
            dangerouslySetInnerHTML={{ __html: verified }}
          />
        </Modal>
      </div>
    </section>
  );
}
