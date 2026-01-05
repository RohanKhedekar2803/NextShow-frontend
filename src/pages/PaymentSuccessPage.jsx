import React, { useEffect , useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getShowById } from '@/Services/theaters';
import { BASE_URL} from '../utils/config';

const PaymentSuccessPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [theatername, setTheatername] = useState('');
  const [start, setStart] = useState(null); // null initially

  const userId = query.get('userId');
  const showId = query.get('showId');
  const seatId = query.get('seatId');

  const makeUpdateBookedCall = async () => {
    try {
      const JWT_TOKEN = localStorage.getItem('token');
      await axios.get(
        `${BASE_URL}/Bookings/status/updatebooked`,
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
          params: {
            userId: userId,
            showId: showId,
            seats: seatId.replace(/[\[\]]/g, '')
          },
        }
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  async function getshowinfo(showId) {
    try {
      const data = await getShowById(showId);
      setEventName(data.eventName);
      setTheatername(data.auditoriumInfo.name + ",  "+ data.auditoriumInfo.location +",  "+ data.auditoriumInfo.city);

      // Check the format of data.startTime here
      // Example: if startTime is ISO string, convert to array
      if (Array.isArray(data.startTime)) {
        setStart(data.startTime);
      } else if (typeof data.startTime === 'string') {
        // Example parse string "2025-05-28T14:30:00Z"
        const dt = new Date(data.startTime);
        setStart([
          dt.getFullYear(),
          dt.getMonth() + 1,
          dt.getDate(),
          dt.getHours(),
          dt.getMinutes()
        ]);
      } else {
        setStart(null);
      }

      console.log(data);
    } catch (error) {
      console.error("Error fetching show info:", error);
    }
  }

  useEffect(() => {
    if (userId && showId && seatId) {
      makeUpdateBookedCall();
      getshowinfo(showId);
    }
  }, [userId, showId, seatId]);

  const handleBackClick = () => {
    makeUpdateBookedCall();
    navigate('/theaterpage');
  };

  const formatCustomDate = (dateArr) => {
    if (!Array.isArray(dateArr) || dateArr.length < 5) return '';

    const [year, month, day, hour, minute] = dateArr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const pad = (num) => String(num).padStart(2, '0');
    const monthName = months[month - 1];
    return `${pad(day)} ${monthName} ${year} ${pad(hour)}:${pad(minute)} IST`;
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black p-6">
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border border-white/10">
      
      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400 mb-2">
        🎉 Payment Successful!
      </h1>

      <p className="text-gray-300 mb-6">
        Thank you for your booking. Your payment has been processed successfully.
      </p>

      {/* Booking details */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10 text-left">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">
          🎟️ Booking Details
        </h3>

        <p className="text-gray-300">
          <span className="font-medium text-white">Show:</span> {eventName}
        </p>
        <p className="text-gray-300">
          <span className="font-medium text-white">Seat(s):</span> {seatId}
        </p>
        <p className="text-gray-300">
          <span className="font-medium text-white">User:</span>{" "}
          {localStorage.getItem("username")}
        </p>
        <p className="text-gray-300">
          <span className="font-medium text-white">Start Time:</span>{" "}
          {formatCustomDate(start)}
        </p>
        <p className="text-gray-300">
          <span className="font-medium text-white">Location:</span>{" "}
          {theatername}
        </p>
      </div>

      <p className="text-gray-400 mb-2">
        📨 A confirmation email with your booking details has been sent.
      </p>
      <p className="text-gray-400 mb-6">
        We hope you enjoy the show 🎬🍿
      </p>

      {/* Action */}
      <button
        onClick={handleBackClick}
        className="
          bg-gradient-to-r from-purple-600 to-purple-700
          hover:from-purple-500 hover:to-purple-600
          text-white font-bold
          py-3 px-6
          rounded-xl
          transition-all duration-200
          shadow-lg shadow-purple-500/30
          hover:shadow-xl hover:shadow-purple-500/40
          hover:scale-105 active:scale-95
        "
      >
        🔙 Back to Theater Page
      </button>
    </div>
  </div>
);

};

export default PaymentSuccessPage;
