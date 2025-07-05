import React from "react";
import Navbar from "../component/navbar";
import Quotepart from "../component/quotepart";
import Footer from "../component/footer";
import BooksSection from "../component/bookssection";

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
