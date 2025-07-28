// src/components/PodcastSection.jsx
import React from "react";
import play from '../img/play.png';

const podcasts = [
  {
    id: 1,
    thumbnail: "https://media.istockphoto.com/id/1045979216/photo/cars-moving-on-the-road-in-city-in-late-evening.jpg?s=612x612&w=0&k=20&c=hFfW7WzeeR3X7FTmwkZ0u4_bBzRK1iJcZwisOgdJB3M=",
    title: "SECTION 129: WEARING OF HELMETS MANDATORY",
  },
  {
    id: 2,
    thumbnail: "https://renewbuy-cms.s3.ap-south-1.amazonaws.com/Traffic_Rules_and_Regulations_in_India_03_41e7023c3a.jpg",
    title: "SECTION 184: DANGEROUS DRIVING & PENALTIES",
  },
  {
    id: 3,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgX42SJi5hvMV5WHOr7QC3Qt1W8xfBVbYGpg&s",
    title: "SECTION 177: GENERAL PROVISION",
  },
];

export default function PodcastSection() {
  return (
    <section className="bg-white px-6 lg:px-20 font-serif py-12">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="italic text-sm text-gray-600 mb-1">Highlights</p>
        <h2 className="text-3xl md:text-4xl font-serifTitle">MOTOR VEHICLE ACT</h2>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-6">
        {/* Left Card (static image only) */}
        <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden shadow-lg h-[330px]">
          <img
            src={podcasts[0].thumbnail}
            alt={podcasts[0].title}
            className="w-full h-full object-cover"
          />
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
              </div>
              <p className="text-lg font-medium bg-[#fbf5f1] rounded p-3">
                {pod.title}
              </p>
            </div>
          ))}

          {/* Description + Button */}
          <div className="sm:col-span-2 flex justify-between items-start mt-2 gap-4">
            <p className="text-sm text-gray-700 max-w-md font-body">
              Stay informed about India's Motor Vehicle Act, covering safety regulations, penalties, and legal responsibilities for all road users.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-medium p-2 rounded transition">
              View Books
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
