import React from "react";

const features = [
  {
    title: "Live Updates",
    description:
      "Stay ahead with real-time updates on Motor Vehicle Laws, including Central and State amendments.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRLo9GkxMLXxlK_4s5vRuMD8lgvGp9PMZ9pg&s",
  },
  {
    title: "Comprehensive Act and Rules",
    description:
      "Access complete Motor Vehicles Law and Rules with a clean interface for easy browsing.",
    image:
      "https://www.shutterstock.com/image-vector/legal-document-attorney-court-professional-600nw-2027990525.jpg",
  },
  {
    title: "Searchable Database",
    description:
      "Quickly search through sections, rules, and amendments using our powerful filter tools.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Notifications",
    description:
      "All amendments include original downloadable government notifications for easy reference.",
    image:
      "https://www.jyotijudiciary.com/wp-content/uploads/2024/04/Jyoti-Judiciary-11.jpg",
  },
  {
    title: "Case Laws",
    description:
      "Each section links to Supreme Court and High Court decisions for real-world context.",
    image:
      "https://www.thelextimes.com/storage/2024/01/case-law.jpg",
  },
];

export default function InfoPart() {
  return (
    <section className="bg-[#fcf6f1] py-20 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serifTitle font-bold text-gray-900 mb-4">
            Motor Vehicles Law
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto italic">
            Your real-time, searchable guide to evolving vehicle regulations.
          </p>
          <div className="mt-4 w-20 h-1 bg-yellow-500 mx-auto rounded-full" />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-60 object-cover transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 transition duration-300" />
              <div className="absolute bottom-0 p-6 text-white z-10">
                <h4 className="text-xl md:text-2xl font-semibold mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm md:text-base text-slate-200">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
