
import { BASE_URL} from '../utils/config';
import api from '../utils/axiosInstance';

const BASE_BOOKING_URL = `${BASE_URL}/Bookings`;
const JWT_TOKEN = localStorage.getItem('token'); // Replace with actual token

export const postBooking = async ({ userId, showId, seats, finalPrice }) => {
  try {
    
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
    };
    // console.log("hi")
    const bookingBody = {
      userId,
      showId,
      seats: seats.map(seat => ({
        seatId: seat.seatId,      // e.g. S101-C12-R12
        seatPrice: seat.seatPrice // Only this and seatId required
      })),
      finalPrice,
    };
    console.log(bookingBody)

    const response = await api.post(`${BASE_BOOKING_URL}/publish/events-abc`, bookingBody, { headers });

    console.log('✅ Booking Published:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Error publishing booking:', error );
    throw error;
  }
};


export const getBookingStatus = async (userId, showId, firstSeat) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
    };
    const cleanUserId = userId
    const cleanShowId = showId.replace(/^0+/, '');
    const url = `${BASE_BOOKING_URL}/status/${cleanUserId}/${cleanShowId}/${firstSeat}`;
    
    console.log(url)
    const response = await api.get(url, { headers });

    console.log('✅ Booking Status:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching booking status:', error);
    throw error;
  }
};

export const fetchStripeCheckoutUrl = async (userId, showId, seatId) => {
  try {
    const cleanUserId = userId
    const cleanShowId = showId.replace(/^0+/, '');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
    };

    const url = `${BASE_URL}/payment-checkout/${cleanUserId}/${cleanShowId}/${seatId}`;
    console.log(url);

    const response = await api.get(url, {headers});

    // If backend returns plain text
    return response.data;

  } catch (error) {
    console.error("❌ Error fetching checkout URL:", error);
    return null;
  }
};

export const getSoldTicketsForShow = async (rawShowId) => {
  try {
    // Ensure showId is 3 digits with leading zeros, then prefix with 'S'
    const paddedShowId = 'S' + String(rawShowId).padStart(3, '0');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
    };

    const response = await api.get(`${BASE_URL}/Bookings/status/getbookedseatsstatus/${paddedShowId}` , {headers});
    
    console.log('Booked Seats Status:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error fetching booked seats status:', error);
    return null;
  }
};
