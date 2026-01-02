// GenreButtonList.js
import React, { useState } from 'react';
import EventList from './EventList';

// Replace the movie data with the correct event data.
const eventsData = [
  {
    title: 'The Dark Knight',
    genre: 'Action',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
    cast: ['abc','abc','abc']
  },
  {
    title: 'The Pursuit of Happyness',
    genre: 'Drama',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  // Add more event data here
];

const genres = ['All', 'Movies', 'Sports', 'Comic Shows', 'Drama', "Event"]; // Include 'All' genre

const GenreButtonList = () => {
  const [selectedGenre, setSelectedGenre] = useState('All'); // Default genre is 'All'

  // Filter events based on the selected genre
  const filteredEvents = selectedGenre === 'All'
    ? eventsData
    : eventsData.filter(event => event.genre === selectedGenre);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Genre Buttons Section */}
      <div className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 mb-2">
            Select Event You are Interested In
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-yellow-400 rounded-full mb-6"></div>
          
          <div className="flex flex-wrap justify-start gap-3 sm:gap-4">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/50'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:border-white/40'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conditional rendering for 'All' genre or specific genres */}
      <div className="space-y-8 sm:space-y-12">
        {selectedGenre === 'All' ? (
          <>
            <EventList genreType="Movies" />
            <EventList genreType="Sports" />
            <EventList genreType="Drama" />
            <EventList genreType="Comic Shows" />
          </>
        ) : (
          <EventList genreType={selectedGenre} />
        )}
      </div>
    </div>
  );
};

export default GenreButtonList;
