import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Event from './Event';
import { getAllEvents, getAllshows, getshowByAuditoriumId } from '@/Services/homepage';
import { toast } from "react-hot-toast";


export default function EventList({ genreType }) {
  const navigate = useNavigate();
  const scrollContainer = useRef(null);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [auditorium, setAuditorium] = useState({});
  const [showListModal, setShowListModal] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllEvents();
      const filtered = genreType === 'All' ? data : data.filter(ev => ev.event_Type === genreType);
      setMovies(filtered);
    }
    fetchData();
  }, [genreType]);

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainer.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const hasOverflow = scrollWidth > clientWidth;
    const isAtStart = scrollLeft <= 5; // Small threshold for rounding
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 5;
    
    setCanScrollLeft(hasOverflow && !isAtStart);
    setCanScrollRight(hasOverflow && !isAtEnd);
  }, []);

  useEffect(() => {
    checkScrollButtons();
    // Check again after a short delay to ensure DOM is fully rendered
    const timer = setTimeout(checkScrollButtons, 100);
    // Also check after images load
    const imageLoadTimer = setTimeout(checkScrollButtons, 500);
    
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }
    
    return () => {
      clearTimeout(timer);
      clearTimeout(imageLoadTimer);
      if (container) {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      }
    };
  }, [movies, checkScrollButtons]);

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
  
    toast.success(`Booking show with ID: ${show.id}`);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400">
          Explore {genreType}
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-yellow-400 rounded-full mt-2"></div>
      </div>
      <div className="relative group">
        <div 
          ref={scrollContainer} 
          className="flex overflow-x-auto space-x-4 sm:space-x-6 py-6 px-4 sm:px-6 lg:px-8 pb-8 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#9333ea rgba(31, 41, 55, 0.5)'
          }}
        >
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

        {movies.length > 0 && canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-3 sm:p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 z-10 border border-white/20"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {movies.length > 0 && canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-3 sm:p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 z-10 border border-white/20"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {showListModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setShowListModal(false)}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-white/10">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Available Shows
                  </h2>
                  <p className="text-purple-300 font-semibold text-sm sm:text-base">
                    {selectedEventTitle}
                  </p>
                </div>
                <button
                  onClick={() => setShowListModal(false)}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-2xl font-light transition-all duration-200 hover:rotate-90 hover:scale-110 flex-shrink-0"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {shows.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">No shows available for this event.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">Auditorium</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">Time</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">Location</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">Price</th>
                            <th className="text-center p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shows.map((show, idx) => {
                            const aud = auditorium[show.auditoriumId];
                            return (
                              <tr 
                                key={idx} 
                                className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150"
                              >
                                <td className="p-4 text-white font-semibold">{aud?.name || 'Loading...'}</td>
                                <td className="p-4 text-gray-300 text-sm">
                                  <div className="space-y-1">
                                    <div className="font-medium">{formatCustomDate(show.startTime)}</div>
                                    <div className="text-gray-400">to {formatCustomDate(show.endTime)}</div>
                                  </div>
                                </td>
                                <td className="p-4 text-gray-300">{aud?.location || 'Loading...'}</td>
                                <td className="p-4">
                                  <span className="text-purple-400 font-bold text-lg">₹{show.blockprices?.[0] || 'N/A'}</span>
                                  <span className="text-gray-500 text-sm ml-1">onwards</span>
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
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
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {shows.map((show, idx) => {
                        const aud = auditorium[show.auditoriumId];
                        return (
                          <div 
                            key={idx}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-purple-500/50 transition-all duration-200"
                          >
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-white font-bold text-lg mb-1">{aud?.name || 'Loading...'}</h3>
                                <p className="text-gray-400 text-sm">{aud?.location || 'Loading...'}</p>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <div className="text-gray-300 text-sm">
                                    <div className="font-medium">{formatCustomDate(show.startTime)}</div>
                                    <div className="text-gray-400">to {formatCustomDate(show.endTime)}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <div>
                                  <span className="text-purple-400 font-bold text-xl">₹{show.blockprices?.[0] || 'N/A'}</span>
                                  <span className="text-gray-500 text-sm ml-1">onwards</span>
                                </div>
                                <button
                                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95"
                                  onClick={() => navigate(`/events/${show.showId}`)}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}