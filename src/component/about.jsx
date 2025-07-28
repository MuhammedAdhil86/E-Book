// src/components/AboutSection.jsx
import React from "react";
import Traffic from '../img/Traffic.jpg'
export default function AboutSection() {
  return (
    <section className="flex flex-col md:flex-row font-serif items-stretch lg:mt-0 mt-7 ">
      
      {/* Left Content - 60% width */}
      <div className="md:w-[70%] px-6 lg:px-24 py-12 flex flex-col justify-center bg-[#fdf6f1] h-[420px] lg:mt-10 ">
        <p className="italic text-sm text-gray-600 mb-2">About Us</p>

        <h2 className="text-2xl md:text-4xl font-serifTitle text-black leading-snug mb-4">
          
          MOTOR VEHICLES LAW: YOUR CENTRAL SOURCE FOR REAL-TIME LEGAL UPDATES

        </h2>

        <p className="text-sm text-gray-700 leading-relaxed mb-4 max-w-xl">

We aim to simplify your legal journey through India’s complex motor vehicle laws. Whether you’re preparing for a case, tracking policy changes, or researching rules for compliance, our platform provides a user-friendly experience built on accuracy and speed.

        </p>

        <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium px-5 py-2 w-fit transition">
          Learn More
        </button>
      </div>

      {/* Right Image - 40% width */}
      <div className="md:w-[40%] h-[500px] ">
        <img
          src={Traffic}
          alt="Author"
          className="w-full h-full "
        />
      </div>
    </section>
  );
}
