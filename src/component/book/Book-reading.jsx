import React, { useState } from "react";
import { FaChevronDown, FaChevronRight, FaChevronLeft } from "react-icons/fa";

const chapters = [
  {
    id: 1,
    title: "Discovering Your Ikigai",
    description: "The foundation of purpose",
    topics: [
      {
        id: 101,
        title: "What is Ikigai? ~ The Japanese Philosophy",
        content: "### Understanding Ikigai\n\nIkigai is a Japanese concept that means 'a reason for being'. It's what gets you up in the morning and gives you purpose. This philosophy combines what you love, what you're good at, what the world needs, and what you can be paid for."
      },
      {
        id: 102,
        title: "The Four Elements ~ Finding Your Balance",
        content: "### The Four Elements of Ikigai\n\n1. What you love (your passion)\n2. What you're good at (your vocation)\n3. What the world needs (your mission)\n4. What you can be paid for (your profession)\n\nFinding the intersection of these creates your Ikigai."
      },
      {
        id: 103,
        title: "Case Studies ~ Real-life Examples",
        content: "### Inspiring Ikigai Stories\n\nExplore how people from different walks of life have discovered their Ikigai. From artists to scientists, each story reveals how finding purpose leads to fulfillment."
      }
    ]
  },
  {
    id: 2,
    title: "The Longevity Factor",
    description: "Secrets from Okinawa",
    topics: [
      {
        id: 201,
        title: "Blue Zones ~ Lessons from Centenarians",
        content: "### Okinawa's Longevity Secrets\n\nThe Japanese island of Okinawa has one of the highest concentrations of centenarians in the world. Their secret? A strong sense of Ikigai that keeps them active and engaged well into old age."
      },
      {
        id: 202,
        title: "Diet & Lifestyle ~ The Okinawan Way",
        content: "### Nutritional Philosophy\n\nOkinawans practice 'Hara Hachi Bu' - eating until 80% full. Their diet is rich in vegetables, tofu, and fish, with minimal processed foods. Combined with their active lifestyle, this contributes to remarkable longevity."
      }
    ]
  },
  {
    id: 3,
    title: "Flow & Mindfulness",
    description: "Being present in your purpose",
    topics: [
      {
        id: 301,
        title: "The State of Flow ~ Losing Yourself",
        content: "### Achieving Flow State\n\nWhen you're completely immersed in an activity that aligns with your Ikigai, you enter a state of flow. Time seems to disappear, and you experience deep satisfaction from the activity itself."
      },
      {
        id: 302,
        title: "Daily Rituals ~ Building Consistency",
        content: "### The Power of Routine\n\nJapanese centenarians maintain daily rituals that support their Ikigai. Whether it's gardening, calligraphy, or community activities, these consistent practices reinforce their sense of purpose."
      }
    ]
  },
  {
    id: 4,
    title: "Applying Ikigai",
    description: "Practical implementation",
    topics: [
      {
        id: 401,
        title: "Career Choices ~ Aligning Work with Purpose",
        content: "### Finding Meaningful Work\n\nYour career should ideally sit at the intersection of your Ikigai. This chapter explores how to evaluate job opportunities based on how well they align with your deeper purpose."
      },
      {
        id: 402,
        title: "Relationships ~ Shared Purpose",
        content: "### Ikigai in Relationships\n\nWhen individuals or groups share similar Ikigai, relationships become more meaningful. This section examines how purpose strengthens connections with others."
      },
      {
        id: 403,
        title: "Retirement ~ A New Beginning",
        content: "### Reinventing Purpose\n\nRetirement doesn't mean the end of Ikigai. Many find this stage offers new opportunities to explore passions and contribute in different ways."
      }
    ]
  },
  {
    id: 5,
    title: "Overcoming Challenges",
    description: "Staying true to your purpose",
    topics: [
      {
        id: 501,
        title: "Burnout ~ When Purpose Fades",
        content: "### Recognizing Burnout\n\nEven with strong Ikigai, people can experience burnout. This chapter discusses warning signs and strategies to reconnect with your core purpose during difficult times."
      },
      {
        id: 502,
        title: "Adapting ~ Ikigai Through Life Changes",
        content: "### Evolving With Your Purpose\n\nYour Ikigai isn't static - it evolves as you grow. Learn how to adapt your sense of purpose through major life transitions while staying true to your core values."
      }
    ]
  }
];

