// src/pages/Library.jsx
import React from "react";

const books = [
  {
    title: "There's Something about Mira",
    image: "https://m.media-amazon.com/images/I/81l3rZK4lnL._SL1500_.jpg",
    author: "Manali Dey",
  },
  {
    title: "The Vibrant Years Novel",
    image: "https://m.media-amazon.com/images/I/815qLcSL9LL._SY425_.jpg",
    author: "Sonali Dev",
  },
  {
    title: "The Wedding Setup - A Short Story",
    image: "https://m.media-amazon.com/images/I/510fg-Akt4L._SY445_SX342_.jpg",
    author: "Sonali Dev",
  },
  {
    title: "The Emma Project Novel",
    image: "https://m.media-amazon.com/images/I/81HWutvBrdL._SL1500_.jpg",
    author: "Sonali Dev",
  },
    {
    title: "There's Something about Mira",
    image: "https://m.media-amazon.com/images/I/81l3rZK4lnL._SL1500_.jpg",
    author: "Manali Dey",
  },
  {
    title: "The Vibrant Years Novel",
    image: "https://m.media-amazon.com/images/I/815qLcSL9LL._SY425_.jpg",
    author: "Sonali Dev",
  },
  {
    title: "The Wedding Setup - A Short Story",
    image: "https://m.media-amazon.com/images/I/510fg-Akt4L._SY445_SX342_.jpg",
    author: "Sonali Dev",
  },
  {
    title: "The Emma Project Novel",
    image: "https://m.media-amazon.com/images/I/81HWutvBrdL._SL1500_.jpg",
    author: "Sonali Dev",
  },
];

export default function ProductList() {
  return (
    <section className="bg-white min-h-screen py-10 px-4 md:px-8 mt-10">
      <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">
        Explore Our Library
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition group"
          >
            {/* Image */}
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-56 object-cover"
            />

            {/* Info */}
            <div className="p-4 space-y-1">
              <h3 className="text-md font-semibold text-gray-900">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>

            {/* Hover Read Button */}
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <button className="bg-white hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded shadow ">
                Read
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
