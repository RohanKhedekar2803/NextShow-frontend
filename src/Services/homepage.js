import { BASE_URL_EVENTS} from '../utils/config';
import axios from 'axios';

const URL = BASE_URL_EVENTS + '/events';


// ✅ Hardcoded JWT Token
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyb2hhbmtoZWRla2FyMjgwM0BnbWFpbC5jb20iLCJpYXQiOjE3NDY5Nzc4MDQsImV4cCI6MTc0Njk4MTQwNCwicm9sZXMiOlsiVVNFUiJdfQ.NDtI16TqFuSncLFaLKd2n011iO9tx_t2ws10Q-ldkGE';

const headers = {
  Authorization: `Bearer ${JWT_TOKEN}`,
  'Content-Type': 'application/json',
};

// 🟩 Get all events
export const getAllEvents = async () => {
  try {
    const response = await axios.get(URL, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

// 🟩 Get event by ID
export const getEventById = async (id) => {
  try {
    const response = await axios.get(`${URL}/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

// 🟩 Add a new event (POST)
export const addEvent = async (eventData) => {
  try {
    const response = await axios.post(URL, eventData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error adding new event:', error);
    throw error;
  }
};
