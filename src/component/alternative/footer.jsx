import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#faf3ed] text-gray-800 font-body">
      {/* Bookstore Logos */}
      <div className="text-center py-8 border-b border-gray-200">
        <h2 className="text-2xl font-serifTitle mb-6">BOOKS ARE AVAILABLE ON</h2>
        <div className="flex justify-center gap-8 flex-wrap items-center">
          <img src="/logos/amazon.png" alt="Amazon" className="h-6 object-contain" />
          <img src="/logos/apple-books.png" alt="Apple Books" className="h-6 object-contain" />
          <img src="/logos/barnes-noble.png" alt="Barnes & Noble" className="h-6 object-contain" />
          <img src="/logos/bookshop.png" alt="Bookshop.org" className="h-6 object-contain" />
          <img src="/logos/kobo.png" alt="Kobo" className="h-6 object-contain" />
          <img src="/logos/andersons.png" alt="Anderson's Bookshop" className="h-6 object-contain" />
        </div>
      </div>

      {/* Footer Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12">
        {/* Column 1 - About */}
        <div>
          <h3 className="font-serifTitle text-lg mb-4">Sonali Dev</h3>
          <p className="text-sm leading-relaxed mb-4">
            I writes hilarious & heartwarming stories about families without boundaries. Her novels have been named Best Books of the Year by Library Journal.
          </p>
          <div className="flex gap-4 text-gray-600">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-x-twitter"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        {/* Column 2 - Links */}
        <div>
          <h4 className="font-serifTitle text-lg mb-4">Useful Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About Me</a></li>
            <li><a href="#" className="hover:underline">Books</a></li>
            <li><a href="#" className="hover:underline">Podcast</a></li>
            <li><a href="#" className="hover:underline">Contact Me</a></li>
          </ul>
        </div>

        {/* Column 3 - Newsletter */}
        <div>
          <h4 className="font-serifTitle text-lg mb-4">Subscribe to Newsletter</h4>
          <form className="flex flex-col space-y-2 ">
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 px-4 py-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-grey-700 px-4 py-2 "
            >
              Subscribe
            </button>``
          </form>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-200">
        © 2024 Sonali Dev – All Rights Reserved
      </div>
    </footer>
  );
}
