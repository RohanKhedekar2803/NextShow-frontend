import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X, Clock, Calendar, Ticket, Monitor  } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import { getShowById } from '@/Services/theaters';
import {
  postBooking,
  getBookingStatus,
  fetchStripeCheckoutUrl,
  getSoldTicketsForShow
} from '@/Services/Bookingpage';

const EventPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);
  const [sectionPrices, setSectionPrices] = useState([]);
  const [finalprices, setFinalprices] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]); // Booked seats in UI format

  const toggleSeat = (sectionIdx, globalRowIdx, seatIdx) => {
    const seatId = `S${sectionIdx}-R${globalRowIdx}-C${seatIdx}`;
    if (bookedSeats.includes(seatId)) return; // Ignore clicks on booked seats

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleFinalBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    const showIdPadded = String(id).padStart(3, '0');

    const formattedSeats = selectedSeats.map((seatId) => {
      const [sectionIdx, rowIdx, seatIdx] = seatId.match(/\d+/g);
      const paddedRow = String(Number(rowIdx) + 1).padStart(3, '0');
      const paddedCol = String(Number(seatIdx) + 1).padStart(3, '0');
      return {
        seatId: `S${showIdPadded}-C${paddedCol}-R${paddedRow}`,
        seatPrice: sectionPrices[sectionIdx]
      };
    });

    let totalPrice = formattedSeats.reduce((acc, seat) => acc + seat.seatPrice, 0);
    setFinalprices(totalPrice);

    try {
      const userIdStr = localStorage.getItem('user_id'); // "22"
      const userId = userIdStr;
      const showId = String(id);

      const response = await postBooking({
        userId,
        showId,
        seats: formattedSeats,
        finalPrice: totalPrice
      });

      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        const res = await getBookingStatus(userId, showId, formattedSeats[0].seatId);
        if (res.includes("Ready for Payment")) {
          const checkoutUrl = await fetchStripeCheckoutUrl(userId, showId, formattedSeats[0].seatId);

          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            alert('❌ Could not retrieve payment link. Please try again.');
          }
          break;
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } else {
            alert('❌ Booking not ready after multiple attempts. Please try again.');
          }
        }
      }

      setModalOpen(false);
      setSelectedSeats([]);
    } catch (error) {
      alert('❌ Booking failed! Check console.');
      console.error('Booking error:', error);
    }
  };

  useEffect(() => {
    if (!id) {
      setError('No event ID provided');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching event with ID:', id);
        const data = await getShowById(id);
        console.log('Event data received:', data);
        
        if (!data) {
          setError('No event data received');
          setLoading(false);
          return;
        }
        
        setEvents(data);
        
        // Safely access seat layout
        const seatsArrangement = data?.auditoriumInfo?.seatsArrangement || 
                                 data?.seatsArrangement || 
                                 data?.auditorium?.seatsArrangement || [];
        console.log('Seat layout:', seatsArrangement);
        setSeatLayout(Array.isArray(seatsArrangement) ? seatsArrangement : []);
        
        // Safely access prices
        const prices = data?.blockprices || data?.blockPrices || data?.prices || [];
        console.log('Section prices:', prices);
        setSectionPrices(Array.isArray(prices) ? prices : []);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Fetch booked seats and convert to UI seat IDs for disabling and coloring red
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const showId = String(id);
        const soldSeats = await getSoldTicketsForShow(showId);
        // Example soldSeats: ['S013-C001-R001', 'S013-C002-R001']

        const uiSeatIds = soldSeats.map(seat => {
          const parts = seat.split('-'); // ['S013', 'C001', 'R001']
          // Assuming one section (0), adjust if multiple sections logic is needed
          const sectionIdx = 0;
          const col = parseInt(parts[1].substring(1), 10) - 1; // 'C001' => 0
          const row = parseInt(parts[2].substring(1), 10) - 1; // 'R001' => 0
          return `S${sectionIdx}-R${row}-C${col}`; // 'S0-R0-C0' format for UI
        });

        setBookedSeats(uiSeatIds);
      } catch (err) {
        console.error("❌ Failed to fetch sold tickets:", err);
      }
    };

    if (modalOpen) {
      fetchBookedSeats();
    }
  }, [modalOpen, id]);

  useEffect(() => {
    let total = 0;
    selectedSeats.forEach((seatId) => {
      const [sectionIdx] = seatId.match(/\d+/g);
      total += sectionPrices[sectionIdx] || 0;
    });
    setFinalprices(total);
  }, [selectedSeats, sectionPrices]);

  // Early returns for loading and error states
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading event details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !events) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Event Not Found</h1>
            <p className="text-gray-400">{error || 'The event you\'re looking for does not exist.'}</p>
          </div>
        </div>
      </>
    );
  }

  // Helper functions
  const formatTime = (timeArray) => {
    try {
      if (!timeArray || !Array.isArray(timeArray)) return 'N/A';
      const hour = String(timeArray[3] || 0).padStart(2, '0');
      const minute = String(timeArray[4] || 0).padStart(2, '0');
      return `${hour}:${minute}`;
    } catch (e) {
      return 'N/A';
    }
  };

  const formatDate = (timeArray) => {
    try {
      if (!timeArray || !Array.isArray(timeArray) || timeArray.length < 3) return 'N/A';
      const day = String(timeArray[2] || 1).padStart(2, '0');
      const month = String(timeArray[1] || 1).padStart(2, '0');
      const year = timeArray[0] || new Date().getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return 'N/A';
    }
  };

  // Safely access event data (events is guaranteed to exist here)
  const eventDetails = events?.eventDetails || events?.event || {};
  const eventTitle = eventDetails?.title || events?.eventName || 'Event';
  const eventType = eventDetails?.event_Type || eventDetails?.eventType || 'Event';
  const posterURL = eventDetails?.metadata?.posterURL || 'https://tse3.mm.bing.net/th/id/OIP.4cHT08SCSSMUYUGFDLjx1AHaE8?pid=Api&P=0&h=180';
  const startTime = events?.startTime || [];
  const endTime = events?.endTime || [];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
          <img
            src={posterURL}
            alt={eventTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://tse3.mm.bing.net/th/id/OIP.4cHT08SCSSMUYUGFDLjx1AHaE8?pid=Api&P=0&h=180';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          
          {/* Event Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-2xl">
                {eventTitle}
              </h1>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Ticket className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">{eventType}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">{formatDate(startTime)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold">{formatTime(startTime)} - {formatTime(endTime)} IST</span>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95 text-lg"
              >
                Book Tickets Now
              </button>
            </div>
          </div>
        </div>

      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl relative max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-white/10">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-transparent flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{eventTitle}</h2>
                  <div className="flex flex-wrap gap-3 items-center text-sm">
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full font-semibold border border-purple-500/30">
                      {eventType}
                    </span>
                    <span className="text-gray-300">{formatDate(startTime)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300">{formatTime(startTime)} - {formatTime(endTime)} IST</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedSeats([]);
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 hover:rotate-90 hover:scale-110 flex-shrink-0 ml-4"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Seat Legend */}
            <div className="px-6 sm:px-8 pt-6 flex-shrink-0">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-600 border border-gray-500"></div>
                  <span className="text-sm text-gray-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-green-600 border border-green-400 shadow-lg shadow-green-500/30"></div>
                  <span className="text-sm text-gray-300">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-red-600 border border-red-500 opacity-60"></div>
                  <span className="text-sm text-gray-300">Booked</span>
                </div>
              </div>
            </div>

            {/* Screen Indicator */}
            <div className="w-full text-center mb-6 px-6 sm:px-8 flex-shrink-0">
              <div className="relative">
                <div className="bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 h-8 sm:h-12 w-[70%] sm:w-[60%] mx-auto rounded-t-2xl shadow-2xl border-2 border-gray-500/50 flex items-center justify-center">
                  <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                </div>
                <div className="absolute inset-x-0 top-full flex justify-center">
                  <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-700"></div>
                </div>
              </div>
              <p className="uppercase text-xs sm:text-sm text-gray-400 tracking-widest mt-2 font-semibold">Screen</p>
            </div>

            {/* Seat Selection Area */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-6">
              {!seatLayout || !Array.isArray(seatLayout) || seatLayout.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">Seat layout not available</p>
                </div>
              ) : (
              <div className="w-full overflow-x-auto">
                {seatLayout.map((section, sectionIdx) => {
                  const maxSeatsInRow = Math.max(...section);
                  const seatSize = Math.min(45, Math.max(35, Math.floor((0.75 * window.innerWidth) / maxSeatsInRow) - 8));
                  const fontSize = seatSize > 35 ? 'text-sm' : seatSize > 28 ? 'text-xs' : 'text-[10px]';

                  const rowOffset = seatLayout
                    .slice(0, sectionIdx)
                    .reduce((acc, sec) => acc + sec.length, 0);

                  return (
                    <div key={sectionIdx} className="mb-8 last:mb-4">
                      <div className="flex items-center justify-between mb-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <h3 className="text-white font-bold text-lg">Section {sectionIdx + 1}</h3>
                        <span className="text-purple-400 font-bold text-lg">₹{sectionPrices[sectionIdx] || 0}</span>
                      </div>

                      {section.map((seatCount, rowIdx) => {
                        const globalRowIdx = rowOffset + rowIdx;

                        return (
                          <div key={globalRowIdx} className="flex gap-1.5 sm:gap-2 mb-2 justify-center flex-wrap">
                            {Array.from({ length: seatCount }, (_, seatIdx) => {
                              const seatId = `S${sectionIdx}-R${globalRowIdx}-C${seatIdx}`;
                              const isSelected = selectedSeats.includes(seatId);
                              const isBooked = bookedSeats.includes(seatId);

                              return (
                                <button
                                  key={seatId}
                                  disabled={isBooked}
                                  onClick={() => toggleSeat(sectionIdx, globalRowIdx, seatIdx)}
                                  className={`
                                    rounded-lg font-mono font-semibold transition-all duration-200
                                    ${fontSize}
                                    ${isBooked
                                      ? 'bg-red-600/60 border-2 border-red-500 cursor-not-allowed opacity-60'
                                      : isSelected
                                      ? 'bg-gradient-to-br from-green-500 to-green-600 border-2 border-green-400 shadow-lg shadow-green-500/30 scale-110'
                                      : 'bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 hover:border-gray-500 hover:scale-105 active:scale-95'
                                    }
                                  `}
                                  style={{
                                    width: `${seatSize}px`,
                                    height: `${seatSize}px`,
                                    minWidth: `${seatSize}px`,
                                    minHeight: `${seatSize}px`,
                                  }}
                                  title={isBooked ? 'Booked' : isSelected ? 'Selected' : `Seat ${seatIdx + 1}`}
                                >
                                  {seatIdx + 1}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              )}
            </div>

            {/* Footer with Summary and Actions */}
            <div className="p-6 sm:p-8 pt-0 border-t border-white/10 bg-gradient-to-t from-gray-900/50 to-transparent flex-shrink-0">
              <div className="mb-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Selected Seats</p>
                      <p className="text-xl font-bold text-white">{selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">Total Price</p>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400">₹{finalprices}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleFinalBooking}
                  disabled={selectedSeats.length === 0}
                  className={`
                    flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 
                    text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 
                    shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 
                    hover:scale-[1.02] active:scale-[0.98]
                    ${selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  Proceed to Pay ₹{finalprices}
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedSeats([]);
                  }}
                  className="sm:w-auto w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default EventPage;
