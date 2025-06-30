import React from 'react';
import AppRouter from './routes/router';
import { Toaster } from 'react-hot-toast'; // ✅ Import toast provider

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
