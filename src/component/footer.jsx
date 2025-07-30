import React from "react";
import { Link } from "react-router-dom"; // Import for routing
import Playstore from "../img/playstore.png";
import Appstore from "../img/appstore.png";

export default function Footer() {
  // Define nav links here
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Library", href: "/library" },
    { label: "About Us", href: "/about" },
    { label: "Subscription", href: "/subscription" },
  ];

  return (
    <footer className="bg-[#faf3ed] text-gray-800 font-body">
      {/* App Store Badges */}
      <div className="text-center py-8 border-b border-gray-200">
        <h2 className="text-2xl font-serifTitle mb-6">APPS ARE AVAILABLE ON</h2>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <a href="#" className="transform transition hover:scale-105">
            <img
              src={Playstore}
              alt="Get it on Google Play"
              className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
            />
          </a>
          <a href="#" className="transform transition hover:scale-105">
            <img
              src={Appstore}
              alt="Download on the App Store"
              className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
            />
          </a>
        </div>
      </div>

      {/* Footer Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 py-12">
        {/* About */}
        <div>
          <h3 className="font-serifTitle text-lg mb-4">Motor Vehicles Law</h3>
          <p className="text-sm leading-relaxed mb-4">
            The essential tool for legal professionals, researchers, and anyone navigating the Motor Vehicles Law of India. Stay updated. Stay empowered.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="font-serifTitle text-lg mb-4">Useful Links</h4>
          <ul className="space-y-2 text-sm">
            {navItems.map(({ label, href }) => (
              <li key={label}>
                <Link to={href} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-serifTitle text-lg mb-4">Subscribe to Newsletter</h4>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 px-4 py-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-700 px-4 py-2 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Contact & Copyright */}
      <div className="bg-[#f4ebe3] border-t border-gray-200 text-center text-sm text-gray-600 py-6 px-4 space-y-2">
        <p>
          📧{" "}
          <a
            href="mailto:motorvehicleslaw@gmail.com"
            className="hover:underline text-blue-600"
          >
            motorvehicleslaw@gmail.com
          </a>
        </p>
        <p>
          Powered by{" "}
          <a
            href="https://teqbae.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            Teqbae Innovations and Solutions India Pvt Ltd.
          </a>{" "}
          | © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
