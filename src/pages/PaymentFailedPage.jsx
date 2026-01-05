import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL} from '../utils/config';

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const userId = query.get('userId');
  const showId = query.get('showId');
  const seatId = query.get('seatId');

  const makeUpdateCancelCall = async () => {
    try {
      const JWT_TOKEN = localStorage.getItem('token');
      await axios.get(
        `${BASE_URL}/Bookings/status/updatecancel`,
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
          params: {
            userId: userId,
            showId: showId,
            seats: seatId.replace(/[\[\]]/g, ''), 
          },
        }
      );
    } catch (error) {
      console.error('Error updating cancel status:', error);
    }
  };

  useEffect(() => {
    if (userId && showId && seatId) {
      makeUpdateCancelCall();
    }
  }, [userId, showId, seatId]);

  const handleBackClick = () => {
    makeUpdateCancelCall();
    navigate('/theaterpage');
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black p-6">
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border border-white/10">

      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400 mb-2">
        ❌ Payment Failed
      </h1>

      <p className="text-gray-300 mb-6">
        Oops! Something went wrong while processing your payment.
      </p>

      {/* Info box */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10 text-left">
        <p className="text-red-400 font-medium">
          Your booking could not be completed at this time.
        </p>
        <p className="text-gray-400 mt-2">
          No amount was deducted. Please try again or choose different seats.
        </p>
      </div>

      <p className="text-gray-400 mb-2">
        If the issue persists, please contact support.
      </p>
      <p className="text-gray-400 mb-6">
        We’re here to help 💬
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

export default PaymentFailedPage;
