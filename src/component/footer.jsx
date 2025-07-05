import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 ">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left: Logo or Brand */}
        <div className="text-lg font-semibold mb-4 md:mb-0">
          © 2025 MyCompany. All rights reserved.
        </div>

        {/* Right: Navigation Links */}
        <div className="flex space-x-4 text-sm">
          <a href="#" className="hover:text-blue-400">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400">Terms of Service</a>
          <a href="#" className="hover:text-blue-400">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
