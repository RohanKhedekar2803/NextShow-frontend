import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const dummyEvents = [
  {
    id: '1',
    title: 'Classical Music Night',
    type: 'Music',
    duration: '2h',
    photo: 'https://tse3.mm.bing.net/th?id=OIP.X8wgbccc9VJUgYRrBOU5PAHaEQ&pid=Api&P=0&h=180',
  },
  {
    id: '2',
    title: 'Shakespeare in Park',
    type: 'Drama',
    duration: '3h',
    photo: 'https://tse3.mm.bing.net/th?id=OIP.X8wgbccc9VJUgYRrBOU5PAHaEQ&pid=Api&P=0&h=180',
  },
  {
    id: '3',
    title: 'Indie Film Festival',
    type: 'Film',
    duration: '5h',
    photo: 'https://tse3.mm.bing.net/th?id=OIP.X8wgbccc9VJUgYRrBOU5PAHaEQ&pid=Api&P=0&h=180',
  },
];

const EventPage = () => {
  const { id } = useParams();
  const events = dummyEvents.find((e) => e.id === id);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const seatLayout = [
    [10, 10, 10],
    [10, 10, 10],
    [10, 10, 10]
  ];
  
  const toggleSeat = (sectionIdx, rowIdx, seatIdx) => {
    const seatId = `S${sectionIdx}-R${rowIdx}-C${seatIdx}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleFinalBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
  
    const formattedSeats = selectedSeats.map((seatId) => {
      const [s, section, r, row, c, col] = seatId.match(/\d+/g);
      return `C${col.padStart(3, '0')}-R${row.padStart(3, '0')}`;
    });
  
    console.log(`🎟️ Confirmed seats for "${events.title}":`, formattedSeats);
  
    // Calculate total price
    let totalPrice = 0;
    selectedSeats.forEach((seatId) => {
      const [s, sectionIdx] = seatId.match(/\d+/g);
      totalPrice += sectionPrices[sectionIdx]; // Add the price of the selected section
    });
  
    console.log(`Total Price for selected seats: ₹${totalPrice}`);
  
    setModalOpen(false);
    setSelectedSeats([]);
  };
  
  
  


  if (!events) {
    return (
      <div className="p-6 text-center text-white bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold">Event Not Found</h1>
        <p className="text-gray-400 mt-2">The event you're looking for does not exist.</p>
      </div>
    );
  }

  const sectionPrices = [200, 150, 100];

  
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <img
          src={events.photo}
          alt={events.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{events.title}</h1>
        <p className="text-gray-400 mb-1">🎭 Type: {events.type}</p>
        <p className="text-gray-400 mb-1">⏱ Duration: {events.duration}</p>
        <p className="text-gray-500 mt-4 mb-4">You can now proceed to book tickets or view more details here.</p>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Book Now
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
    <div className="bg-gray-800 text-white p-6 rounded-xl w-full max-w-5xl shadow-2xl relative max-h-[90vh] overflow-auto">
      
      {/* Top Event Info */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">{events.title}</h2>
        <p className="text-gray-400">🎭 {events.type} | ⏱ {events.duration}</p>
      </div>

      <div className="w-full text-center mb-6">
        <div className="bg-gray-500 h-2 w-[60%] mx-auto rounded-full mb-2" />
        <p className="uppercase text-sm text-gray-400 tracking-wider">Screen This Way</p>
    </div>

      {/* Seat Grid */}
<div className="w-full overflow-x-auto mb-6">
  {seatLayout.map((section, sectionIdx) => {
    const maxSeatsInRow = Math.max(...section);
    const seatSize = Math.min(40, Math.floor((0.8 * window.innerWidth) / maxSeatsInRow) - 8);
    const fontSize = seatSize > 30 ? 'text-sm' : seatSize > 20 ? 'text-xs' : 'text-[10px]';

    return (
      <div key={sectionIdx} className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-bold">Section {sectionIdx + 1}</h3>
          <span className="text-gray-300 text-sm">₹{sectionPrices[sectionIdx]}</span>
        </div>

        {section.map((seatCount, rowIdx) => (
          <div key={rowIdx} className="flex gap-2 mb-2 flex-wrap">
            {Array.from({ length: seatCount }, (_, seatIdx) => {
              const seatId = `S${sectionIdx}-R${rowIdx}-C${seatIdx}`;
              const isSelected = selectedSeats.includes(seatId);
              return (
                <button
                  key={seatId}
                  onClick={() => toggleSeat(sectionIdx, rowIdx, seatIdx)}
                  className={`rounded-md font-mono ${fontSize} ${isSelected ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'}`}
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
        ))}
      </div>
    );
  })}
</div>


      {/* Footer Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setModalOpen(false)}
          className="text-red-400 hover:underline"
        >
          Cancel
        </button>
        <button
          onClick={handleFinalBooking}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          Confirm Booking ({selectedSeats.length})
        </button>
      </div>

      {/* Close Icon */}
      <button
        onClick={() => setModalOpen(false)}
        className="absolute top-2 right-3 text-gray-400 text-xl hover:text-white"
      >
        &times;
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default EventPage;
