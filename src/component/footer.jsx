import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        {/* Left: Logo or Brand */}
        <div className="text-lg font-semibold">
          © 2025 MyCompany. All rights reserved.
        </div>

        {/* Right: Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
          <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
