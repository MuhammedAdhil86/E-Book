import React from "react";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaCompress,
  FaFilePdf,
} from "react-icons/fa";

const dummyTitles = [
  { id: 1, title: "Introduction" },
  { id: 2, title: "Chapter 1: Getting Started" },
  { id: 3, title: "Chapter 2: Deep Dive" },
];

const dummyContent = `
  <h2 class="text-xl font-semibold mb-2">Chapter Title</h2>
  <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt, nisl eget.</p>
  <h3 class="text-lg font-medium mb-1">Subheading</h3>
  <p class="mb-4">Mauris dignissim, metus in luctus fermentum, magna sem tincidunt nisi, nec porttitor arcu urna non ipsum.</p>
`;

export default function BookReader() {
  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r overflow-y-auto">
        <div className="p-4 font-bold text-lg">Titles</div>
        <ul className="space-y-2 px-4">
          {dummyTitles.map((item) => (
            <li
              key={item.id}
              className="p-2 rounded hover:bg-blue-100 cursor-pointer"
            >
              {item.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <div className="font-semibold">Book Title</div>
          <div className="flex gap-4 text-gray-600">
            <FaSearchMinus className="cursor-pointer hover:text-blue-500" />
            <FaSearchPlus className="cursor-pointer hover:text-blue-500" />
            <FaFilePdf className="cursor-pointer hover:text-blue-500" />
            <FaExpand className="cursor-pointer hover:text-blue-500" />
          </div>
        </div>

        {/* Reader content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="prose max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: dummyContent }}
          />
        </div>
      </div>
    </div>
  );
}
