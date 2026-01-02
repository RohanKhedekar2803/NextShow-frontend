import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Event from './Event';
import { getAllEvents, getAllshows, getshowByAuditoriumId } from '@/Services/homepage';

export default function EventList({ genreType }) {
  const navigate = useNavigate();
  const scrollContainer = useRef(null);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [auditorium, setAuditorium] = useState({});
  const [showListModal, setShowListModal] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');

  useEffect(() => {
    async function fetchData() {
      const data = await getAllEvents();
      const filtered = genreType === 'All' ? data : data.filter(ev => ev.event_Type === genreType);
      setMovies(filtered);
    }
    fetchData();
  }, [genreType]);

  const handleScroll = (direction) => {
    const container = scrollContainer.current;
    container.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const handleBookClick = async (eventId, eventTitle) => {
    try {
      const allShows = await getAllshows();
      const filteredShows = allShows.filter(show => show.eventId === eventId);
      setShows(filteredShows);
      setSelectedEventTitle(eventTitle);
      setShowListModal(true);

      const auditoriumMap = {};
      await Promise.all(
        filteredShows.map(async (show) => {
          const audId = show.auditoriumId;
          if (!auditoriumMap[audId]) {
            const data = await getshowByAuditoriumId(audId);
            auditoriumMap[audId] = data;
          }
        })
      );
      setAuditorium(auditoriumMap);
    } catch (err) {
      console.error('Error fetching shows or auditorium names:', err);
    }
  };

  const formatCustomDate = ([year, month, day, hour, minute]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const pad = (num) => String(num).padStart(2, '0');
    const monthName = months[month - 1];
    return `${pad(day)} ${monthName} ${year} ${pad(hour)}:${pad(minute)} IST`;
  };

  const handleBookShow = (show) => {
    alert(`Booking show with ID: ${show.id}`);
  };

  return (
    <div className="bg-gray-900">
      <div className="text-yellow-50 font-extrabold text-3xl pt-4 pl-4">Explore {genreType}</div>
      <div className="relative">
        <div ref={scrollContainer} className="flex overflow-x-auto space-x-4 py-6 px-4 bg-gray-900 scrollbar-none">
          {movies.map((movie) => (
            <Event
              key={movie.eventId}
              eventId={movie.eventId}
              title={movie.title}
              genre={movie.genre}
              image={movie.metadata?.posterURL}
              cast={movie.metadata?.cast || []}
              description={movie.description}
              duration={movie.duration}
              releaseDate={movie.releaseDate}
              onBookClick={handleBookClick}
            />
          ))}
        </div>

        <button
          onClick={() => handleScroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg"
        >
          &lt;
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg"
        >
          &gt;
        </button>
      </div>

      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full overflow-y-auto max-h-[80vh] relative">
            <button
              onClick={() => setShowListModal(false)}
              className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              Available Shows for <span className="text-purple-600">{selectedEventTitle}</span>
            </h2>
            {shows.length === 0 ? (
              <p className="text-gray-700">No shows available for this event.</p>
            ) : (
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Auditorium</th>
                    <th className="p-2 border">Time</th>
                    <th className="p-2 border">Location</th>
                    <th className="p-2 border">Prices</th>
                    <th className="p-2 border">Book Now</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.map((show, idx) => {
                    const aud = auditorium[show.auditoriumId];
                    return (
                      <tr key={idx} className="text-center border-t">
                        <td className="p-2 border">{aud?.name || 'Loading...'}</td>
                        <td className="p-2 border">{formatCustomDate(show.startTime)} - {formatCustomDate(show.endTime)}</td>
                        <td className="p-2 border">{aud?.location  || 'Loading...'}</td>
                        <td className="p-2 border">₹{show.blockprices?.[0] || 'N/A'} Onwards</td>
                        <td className="p-2 border">
                          <button
                            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded"
                            onClick={() => navigate(`/events/${show.showId}`)}
                          >
                            Book Now
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}