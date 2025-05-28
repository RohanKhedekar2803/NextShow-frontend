import { BASE_URL_EVENTS} from '../utils/config';
import axios from 'axios';

const URL = BASE_URL_EVENTS + '/events';


// ✅ Hardcoded JWT Tokeney
const JWT_TOKEN = localStorage.getItem('token');

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

export const getAllshows = async (eventData) => {
  try {
    const response = await axios.get('http://localhost:8080/shows', { headers });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error adding new event:', error);
    throw error;
  }
};

export const getshowByAuditoriumId = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8080/eventsAPI/auditoriums/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};