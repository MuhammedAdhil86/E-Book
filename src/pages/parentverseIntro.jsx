import React from "react";

import VersePart from "../component/verse-part";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

export default function ParentVerseIntro() {
  return (
   <>
   <div>
    <Navbar/>
    <VersePart/>
    <Footer/>
   </div>
   </>
  );
}
