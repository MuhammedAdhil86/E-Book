import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import api from "../../api/Instance"; // Adjust if needed

export default function BooksSection() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/ebook/covers");
        setBooks(response.data?.responsedata || []);
      } catch (error) {
        console.error("Error fetching book covers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <section className="bg-white lg:min-h-screen px-6 lg:px-24 font-serif flex flex-col justify-center lg:mt-4 mt-7">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div className="mb-2 lg:mb-0">
          <p className="text-sm italic text-gray-700 mb-1">Books</p>
          <h2 className="text-[20px] text-4xl font-serifTitle max-w-2xl leading-snug text-black">
            DISCOVER ALL MY BOOKS YOU WERE LOOKING FOR
          </h2>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-sm text-gray-700 max-w-sm mb-4">
            I write hilarious & heartwarming stories about families without boundaries.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium px-5 py-2 transition duration-300 shadow-sm">
            View All Books
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500 mt-8">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No books found.</p>
      ) : (
        <>
          {/* Updated Carousel for small/medium screens */}
          <div className="lg:hidden mt-5">
            <Swiper
              slidesPerView={3}
              spaceBetween={10}
              centeredSlides={false}
              loop={false}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                // Force recalculation to ensure correct layout on load
                setTimeout(() => swiper.update(), 0);
              }}
            >
              {books.map((book, idx) => (
                <SwiperSlide key={idx}>
                  <div className="flex flex-col items-center text-center">
                    <div className="p-1 bg-[#faf3ed] rounded">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-[120px] h-[180px] object-cover rounded shadow-md"
                      />
                    </div>
                    <p className="mt-2 text-xs text-black font-medium leading-tight">
                      {book.title}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop carousel with top-right arrows */}
          <div className="hidden lg:block mt-1">
            <div className="flex justify-end mb-4 gap-3 pr-4">
              <button
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={4}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              navigation={false}
            >
              {books.map((book, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-col items-center text-center">
                    <div className="p-8 bg-[#faf3ed] rounded">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-[180px] h-[260px] object-cover rounded shadow-md"
                      />
                    </div>
                    <p className="mt-3 text-sm text-black font-medium leading-tight max-w-[200px]">
                      {book.title}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}
    </section>
  );
}
