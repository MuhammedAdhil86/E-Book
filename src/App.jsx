import React from "react";
import AppRouter from "./routes/router";
import { Toaster } from "react-hot-toast";
import ToastListener from "./component/ToastListener";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-center" reverseOrder={false} />
      <ToastListener />
    </>
  );
}

export default App;
