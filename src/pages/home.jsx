import React from "react";
import Navbar from "../component/navbar/navbar";
import Quotepart from "../component/quote-of -the-day/quotepart";
import Footer from "../component/footer/footer";
import BooksSection from "../component/bookssection/bookssection";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <Quotepart />
      <BooksSection/>
      <Footer/>
    </div>
  );
};

export default Home;
