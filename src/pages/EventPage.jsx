import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X, Clock, Calendar, Ticket, Monitor  } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import { getShowById } from '@/Services/theaters';
import { getUserId } from "@/Services/auth";
import {
  postBooking,
  getBookingStatus,
  fetchStripeCheckoutUrl,
  getSoldTicketsForShow
} from '@/Services/Bookingpage';
import { toast } from "react-hot-toast";

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
  const [selectedSection, setSelectedSection] = useState(null);


  const toggleSeat = (sectionIdx, rowIdx, seatIdx) => {
    const seatId = `S${sectionIdx}-R${rowIdx}-C${seatIdx}`;
  
    setSelectedSeats((prev) => {
      // selecting first seat → lock
      if (prev.length === 0) {
        setSelectedSection(sectionIdx);
      }
  
      // trying other section while locked → stop
      if (
        selectedSection !== null &&
        sectionIdx !== selectedSection &&
        !prev.includes(seatId)
      ) {
        toast.error("Please select seats from the same section.");
        return prev;
      }
  
      // deselect
      if (prev.includes(seatId)) {
        const updated = prev.filter((id) => id !== seatId);
  
        // if nothing left → unlock
        if (updated.length === 0) {
          setSelectedSection(null);
        }
  
        return updated;
      }
  
      // select
      return [...prev, seatId];
    });
  };
  
  


  

  const handleFinalBooking = async () => {
    if (selectedSeats.length === 0) {
  
      toast.warning('Please select at least one seat.');

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
      
        const email = localStorage.getItem("username")
        // 3️⃣ Call backend to fetch userId
        
        const userIdx = await getUserId(email);

        

        if (userIdx) {
          localStorage.setItem("user_id", String(userIdx));
        } else {
          console.warn("User ID not found for email:", email);
        }

      const userIdStr = localStorage.getItem('user_id'); 
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
           
            toast.error('❌ Could not retrieve payment link. Please try again.');
          }
          break;
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 4000));
          } else {
            
            toast.error('❌ Booking Failed. Please try again.');
          }
        }
      }

      setModalOpen(false);
      setSelectedSeats([]);
    } catch (error) {
    
      toast.error('❌ Booking failed! Check console.');
      // console.error('Booking error:', error);
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
        console.log("retriving sold bookings ")
        // Example soldSeats: ['S013-C001-R001', 'S013-C002-R001']

        const uiSeatIds = soldSeats.map(seat => {
          const parts = seat.split('-'); // ['S013', 'C001', 'R001']

          const col = parseInt(parts[1].substring(1), 10) - 1;
          const globalRow = parseInt(parts[2].substring(1), 10) - 1;

          // 🔑 Determine section index dynamically
          let runningRowCount = 0;
          let sectionIdx = 0;

          for (let i = 0; i < seatLayout.length; i++) {
            const sectionRowCount = seatLayout[i].length;
            if (globalRow < runningRowCount + sectionRowCount) {
              sectionIdx = i;
              break;
            }
            runningRowCount += sectionRowCount;
          }

  const localRow = globalRow - runningRowCount;

  return `S${sectionIdx}-R${globalRow}-C${col}`;
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
  if (selectedSeats.length === 0) {
    setFinalprices(0);
    return;
  }

  const [sectionIdx] = selectedSeats[0].match(/\d+/g);
  const pricePerSeat = sectionPrices[sectionIdx] || 0;

  setFinalprices(pricePerSeat * selectedSeats.length);
}, [selectedSeats, sectionPrices]); 

useEffect(() => {
  if (modalOpen) {
    setSelectedSeats([]);
    setSelectedSection(null);
  }
}, [modalOpen]);


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
            <h1 className="text-3xl font-bold text-white mb-1 sm:mb-2">Event Not Found</h1>
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
        <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
          <img
            loading="lazy"
            src={posterURL}
            alt={eventTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://in.images.search.yahoo.com/images/view;_ylt=Awrx_3cBqXhp6IsRy1W9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkA2RmNmRkOTFiNjI4YjVlNDg2NmQwOGVlNThkODM0NTRhBGdwb3MDMTMEaXQDYmluZw--?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Ddrama%2Bimage%26type%3DE211IN1274G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D13&w=626&h=352&imgurl=img.freepik.com%2Fpremium-photo%2Ftheater-masks-drama-comedy-with-red-curtain-as-backdrop_175949-7436.jpg&rurl=https%3A%2F%2Fwww.freepik.com%2Fpremium-ai-image%2Ftheater-masks-drama-comedy-with-red-curtain-as-backdrop_188659005.htm&size=58KB&p=drama+image&oid=df6dd91b628b5e4866d08ee58d83454a&fr2=piv-web&fr=mcafee&tt=Premium+Photo+%7C+Theater+masks+drama+and+comedy+with+a+red+curtain+as+...&b=0&ni=21&no=13&ts=&tab=organic&sigr=8.JaTUBEPFeX&sigb=Y5XAifI8Ksh2&sigi=WfaDwGq2ooNY&sigt=KT2f4.sLGh9i&.crumb=FLJfI1E2.uw&fr=mcafee&fr2=piv-web&type=E211IN1274G0';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          
          {/* Event Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-2xl">
                {eventTitle}
              </h1>
              <div className="flex flex-wrap ga p-2 mb-2 sm:mb-6">
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
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold px-8 py-2 sm:py-4 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95 text-lg"
              >
                Book Tickets Now
              </button>
            </div>
          </div>
        </div>

      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-2 sm:p-3 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl relative max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-white/10">
            {/* Header */}
            <div className="p-3 sm:p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-transparent flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xs sm:text-lg md:text-3xl font-bold text-white mb-1 sm:mb-2">{eventTitle}</h2>
                  <div className="flex flex-wrap gap-2 items-center text-xs sm:text-sm">
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
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Seat Legend */}
            <div className="px-4 sm:px-8 pt-3 flex-shrink-0">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 mb-2 sm:mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-gray-600 border border-gray-500"></div>
                  <span className="text-xs sm:text-sm text-gray-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-gradient-to-br from-green-500 to-green-600 border border-green-400 shadow-lg shadow-green-500/30"></div>
                  <span className="text-xs sm:text-sm text-gray-300">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-red-600 border border-red-500 opacity-60"></div>
                  <span className="text-xs sm:text-sm text-gray-300">Booked</span>
                </div>
              </div>
            </div>

            {/* Screen Indicator */}
            <div className="w-full text-center mb-2 sm:mb-6 px-6 sm:px-8 flex-shrink-0">
              <div className="relative">
                <div className="bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 h-7 sm:h-12 w-[70%] sm:w-[60%] mx-auto rounded-t-2xl shadow-2xl border-2 border-gray-500/50 flex items-center justify-center">
                  <Monitor className="w-5 h-5 sm:w-6 sm:h-6  text-gray-300" />
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
                  const base = Math.floor((0.75 * window.innerWidth) / maxSeatsInRow) - 8;
                  let seatSize = Math.max(26, base);

                    // boost for laptop
                    if (window.innerWidth >= 900) {
                      seatSize = Math.max(34, base);
                    }

                    seatSize = Math.min(48, seatSize);
                  const fontSize = seatSize > 30 ? 'text-sm' : seatSize > 28 ? 'text-xs' : 'text-[10px]';

                  const rowOffset = seatLayout
                    .slice(0, sectionIdx)
                    .reduce((acc, sec) => acc + sec.length, 0);

                  return (
                    <div key={sectionIdx} className="mb-4 sm:mb-8 last:mb-2">
                      <div className="flex items-center justify-between mb-4 bg-white/5 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/10">
                        <h3 className="text-white font-bold text-xs sm:text-lg">Section {sectionIdx + 1}</h3>
                        <span className="text-purple-400 font-bold text-lg">₹{sectionPrices[sectionIdx] || 0}</span>
                      </div>

                      {section.map((seatCount, rowIdx) => {
                        const globalRowIdx = rowOffset + rowIdx;

                        return (
                          <div key={globalRowIdx} className="flex gap-1 sm:gap-2 mb-1 sm:mb-2 justify-center flex-wrap">
                            {Array.from({ length: seatCount }, (_, seatIdx) => {
                              const seatId = `S${sectionIdx}-R${globalRowIdx}-C${seatIdx}`;
                              const isSelected = selectedSeats.includes(seatId);
                              const isBooked = bookedSeats.includes(seatId);
                              const isOtherSectionDisabled =
                                            selectedSection !== null && sectionIdx !== selectedSection;
                              return (
                                <button
                                  key={seatId}
                                  disabled={isBooked || isOtherSectionDisabled}
                                  onClick={() => toggleSeat(sectionIdx, globalRowIdx, seatIdx)}
                                  className={`
                                    rounded-lg font-mono font-semibold transition-all duration-200
                                    ${fontSize}
                                    ${
                                      isBooked
                                        ? 'bg-red-600/60 border-2 border-red-500 cursor-not-allowed opacity-60'
                                        : isOtherSectionDisabled
                                        ? 'bg-gray-800 border-2 border-gray-700 cursor-not-allowed opacity-40'
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
            <div className="p-3 sm:p-6 md:p-8 pt-0 border-t border-white/10 bg-gradient-to-t from-gray-900/50 to-transparent flex-shrink-0">
              <div className="mb-2 sm:mb-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/10 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Selected Seats</p>
                      <p className="text-xs sm:text-lg md:text-xl font-bold text-white">{selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">Total Price</p>
                      <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400">₹{finalprices}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleFinalBooking}
                  disabled={selectedSeats.length === 0}
                  className={`
                    flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 
                    text-white font-bold py-2 sm:py-4 px-6 rounded-xl transition-all duration-200 
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
                    setSelectedSection(null);
                  }}
                  className="sm:w-auto w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2 sm:py-4 px-6 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40"
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
