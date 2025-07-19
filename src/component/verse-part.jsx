import React from 'react'
import { Link } from "react-router-dom"; 
export default function VersePart() {
  return (
    <section className="bg-[#fcf6f1] min-h-screen flex items-center justify-center px-4">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-10 py-12">

        {/* Text & Buttons */}
        <div className="flex-1 text-center md:text-left space-y-6">
          {/* Logo and Title */}
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-bold text-[#2b7a5c]">Motor Vehicle Law</h1>
          </div>

          <p className="text-gray-700 text-base md:text-lg">
            Explore our curated collection of digital books <br className="block md:hidden" />
            on Indian Motor Vehicle Laws and Regulations.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Buy, Download & Learn <br className="block md:hidden" />
            from the trusted legal resource.
          </h2>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Link to="/signup">
              <button className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-lg transition">
                Create Account
              </button>
            </Link>

            <div>
              <Link to="/login" className="text-sm text-gray-800 underline hover:text-black transition">
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
