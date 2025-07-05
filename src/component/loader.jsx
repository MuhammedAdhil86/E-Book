// components/Loader.jsx
import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white z-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid" />
    </div>
  );
}