export default function BookReading() {
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleChapter = (id) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  const flatTopics = chapters.flatMap((ch) => ch.topics);
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopic?.id);
  const prevTopic = flatTopics[selectedIndex - 1];
  const nextTopic = flatTopics[selectedIndex + 1];

  const filteredSuggestions = searchTerm
    ? flatTopics.filter((topic) =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white mt-10">
      {/* Sidebar */}
      <aside className="md:w-1/3 lg:w-1/4 bg-white shadow-md px-4 py-6 overflow-y-auto relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-sm font-bold text-black">
            Ikigai - The Japanese Secret to a Long and Happy Life
          </h1>
          <button className="text-gray-500 text-sm" title="Fullscreen">
            ⛶
          </button>
        </div>

        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search topics"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            className="w-full px-4 py-2 rounded-full border text-sm focus:outline-none focus:ring"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border shadow-lg max-h-60 overflow-y-auto z-10">
              {filteredSuggestions.map((topic) => (
                <li
                  key={topic.id}
                  onClick={() => handleTopicClick(topic)}
                  className="px-4 py-2 text-sm hover:bg-yellow-100 cursor-pointer"
                >
                  {topic.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ul className="space-y-2 text-sm">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex justify-between items-center px-2 py-2 font-semibold text-left border-b text-black"
              >
                <span>
                  {chapter.title} ~ {chapter.description}
                </span>
                <span>
                  {expandedChapter === chapter.id ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
              </button>
              {expandedChapter === chapter.id && (
                <ul className="pl-4 py-2 space-y-1">
                  {chapter.topics.map((topic) => (
                    <li key={topic.id}>
                      <button
                        onClick={() => handleTopicClick(topic)}
                        className={`block w-full text-left px-3 py-2 rounded ${
                          selectedTopic?.id === topic.id
                            ? "bg-yellow-400 text-black"
                            : "hover:bg-yellow-100"
                        }`}
                      >
                        {topic.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Reader Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto relative">
        {selectedTopic ? (
          <div className="space-y-4">
            {/* Navigation Arrows */}
            <div className="flex space-x-2 mb-5">
              <button
                className="p-2 rounded disabled:opacity-50"
                onClick={() => handleTopicClick(prevTopic)}
                disabled={!prevTopic}
              >
                <FaChevronLeft />
              </button>
              <button
                className="p-2 rounded disabled:opacity-50"
                onClick={() => handleTopicClick(nextTopic)}
                disabled={!nextTopic}
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Book Header */}
            <div className="text-center bg-yellow-300 p-4 rounded mb-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Ikigai - The Japanese Secret to a Long and Happy Life
              </h1>
              <h2 className="text-md font-semibold text-yellow-800 mb-4">
                {selectedTopic.title}
              </h2>
            </div>

            {/* Topic Content */}
            <div className="bg-white p-6 rounded shadow">
              {selectedTopic.content.split("\n\n").map((para, index) => (
                <p
                  key={index}
                  className={`mb-4 ${
                    index === 0 ? "text-lg font-semibold" : "text-gray-800"
                  }`}
                >
                  {para.replace("### ", "")}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <img
              src="https://5.imimg.com/data5/SELLER/Default/2021/8/LW/QJ/WS/135742206/ikagai-png-500x500.png"
              alt="Ikigai Book Cover"
              className="max-h-[500px] object-contain animate-spin-slow"
            />
          </div>
        )}
      </main>
    </div>
  );
}