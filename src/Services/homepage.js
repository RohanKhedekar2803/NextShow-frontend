import { BASE_URL} from '../utils/config';
import api from '../utils/axiosInstance';

const URL = `${BASE_URL}/eventsAPI/events`;


// ✅ Hardcoded JWT Tokeney
const JWT_TOKEN = localStorage.getItem('token');

const headers = {
  Authorization: `Bearer ${JWT_TOKEN}`,
  'Content-Type': 'application/json',
};

// 🟩 Get all events
export const getAllEvents = async () => {
  try {
    const response = await api.get(URL, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

// 🟩 Get event by ID
export const getEventById = async (id) => {
  try {
    const response = await api.get(`${URL}/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

// 🟩 Add a new event (POST)
export const addEvent = async (eventData) => {
  try {
    const response = await api.post(URL, eventData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error adding new event:', error);
    throw error;
  }
};

export const getAllshows = async (eventData) => {
  try {
    const response = await api.get(`${BASE_URL}/shows`, { headers });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error adding new event:', error);
    throw error;
  }
};

export const getshowByAuditoriumId = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/eventsAPI/auditoriums/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};