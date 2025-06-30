import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/home';
import ParentVerseIntro from '../pages/parentverseIntro';
import Signup from '../pages/signup';
import Login from '../pages/login'
import Library from '../pages/library';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/verse" element={<ParentVerseIntro />} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
       <Route path='/library' element={<Library/>}/>
    </Routes>
  );
}
