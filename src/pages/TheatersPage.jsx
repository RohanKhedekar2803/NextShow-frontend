
import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import { getAllEvents, getEventById } from '@/Services/homepage';
import {getAllTheaters, getAllshowsByTheaterid} from '@/Services/theaters'



const TheatersPage = () => {
  const { filtertitle } = useParams();
  const navigate = useNavigate();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [showslist, setShowslist] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState(null);

  useEffect(() => {
    const fetchTheaters = async () => {
      const result = await getAllTheaters();
      setTheaters(result);
      console.log(result[0])
      setLoading(false);
    };

    fetchTheaters();
  }, []);

  useEffect(() => {
    if (!selectedTheater?.auditoriumId) return;
  
    getAllshowsByTheaterid(selectedTheater.auditoriumId)
      .then(data => {
        setEvents(data); // This should not re-trigger this useEffect unless `selectedTheater` changes
        if (data.length > 0) {
          setShowslist(data); // If you added eventName in the data
          console.log(data)
        }
      })
      .catch(err => {
        console.error(err);
        setEvents([]);
      });
  
  }, [selectedTheater?.auditoriumId]);
  
  useEffect(() => {

  }, [events]);
  


  // Refs for each section
  const theaterRef = useRef();
  const groundRef = useRef();
  const auditoriumRef = useRef();

  // Function to close the modal
  const closeModal = () => setSelectedTheater(null);


  const capacity = (seats) => {
    let total = 0;
    if (!Array.isArray(seats)) return 0;
  
    for (let row of seats) {
      if (!Array.isArray(row)) continue;
      for (let num of row) {
        total += num;
      }
    }
    return total;
  };
  function parseCustomTimestamp(timestamp) {
    const str = timestamp.toString();
  
    // Extract year - always 4 digits
    const year = Number(str.slice(0, 4));
  
    // Minutes are always last 2 digits
    const minutes = Number(str.slice(-2));
  
    // Hours are the 3rd and 4th last digits
    const hours = Number(str.slice(-4, -2));
  
    // Day is the 5th and 6th last digits
    const day = Number(str.slice(-6, -4));
  
    // Month is the remaining digits after year and before day
    const monthStr = str.slice(4, str.length - 6);
    const month = Number(monthStr);
  
    // Construct date object (JS months are 0-based)
    const date = new Date(year, month - 1, day, hours, minutes);
  
    if (isNaN(date)) return 'Invalid Date';
  
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  
  
  
  
  
  const filterTheatersByType = (type) =>
    theaters.filter((theater) => theater.auditorium === type);

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
              // (!filterTitle || theater.movies?.some((movie) => movie.title === filterTitle)) &&
              (!filterTheater || theater.name.toLowerCase().startsWith(filterTheater.toLowerCase()))
          )
          .map((theater) => (
            <div
              key={theater.auditoriumId}
              onClick={() => setSelectedTheater(theater)}
              className="min-w-[300px] p-4 bg-gray-800 rounded-lg shadow-md text-white cursor-pointer hover:bg-gray-700 transition"
            >
            <img
              src={
                theater.auditorium === 'Ground'
                ? 'https://tse3.mm.bing.net/th?id=OIP.ZizxV-vNQGUnleeufoWnogHaED&pid=Api&P=0&h=180'
                : theater.auditorium === 'Auditorium'
                ? 'https://tse3.mm.bing.net/th?id=OIP.Y9bJYCMt3Jfkj4EMva-ZMAHaE8&pid=Api&P=0&h=180'
                : theater.auditorium === 'Theater'
                ? 'https://tse3.mm.bing.net/th?id=OIP.ugaVOoEpEzhdRWoV1XpeagHaF0&pid=Api&P=0&h=180' // Replace this with actual Theater image URL
                : theater.image
                  
              }
              alt={theater.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

              <h2 className="text-xl font-semibold mb-2">{theater.name}</h2>
              <p className="text-sm">{theater.city}</p>
              <p className="text-sm">{theater.location}</p>
              <div className="flex justify-between">
                <p className="text-sm">Type: {theater.auditorium}</p>
                <p className="text-sm">
                  Capacity: {capacity(theater.seatsArrangement)}
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

    {/* <div className="bg-gray-900 text-white p-4 flex items-center space-x-4 justify-end">
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
    </div> */}


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
      {!loading && (
        <>
          {renderTheaterSection('Theaters', 'Theater', theaterRef)}
          {renderTheaterSection('Grounds', 'Ground', groundRef)}
          {renderTheaterSection('Auditoriums', 'Auditorium', auditoriumRef)}
        </>
      )}

      {/* Modal code should be here */}
      {selectedTheater && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
            >
              <ChevronLeft size={24} />
            </button>
            <img
                          src={
                            selectedTheater.auditorium === 'Ground'
                            ? 'https://tse3.mm.bing.net/th?id=OIP.ZizxV-vNQGUnleeufoWnogHaED&pid=Api&P=0&h=180'
                            : selectedTheater.auditorium === 'Auditorium'
                            ? 'https://tse3.mm.bing.net/th?id=OIP.Y9bJYCMt3Jfkj4EMva-ZMAHaE8&pid=Api&P=0&h=180'
                            : selectedTheater.auditorium === 'Theater'
                            ? 'https://tse3.mm.bing.net/th?id=OIP.ugaVOoEpEzhdRWoV1XpeagHaF0&pid=Api&P=0&h=180' // Replace this with actual Theater image URL
                            : selectedTheater.image
                              
                          }
              alt={selectedTheater.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedTheater.name}</h2>
            <p className="text-gray-600 mb-1">📍 {selectedTheater.location}, {selectedTheater.city}</p>
            <p className="text-gray-600 mb-1">🏷️ Type: {selectedTheater.auditorium}</p>
            <p className="text-gray-600 mb-1">🪑 Capacity: {capacity(selectedTheater.seatsArrangement)}</p>
            <p className="text-gray-500 mt-4 text-sm">Welcome to {selectedTheater.name} become seat for below shows </p>

              {/* Events Table */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Upcoming Events</h3>
                <table className="w-full text-left text-sm border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="p-2">Title</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Start</th>
                      <th className="p-2">End</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {showslist.map((event) => (
                  <tr key={event.showId} className="border-t border-gray-300 hover:bg-gray-50">
                    <td className="p-1 text-sm">{event.event.title}</td>
                    <td className="p-1 text-sm">{event.startTime[2]}:{event.startTime[1]}:{event.startTime[0]}</td>
                    <td className="p-1 text-sm">{event.startTime[3]}:{event.startTime[4]}</td>
                    <td className="p-1 text-sm">{event.endTime[3]}:{event.endTime[4]}</td>
                    <td className="p-1">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 text-sm"
                        onClick={() => navigate(`/events/${event.showId}`)}
                      >
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