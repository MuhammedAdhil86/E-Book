import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './sidebar';
import Toolbar from './toolbar';
import TopicContent from './topiccontent';
import PopupModal from './popupmodal';
import { useFetchBook } from '../hooks/usefetchbook';
import { useBookStore } from '../store/useBookStore';

export default function BookReader() {
  const { id } = useParams();
  const loading = useFetchBook(id);
  const { selectedTopic } = useBookStore();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen mt-16 bg-white">
      <Sidebar />
      <main className="flex-1 p-4 overflow-y-auto">
        <Toolbar />
        {selectedTopic ? <TopicContent /> : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2>Select a topic to begin reading.</h2>
          </div>
        )}
      </main>
      <PopupModal />
    </div>
  );
}
