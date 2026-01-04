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
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-2">❌ Payment Failed</h1>
        <p className="text-gray-700 mb-6">Oops! Something went wrong while processing your payment.</p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="font-medium text-red-500">Your booking could not be completed at this time.</p>
        </div>

        <p className="mb-4">Please try again later or contact support if the issue persists.</p>
        <p className="mb-6">We’re here to help. 💬</p>

        <button
          onClick={handleBackClick}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          🔙 Back to Theater Page
        </button>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
