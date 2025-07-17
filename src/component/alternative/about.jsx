// src/components/AboutSection.jsx
import React from "react";

export default function AboutSection() {
  return (
    <section className="flex flex-col md:flex-row font-serif items-stretch ">
      
      {/* Left Content - 60% width */}
      <div className="md:w-[60%] px-6 lg:px-24 py-12 flex flex-col justify-center bg-[#fdf6f1] h-[420px] lg:mt-0 mt-7">
        <p className="italic text-sm text-gray-600 mb-2">About Me</p>

        <h2 className="text-2xl md:text-4xl font-serifTitle text-black leading-snug mb-4">
          SONALI DEV: STORIES OF <br />
          LOVE, LAUGHTER, AND LEGACY
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed mb-4 max-w-xl">
          USA Today bestselling author Sonali Dev writes hilarious & heartwarming stories
          about families without boundaries. Her novels have been named Best Books of the
          Year by Library Journal, NPR, the Washington Post, and Kirkus. She has won the
          American Library Association’s award for best in genre, the RT Reviewer Choice
          Award, multiple RT Seals of Excellence, has been a RITA® finalist, and has been
          listed for the Dublin Literary Award. Shelf Awareness calls her “Not only one of
          the best but one of the bravest romance novelists working today.”
        </p>

        <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium px-5 py-2 w-fit transition">
          About Me
        </button>
      </div>

      {/* Right Image - 40% width */}
      <div className="md:w-[40%] h-[500px]">
        <img
          src="https://sonalidev.com/wp-content/uploads/2024/12/Sonali-Dev-e1733491614810-808x1024.jpg"
          alt="Author"
          className="w-full h-full "
        />
      </div>
    </section>
  );
}
