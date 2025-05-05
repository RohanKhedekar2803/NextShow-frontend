
import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';



const TheatersPage = () => {
  const { filtertitle } = useParams();
  const navigate = useNavigate();
  const [theaters, setTheaters] = useState([
    {
      id: 1,
      name: 'CineMax Ground Theater',
      city: 'Mumbai',
      location: 'Andheri West',
      type: 'Ground',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[10, 10, 10], [10, 10, 10]],
      movies: [
        {
          event_id: 1,
          title: 'The Dark Knight',
          genre: 'Action',
          image: 'https://tse1.mm.bing.net/th?id=OIP.Ohz2NL7XXvY8oWKp3XWMMAHaJ4&pid=Api&P=0&h=180',
          cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
          duration: "02:32:00",
          description: "A gripping tale of chaos and justice as Batman faces off against the Joker in Gotham City.",
          releaseDate: "2008-07-18"
        }
      ]
    },
    {
      id: 2,
      name: 'INOX Ground Theater',
      city: 'Delhi',
      location: 'Connaught Place',
      type: 'Ground',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[12, 12, 12], [12, 12, 12]],
      movies: [
        {
          event_id: 2,
          title: 'Inception',
          genre: 'Sci-Fi',
          image: 'https://tse1.mm.bing.net/th?id=OIP.VOqO_5QKnBPu9wCPOlsNKwHaEK&pid=Api&P=0&h=180',
          cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
          duration: "02:28:00",
          description: "A mind-bending journey through the dream world with a team of extractors.",
          releaseDate: "2010-07-16"
        }
      ]
    },
    {
      id: 3,
      name: 'PVR Ground Theater',
      city: 'Bangalore',
      location: 'MG Road',
      type: 'Ground',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[10, 10, 10], [10, 10, 10]],
      movies: [
        {
          event_id: 3,
          title: 'Interstellar',
          genre: 'Adventure',
          image: 'https://tse1.mm.bing.net/th?id=OIP.nxl_mIkym2E9cwTde1p6hQHaEK&pid=Api&P=0&h=180',
          cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
          duration: "02:49:00",
          description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.",
          releaseDate: "2014-11-07"
        }
      ]
    },
    {
      id: 4,
      name: 'Big Cinemas Ground Theater',
      city: 'Chennai',
      location: 'Mount Road',
      type: 'Ground',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[8, 8, 8], [8, 8, 8]],
    },
    {
      id: 5,
      name: 'Cinepolis Ground Theater',
      city: 'Hyderabad',
      location: 'Banjara Hills',
      type: 'Ground',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[15, 15, 15], [15, 15, 15]],
    },
    {
      id: 6,
      name: 'Sree Kumaran Ground Theater',
      city: 'Coimbatore',
      location: 'Tidel Park',
      type: 'Ground',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[14, 14, 14], [14, 14, 14]],
    },

    // Theater
    {
      id: 7,
      name: 'PVR Theater',
      city: 'Delhi',
      location: 'Connaught Place',
      type: 'Theater',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[20, 20, 20], [20, 20, 20]],
    },
    {
      id: 8,
      name: 'INOX Theater',
      city: 'Mumbai',
      location: 'Andheri West',
      type: 'Theater',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[18, 18, 18], [18, 18, 18]],
    },
    {
      id: 9,
      name: 'CineMax Theater',
      city: 'Bangalore',
      location: 'Koramangala',
      type: 'Theater',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[22, 22, 22], [22, 22, 22]],
    },
    {
      id: 10,
      name: 'Satyam Theater',
      city: 'Chennai',
      location: 'T Nagar',
      type: 'Theater',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[16, 16, 16], [16, 16, 16]],
    },
    {
      id: 11,
      name: 'Mayajaal Theater',
      city: 'Chennai',
      location: 'ECR',
      type: 'Theater',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[30, 30, 30], [30, 30, 30]],
    },
    {
      id: 12,
      name: 'Escape Theater',
      city: 'Mumbai',
      location: 'Lower Parel',
      type: 'Theater',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[10, 10, 10], [10, 10, 10]],
    },

    // Auditorium
    {
      id: 13,
      name: 'Shankar Auditorium',
      city: 'Delhi',
      location: 'Rohini',
      type: 'Auditorium',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[50, 50, 50], [50, 50, 50]],
    },
    {
      id: 14,
      name: 'Kamani Auditorium',
      city: 'Delhi',
      location: 'Connaught Place',
      type: 'Auditorium',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[60, 60, 60], [60, 60, 60]],
    },
    {
      id: 15,
      name: 'LTG Auditorium',
      city: 'Mumbai',
      location: 'Andheri',
      type: 'Auditorium',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[100, 100, 100], [100, 100, 100]],
    },
    {
      id: 16,
      name: 'Bhartiya Vidya Bhavan Auditorium',
      city: 'Mumbai',
      location: 'Bandra',
      type: 'Auditorium',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[120, 120, 120], [120, 120, 120]],
    },
    {
      id: 17,
      name: 'Ravindra Bhavan Auditorium',
      city: 'Goa',
      location: 'Panaji',
      type: 'Ground',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[80, 80, 80], [80, 80, 80]],
    },
    {
      id: 18,
      name: 'J.N. Auditorium',
      city: 'Bangalore',
      location: 'MG Road',
      type: 'Auditorium',
      image: 'https://tse4.mm.bing.net/th?id=OIP.16615zqx3n8PsBaMJGqZbAHaE8&pid=Api&P=0&h=180',
      seats_arrangement: [[110, 110, 110], [110, 110, 110]],
    },
  ]);


  const events = [
    {
      id: 1,
      title: "Movie Screening: Avengers",
      eventType: "Movie",
      duration: "2h 30m",
      photoLink: "https://via.placeholder.com/150?text=Avengers+Movie",
    },
    {
      id: 2,
      title: "Concert: The Weeknd Live",
      eventType: "Music Concert",
      duration: "3h 0m",
      photoLink: "https://via.placeholder.com/150?text=The+Weeknd+Concert",
    },
    {
      id: 3,
      title: "Stand-up Comedy: John Doe",
      eventType: "Comedy Show",
      duration: "1h 30m",
      photoLink: "https://via.placeholder.com/150?text=John+Doe+Comedy",
    },
    {
      id: 4,
      title: "Theater: Hamilton",
      eventType: "Theater",
      duration: "2h 45m",
      photoLink: "https://via.placeholder.com/150?text=Hamilton+Theater",
    },
    {
      id: 5,
      title: "Sports Event: Basketball Finals",
      eventType: "Sports",
      duration: "2h 15m",
      photoLink: "https://via.placeholder.com/150?text=Basketball+Finals",
    },
    {
      id: 6,
      title: "Festival: Food & Music Fest",
      eventType: "Festival",
      duration: "4h 0m",
      photoLink: "https://via.placeholder.com/150?text=Food+and+Music+Festival",
    },
    {
      id: 7,
      title: "Art Exhibition: Modern Art Showcase",
      eventType: "Art Exhibition",
      duration: "2h 0m",
      photoLink: "https://via.placeholder.com/150?text=Art+Exhibition",
    },
    {
      id: 8,
      title: "Conference: Tech Innovators Summit",
      eventType: "Conference",
      duration: "5h 0m",
      photoLink: "https://via.placeholder.com/150?text=Tech+Innovators+Summit",
    },
    {
      id: 9,
      title: "Dance Show: Broadway Style",
      eventType: "Dance Show",
      duration: "2h 15m",
      photoLink: "https://via.placeholder.com/150?text=Broadway+Dance+Show",
    },
    {
      id: 10,
      title: "Workshop: Photography Basics",
      eventType: "Workshop",
      duration: "3h 30m",
      photoLink: "https://via.placeholder.com/150?text=Photography+Workshop",
    }
  ];

  

  const [selectedTheater, setSelectedTheater] = useState(null);

  // Refs for each section
  const theaterRef = useRef();
  const groundRef = useRef();
  const auditoriumRef = useRef();

  // Function to close the modal
  const closeModal = () => setSelectedTheater(null);


  const capacity = (seats) => seats.length;

  const filterTheatersByType = (type) => theaters.filter((theater) => theater.type === type);

  const scroll = (ref, direction) => {
    const container = ref.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

const renderTheaterSection = (title, type, ref) => (
  <section className="mb-8 relative">
    <h2 className="text-2xl font-semibold text-yellow-50 mb-4">{title}</h2>

    <div className="relative">
      {/* Scrollable theater cards container */}
      <div ref={ref} className="flex gap-4 overflow-x-auto px-4 py-4 scrollbar-none">
        {filterTheatersByType(type)
          .filter(
            (theater) =>
              (!filterTitle || theater.movies?.some((movie) => movie.title === filterTitle)) &&
              (!filterTheater || theater.name.toLowerCase() === filterTheater.toLowerCase())
          )
          .map((theater) => (
            <div
              key={theater.id}
              onClick={() => setSelectedTheater(theater)}
              className="min-w-[300px] p-4 bg-gray-800 rounded-lg shadow-md text-white cursor-pointer hover:bg-gray-700 transition"
            >
              <img
                src={theater.image}
                alt={theater.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{theater.name}</h2>
              <p className="text-sm">{theater.city}</p>
              <p className="text-sm">{theater.location}</p>
              <div className="flex justify-between">
                <p className="text-sm">Type: {theater.type}</p>
                <p className="text-sm">
                  Capacity: {capacity(theater.seats_arrangement)}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Left Scroll Button */}
      <button
        onClick={() => scroll(ref, 'left')}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg z-10"
      >
        &lt;
      </button>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll(ref, 'right')}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg z-10"
      >
        &gt;
      </button>
    </div>
  </section>
);

  const [filterTitle, setFilterTitle] = useState('');
  const [filterTheater, setFilterTheater] = useState('');
  useEffect(() => {
    setFilterTitle(filtertitle);
  }, []);

  const handleInputChange = (e) => {
    setFilterTitle(e.target.value);
  };

  const handleInputChangeTheater = (e) => {
    setFilterTheater(e.target.value);
  };

  return (
   <>
   
   <Navbar />
    <div className='bg-gray-900'>

    <div className='flex justify-end'>

    <div className="bg-gray-900 text-white p-4 flex items-center space-x-4 justify-end">
      <span className="text-lg font-semibold">Movie</span>
          <div className="relative">
            <input
              type="text"
              value={filterTitle}
              onChange={handleInputChange}
              placeholder="Search for a Movie..."
              className="px-4 py-2 pr-10 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filterTitle && (
              <button
                onClick={() => setFilterTitle("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
    </div>


    <div className="bg-gray-900 text-white p-4 flex items-center space-x-4 justify-end">
  <span className="text-lg font-semibold">Theater</span>
  <div className="relative">
    <input
      type="text"
      value={filterTheater}
      onChange={handleInputChangeTheater}
      placeholder="Search for a Theater..."
      className="px-4 py-2 pr-10 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {filterTheater && (
      <button
        onClick={() => setFilterTheater("")}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
      >
        ✕
      </button>
    )}
  </div>
</div>

    </div>


      <div className="relative p-4 bg-gray-900 min-h-screen">
      {/* <h1 className="text-3xl font-bold mb-6 text-yellow-50">Theaters</h1> */}
      {renderTheaterSection('Theaters', 'Theater', theaterRef)}
      {renderTheaterSection('Grounds', 'Ground', groundRef)}
      {renderTheaterSection('Auditoriums', 'Auditorium', auditoriumRef)}

      {/* Modal code should be here */}
      {selectedTheater && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
            >
              <ChevronLeft size={24} />
            </button>
            <img
              src={selectedTheater.image}
              alt={selectedTheater.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedTheater.name}</h2>
            <p className="text-gray-600 mb-1">📍 {selectedTheater.location}, {selectedTheater.city}</p>
            <p className="text-gray-600 mb-1">🏷️ Type: {selectedTheater.type}</p>
            <p className="text-gray-600 mb-1">🪑 Capacity: {capacity(selectedTheater.seats_arrangement)}</p>
            <p className="text-gray-500 mt-4 text-sm">Some dummy description or info can go here.</p>

              {/* Events Table */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Upcoming Events</h3>
                <table className="w-full text-left text-sm border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="p-2">Title</th>
                      <th className="p-2">Duration</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-t border-gray-300 hover:bg-gray-50">
                        <td className="p-2">{event.title}</td>
                        <td className="p-2">{event.duration}</td>
                        <td className="p-2">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 text-sm"  onClick={() => navigate(`/events/${event.id}`)}>
                            Book
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
  </div>
      )}
    </div>

    </div>
   
   </>
  );
};

export default TheatersPage;