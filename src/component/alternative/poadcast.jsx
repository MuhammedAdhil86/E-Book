// src/components/PodcastSection.jsx
import React from "react";
import play from '../../img/play.png';

const podcasts = [
{
  id: 1,
  thumbnail: "https://img.youtube.com/vi/tO-mYqy_Fo0/maxresdefault.jpg",
  videoUrl: "https://www.youtube.com/watch?v=tO-mYqy_Fo0",
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
        {/* Left Card (now uses thumbnail + play) */}
        <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden shadow-lg h-[330px]">
          <img
            src={podcasts[0].thumbnail}
            alt={podcasts[0].title}
            className="w-full h-full object-cover"
          />
          <a
            href={podcasts[0].videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
          >
            <img
              src={play}
              alt="Play"
              className="w-14 h-14 object-contain"
            />
          </a>
          <p className="absolute bottom-3 left-4 right-4 text-white font-medium text-sm md:text-lg z-10 bg-black/40 p-2 rounded">
            {podcasts[0].title}
          </p>
        </div>

        {/* Right Side */}
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
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
                >
                  <img
                    src={play}
                    alt="Play"
                    className="w-10 h-10 object-contain"
                  />
                </a>
              </div>
              <p className="text-lg font-medium bg-[#fbf5f1] rounded p-3">
                {pod.title}
              </p>
            </div>
          ))}

          {/* Description + Button */}
          <div className="sm:col-span-2 flex justify-between items-start mt-2 gap-4">
            <p className="text-sm text-gray-700 max-w-md font-body">
When her ex releases a sex tape, Delaney–the youngest daughter of an '80s pop star–flees the spotlight and heads to snowy Bell Harbor.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-medium p-2 rounded transition">
              View All Podcasts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
