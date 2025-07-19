import React from "react";

import VersePart from "../component/verse-part";
import Alt_Navbar from "../component/alternative/alternative-nav";
import Footer from "../component/alternative/footer";

export default function ParentVerseIntro() {
  return (
   <>
   <div>
    <Alt_Navbar/>
    <VersePart/>
    <Footer/>
   </div>
   </>
  );
}
