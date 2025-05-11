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
    <div className="bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
      {/* Genre Buttons */}
      <div className="text-yellow-50 font-extrabold text-3xl pt-4 pb-4">Select Event You are Interested In</div>
      <div className="flex flex-wrap justify-start gap-4 pb-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreChange(genre)}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${selectedGenre === genre ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Conditional rendering for 'All' genre or specific genres */}
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
  );
};

export default GenreButtonList;
