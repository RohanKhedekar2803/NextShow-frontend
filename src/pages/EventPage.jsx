import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const [events, setEvents] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState();
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
    if (!id) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getShowById(id);
        setEvents(data);
        setSeatLayout(data.auditoriumInfo.seatsArrangement);
        setSectionPrices(data.blockprices);
      } catch (err) {
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

  if (loading) {
    return (
      <div className="p-6 text-center text-white bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold">Event Not Found</h1>
        <p className="text-gray-400 mt-2">The event you're looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <img
          src={'https://tse2.mm.bing.net/th?id=OIF.xLGq46pnwQ5MnmwUvUWTMA&pid=Api&P=0&h=180'}
          alt={'aaa'}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{events.eventDetails.title}</h1>
        <p className="text-gray-400 mb-1">🎭 Type: {events.eventDetails.event_Type}</p>
        <p className="text-gray-400 mb-1">
          ⏱ Start: {events.startTime[3]}:{events.startTime[4]}0 IST - {events.endTime[3]}:
          {events.startTime[4]}0 IST
        </p>
        <p className="text-gray-500 mt-4 mb-4">You can now proceed to book tickets or view more details here.</p>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Book Now
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-gray-800 text-white p-6 rounded-xl w-full max-w-5xl shadow-2xl relative max-h-[90vh] overflow-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{events.eventDetails.title}</h2>
              <p className="text-gray-400 flex">
                🎭 {events.eventDetails.event_Type} | ⏱ {events.startTime[3]}:{events.startTime[4]}0 IST -{' '}
                {events.endTime[3]}:{events.startTime[4]}0 IST
              </p>
            </div>

            <div className="w-full text-center mb-6">
              <div className="bg-gray-500 h-2 w-[60%] mx-auto rounded-full mb-2" />
              <p className="uppercase text-sm text-gray-400 tracking-wider">Screen This Way</p>
            </div>

            <div className="w-full overflow-x-auto mb-6">
              {seatLayout.map((section, sectionIdx) => {
                const maxSeatsInRow = Math.max(...section);
                const seatSize = Math.min(40, Math.floor((0.8 * window.innerWidth) / maxSeatsInRow) - 8);
                const fontSize =
                  seatSize > 30 ? 'text-sm' : seatSize > 20 ? 'text-xs' : 'text-[10px]';

                const rowOffset = seatLayout
                  .slice(0, sectionIdx)
                  .reduce((acc, sec) => acc + sec.length, 0);

                return (
                  <div key={sectionIdx} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold">Section {sectionIdx + 1}</h3>
                      <span className="text-gray-300 text-sm">₹{sectionPrices[sectionIdx]}</span>
                    </div>

                    {section.map((seatCount, rowIdx) => {
                      const globalRowIdx = rowOffset + rowIdx;

                      return (
                        <div key={globalRowIdx} className="flex gap-2 mb-2 flex-wrap">
                          {Array.from({ length: seatCount }, (_, seatIdx) => {
                            const seatId = `S${sectionIdx}-R${globalRowIdx}-C${seatIdx}`;
                            const isSelected = selectedSeats.includes(seatId);
                            const isBooked = bookedSeats.includes(seatId);

                            return (
                              <button
                                key={seatId}
                                disabled={isBooked}
                                onClick={() => toggleSeat(sectionIdx, globalRowIdx, seatIdx)}
                                className={`rounded-md font-mono ${fontSize} ${
                                  isBooked
                                    ? 'bg-red-500 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-green-500'
                                    : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                                style={{
                                  width: `${seatSize}px`,
                                  height: `${seatSize}px`,
                                }}
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

            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={handleFinalBooking}
                className="bg-blue-600 rounded-md px-6 py-2 w-[250px] font-semibold text-white"
              >
                Pay ₹{finalprices}
              </button>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelectedSeats([]);
                }}
                className="bg-gray-700 rounded-md px-6 py-2 w-[250px] font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;
