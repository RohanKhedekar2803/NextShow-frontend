
import { useRef, useEffect, useCallback, useState } from 'react';
import { X, Search } from 'lucide-react';
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

  // Scroll button visibility states
  const [theaterScrollState, setTheaterScrollState] = useState({ left: false, right: false });
  const [groundScrollState, setGroundScrollState] = useState({ left: false, right: false });
  const [auditoriumScrollState, setAuditoriumScrollState] = useState({ left: false, right: false });
  
  // Filter states
  const [filterTitle, setFilterTitle] = useState('');
  const [filterTheater, setFilterTheater] = useState('');

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

  const checkScrollButtons = useCallback((ref, setState) => {
    const container = ref.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const hasOverflow = scrollWidth > clientWidth;
    const isAtStart = scrollLeft <= 5;
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 5;
    
    setState({
      left: hasOverflow && !isAtStart,
      right: hasOverflow && !isAtEnd
    });
  }, []);

  const scroll = (ref, direction) => {
    const container = ref.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Setup scroll listeners for each section
  useEffect(() => {
    const setupScrollListeners = (ref, setState) => {
      const container = ref.current;
      if (!container) return;
      
      const checkScroll = () => checkScrollButtons(ref, setState);
      checkScroll();
      
      const timer = setTimeout(checkScroll, 100);
      const imageLoadTimer = setTimeout(checkScroll, 500);
      
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(imageLoadTimer);
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    };

    const cleanup1 = setupScrollListeners(theaterRef, setTheaterScrollState);
    const cleanup2 = setupScrollListeners(groundRef, setGroundScrollState);
    const cleanup3 = setupScrollListeners(auditoriumRef, setAuditoriumScrollState);

    return () => {
      cleanup1?.();
      cleanup2?.();
      cleanup3?.();
    };
  }, [theaters, filterTheater, checkScrollButtons]);

  const renderTheaterSection = (title, type, ref, scrollState) => {
    const filteredTheaters = filterTheatersByType(type).filter(
      (theater) =>
        (!filterTheater || theater.name.toLowerCase().startsWith(filterTheater.toLowerCase()))
    );

  return (
    <section className="mb-12 sm:mb-16 relative">
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 mb-2">
          {title}
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-yellow-400 rounded-full"></div>
      </div>

      <div className="relative group">
        {/* Scrollable theater cards container */}
        <div 
          ref={ref} 
          className="flex gap-4 sm:gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8 py-6 pb-8 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#9333ea rgba(31, 41, 55, 0.5)'
          }}
        >
          {filteredTheaters.length === 0 ? (
            <div className="w-full text-center py-12">
              <p className="text-gray-400 text-lg">No {title.toLowerCase()} found</p>
            </div>
          ) : (
            filteredTheaters.map((theater) => (
              <div
                key={theater.auditoriumId}
                onClick={() => setSelectedTheater(theater)}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 cursor-pointer group/card"
              >
                <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-2xl shadow-xl shadow-black/30 overflow-hidden transition-all duration-300 group-hover/card:scale-[1.02] group-hover/card:shadow-2xl group-hover/card:shadow-purple-500/20 border border-white/10">
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={
                        theater.auditorium === 'Ground'
                        ? 'https://tse3.mm.bing.net/th?id=OIP.ZizxV-vNQGUnleeufoWnogHaED&pid=Api&P=0&h=180'
                        : theater.auditorium === 'Auditorium'
                        ? 'https://tse3.mm.bing.net/th?id=OIP.Y9bJYCMt3Jfkj4EMva-ZMAHaE8&pid=Api&P=0&h=180'
                        : theater.auditorium === 'Theater'
                        ? 'https://tse3.mm.bing.net/th?id=OIP.ugaVOoEpEzhdRWoV1XpeagHaF0&pid=Api&P=0&h=180'
                        : theater.image
                      }
                      alt={theater.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {theater.auditorium}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover/card:text-purple-300 transition-colors duration-200">
                      {theater.name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-300 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {theater.city}
                      </p>
                      <p className="text-gray-400 text-sm">{theater.location}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-white font-semibold">{capacity(theater.seatsArrangement)}</span>
                        <span className="text-gray-400 text-sm">seats</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Left Scroll Button */}
        {scrollState.left && (
          <button
            onClick={() => scroll(ref, 'left')}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-3 sm:p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 z-10 border border-white/20"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Scroll Button */}
        {scrollState.right && (
          <button
            onClick={() => scroll(ref, 'right')}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-3 sm:p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 z-10 border border-white/20"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
  };

  useEffect(() => {
    setFilterTitle(filtertitle);
  }, [filtertitle]);

  const handleInputChange = (e) => {
    setFilterTitle(e.target.value);
  };

  const handleInputChangeTheater = (e) => {
    setFilterTheater(e.target.value);
  };

  return (
   <>
   
   <Navbar />
    <div className='bg-gradient-to-b from-gray-900 to-black'>

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


    <div className="bg-gradient-to-b from-gray-900 to-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-end gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filterTheater}
              onChange={handleInputChangeTheater}
              placeholder="Search for a Theater..."
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
            {filterTheater && (
              <button
                onClick={() => setFilterTheater("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    </div>


      <div className="relative bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading theaters...</p>
            </div>
          </div>
        ) : (
          <div className="py-8 sm:py-12">
            {renderTheaterSection('Theaters', 'Theater', theaterRef, theaterScrollState)}
            {renderTheaterSection('Grounds', 'Ground', groundRef, groundScrollState)}
            {renderTheaterSection('Auditoriums', 'Auditorium', auditoriumRef, auditoriumScrollState)}
          </div>
        )}

      {/* Modal */}
      {selectedTheater && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-white/10">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-transparent">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{selectedTheater.name}</h2>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-500/30">
                      {selectedTheater.auditorium}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedTheater.location}, {selectedTheater.city}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 hover:rotate-90 hover:scale-110 flex-shrink-0 ml-4"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img
                src={
                  selectedTheater.auditorium === 'Ground'
                  ? 'https://tse3.mm.bing.net/th?id=OIP.ZizxV-vNQGUnleeufoWnogHaED&pid=Api&P=0&h=180'
                  : selectedTheater.auditorium === 'Auditorium'
                  ? 'https://tse3.mm.bing.net/th?id=OIP.Y9bJYCMt3Jfkj4EMva-ZMAHaE8&pid=Api&P=0&h=180'
                  : selectedTheater.auditorium === 'Theater'
                  ? 'https://tse3.mm.bing.net/th?id=OIP.ugaVOoEpEzhdRWoV1XpeagHaF0&pid=Api&P=0&h=180'
                  : selectedTheater.image
                }
                alt={selectedTheater.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Theater Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</p>
                  <p className="text-white font-semibold">{selectedTheater.auditorium}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Capacity</p>
                  <p className="text-white font-semibold">{capacity(selectedTheater.seatsArrangement)} seats</p>
                </div>
              </div>

              {/* Events Table */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upcoming Events
                </h3>
                
                {showslist.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <p className="text-gray-400 text-lg">No upcoming events scheduled</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">Start Time</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">End Time</th>
                            <th className="text-center p-4 text-sm font-bold text-gray-300 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {showslist.map((event) => (
                            <tr 
                              key={event.showId} 
                              className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150"
                            >
                              <td className="p-4 text-white font-semibold">{event.event?.title || 'N/A'}</td>
                              <td className="p-4 text-gray-300 text-sm">
                                {event.startTime[2]}/{String(event.startTime[1]).padStart(2, '0')}/{event.startTime[0]}
                              </td>
                              <td className="p-4 text-gray-300 text-sm">
                                {String(event.startTime[3]).padStart(2, '0')}:{String(event.startTime[4]).padStart(2, '0')}
                              </td>
                              <td className="p-4 text-gray-300 text-sm">
                                {String(event.endTime[3]).padStart(2, '0')}:{String(event.endTime[4]).padStart(2, '0')}
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
                                  onClick={() => {
                                    navigate(`/events/${event.showId}`);
                                    closeModal();
                                  }}
                                >
                                  Book Now
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {showslist.map((event) => (
                        <div 
                          key={event.showId}
                          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-purple-500/50 transition-all duration-200"
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-white font-bold text-lg mb-2">{event.event?.title || 'N/A'}</h4>
                              <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{event.startTime[2]}/{String(event.startTime[1]).padStart(2, '0')}/{event.startTime[0]}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-400">Start:</span>
                                    <span>{String(event.startTime[3]).padStart(2, '0')}:{String(event.startTime[4]).padStart(2, '0')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-400">End:</span>
                                    <span>{String(event.endTime[3]).padStart(2, '0')}:{String(event.endTime[4]).padStart(2, '0')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95"
                              onClick={() => {
                                navigate(`/events/${event.showId}`);
                                closeModal();
                              }}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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