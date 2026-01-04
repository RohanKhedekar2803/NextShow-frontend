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
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-2">🎉 Payment Successful!</h1>
        <p className="text-gray-700 mb-6">Thank you for your booking. Your payment has been processed successfully.</p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">🎟️ Booking Details:</h3>

          <p><span className="font-medium">Show:</span> {eventName}</p>  
          <p><span className="font-medium">Seat(s):</span> {seatId}</p>
          <p><span className="font-medium">User:</span> { localStorage.getItem('username')}</p>

          <p><span className="font-medium">Start Time:</span> {formatCustomDate(start)}</p>
          <p><span className="font-medium">Location :</span> {theatername}</p>
        </div>

        <p className="mb-4">📨 A confirmation email with your booking details has been sent. Please check your inbox!</p>
        <p className="mb-6">We hope you enjoy the show. 🎬🍿</p>

        <button
          onClick={handleBackClick}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          🔙 Back to Theater Page
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
