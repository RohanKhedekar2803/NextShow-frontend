import React, { useRef } from 'react'; // Import useRef here
import Event from './Event';

const movies = [
  {
    event_id : 1,
    title: 'The Dark Knight',
    genre: 'Action',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
    cast: ['abc','abc','abc'],
    duration: "12.22.00.00.00.00000",
    Description : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus quam tenetur ipsam, dolorem provident, sit quisquam magni architecto aliquam iure aut animi eos praesentium incidunt sed eveniet harum sunt rerum fugiat illum accusamus omnis aspernatur officia totam! Incidunt ratione reprehenderit accusamus magni labore pariatur libero? Praesentium pariatur cum ad voluptatum!",
    releaseDate : "2012-11-11"
  },
  {
    title: 'The Pursuit of Happyness',
    genre: 'Drama',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'Inception',
    genre: 'Sci-Fi',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'The Godfather',
    genre: 'Crime',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'Shutter Island',
    genre: 'Thriller',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'Interstellar',
    genre: 'Sci-Fi',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'Parasite',
    genre: 'Thriller',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'Avengers: Endgame',
    genre: 'Action',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'The Dark Knight',
    genre: 'Action',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'The Pursuit of Happyness',
    genre: 'Drama',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'Inception',
    genre: 'Sci-Fi',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'The Godfather',
    genre: 'Crime',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'Shutter Island',
    genre: 'Thriller',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
    cast: 'abc'
  },
  {
    title: 'Interstellar',
    genre: 'Sci-Fi',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'Parasite',
    genre: 'Thriller',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  },
  {
    title: 'Avengers: Endgame',
    genre: 'Action',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
  }
];
export default function EventList({ genreType }) {
  const scrollContainer = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollContainer.current;
    if (direction === 'left') {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    } else if (direction === 'right') {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className='bg-gray-900'>
     <div className='text-yellow-50 font-extrabold text-3xl pt-4 pl-4'>Explore {genreType}</div>
      <div className="relative">
        {/* Scrollable container */}
        <div
          ref={scrollContainer}
          className="flex overflow-x-auto space-x-4 py-6 px-4 bg-gray-900 scrollbar-none"
        >
          {movies.map((movie, idx) => (
            <Event key={idx} event_id={movie.event_id} title={movie.title} genre={movie.genre} image={movie.image} cast={movie.cast} description={movie.Description} duration={movie.duration} releaseDate={movie.releaseDate}/>
          ))}
        </div>

        {/* Left Scroll Button - always visible */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg"
        >
          &lt;
        </button>

        {/* Right Scroll Button - always visible */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}