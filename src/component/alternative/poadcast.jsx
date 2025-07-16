// src/components/PodcastSection.jsx
import React from "react";

const podcasts = [
  {
    id: 1,
    embedSrc: "https://www.youtube.com/embed/tO-mYqy_Fo0?si=3PFYs7Fe4PRxp0Dv",
    title: "TRACY BROGAN ON LIT WITH LOVE",
  },
  {
    id: 2,
    thumbnail: "https://img.youtube.com/vi/Kd5a2E5W2yM/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Kd5a2E5W2yM",
    title: "SALLY KILPATRICK ON LIT WITH LOVE",
  },
  {
    id: 3,
    thumbnail: "https://img.youtube.com/vi/vj3fZuz5AoM/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=vj3fZuz5AoM",
    title: "BRENDA NOVAK ON LIT WITH LOVE!",
  },
];

export default function PodcastSection() {
  return (
    <section className="bg-white px-6 lg:px-20 font-serif py-12">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="italic text-sm text-gray-600 mb-1">Podcasts</p>
        <h2 className="text-3xl md:text-4xl font-serifTitle">LIT WITH LOVE</h2>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-6">
        {/* Left Card: fixed height 600px at md+ */}
        <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden shadow-lg h-[330px]">
          <iframe
            src={podcasts[0].embedSrc}
            title={podcasts[0].title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-xl"
          />
          <p className="absolute bottom-3 left-4 right-4 text-white font-medium text-sm md:text-lg z-10 bg-black/40 p-2 rounded">
            {podcasts[0].title}
          </p>
        </div>

        {/* Right Side: unchanged */}
        <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {podcasts.slice(1).map((pod) => (
            <div key={pod.id} className="text-center">
              <div className="relative rounded-xl overflow-hidden shadow-md">
                <img
                  src={pod.thumbnail}
                  alt={pod.title}
                  className="w-full h-40 object-cover"
                />
                <a
                  href={pod.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40"
                >
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 84 84"
                  >
                    <circle cx="42" cy="42" r="42" />
                    <polygon points="33,27 57,42 33,57" fill="#000" opacity="0.8" />
                  </svg>
                </a>
              </div>
              <p className="text-lg font-medium bg-[#fbf5f1] rounded p-3">
                {pod.title}
              </p>
            </div>
          ))}

          {/* Description + Button */}
          <div className="sm:col-span-2 flex justify-between items-start mt-2 gap-4">
            <p className="text-xs text-gray-700 max-w-md font-body">
              Lorem ipsum ua ohan aouhaoba oaij uh ja aja jna aijn aojn
              uaiohaj uahio aoi iuhauaubsui...
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-medium p-2 transition rounded">
              View All Podcasts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
