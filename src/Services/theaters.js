import { BASE_URL_EVENTS} from '../utils/config';
import axios from 'axios';
import { getEventById } from './homepage'

const URL = BASE_URL_EVENTS + '/events';
const showsurl = `http://localhost:8080/shows`;

// ✅ Hardcoded JWT Tokeney
const JWT_TOKEN = localStorage.getItem('token');

const headers = {
  Authorization: `Bearer ${JWT_TOKEN}`,
  'Content-Type': 'application/json',
};

// 🟩 Get all events
export const getAllTheaters = async () => {
  try {
    const response = await axios.get(`${BASE_URL_EVENTS}/auditoriums`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching all theaters:', error);
    throw error;
  }
};



export const getAllshowsByTheaterid = async (audid) => {
  try {
    const response = await fetch(`${showsurl}/auditorium/${audid}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    // Fetch event name for each show and attach it
    const dataWithEventNames = await Promise.all(
      data.map(async show => {
        try {
          const event = await getEventById(show.eventId);
          return {
            ...show,
            event: event, // attach event name
          };
        } catch (e) {
          console.error(`Failed to fetch event for eventId=${show.eventId}`, e);
          return {
            ...show,
            event: [], // fallback if fetch fails
          };
        }
      })
    );

    return dataWithEventNames;
  } catch (error) {
    console.error('Failed to fetch shows:', error);
    throw error;
  }
};




export const getShowById = async (id) => {
    try {
      const response = await axios.get(`${showsurl}/${id}`, { headers });
      const show = response.data;
  
      // Fetch event info for this show's eventId
      let event = null;
      try {
        event = await getEventById(show.eventId);
      } catch (e) {
        console.error(`Failed to fetch event for eventId=${show.eventId}`, e);
        event = { title: 'Unknown' };
      }
  
      // Fetch auditorium info for this show's auditoriumId
      let auditoriumInfo = null;
      try {
        const audResponse = await axios.get(`${BASE_URL_EVENTS}/auditoriums/${show.auditoriumId}`, { headers });
        auditoriumInfo = audResponse.data;
      } catch (e) {
        console.error(`Failed to fetch auditorium for auditoriumId=${show.auditoriumId}`, e);
        auditoriumInfo = null;
      }
  
      return {
        ...show,
        eventName: event.title,     // event title/name
        eventDetails: event,        // full event object if needed
        auditoriumInfo,             // auditorium info attached here
      };
    } catch (error) {
      console.error('Error fetching show by ID:', error);
      throw error;
    }
  };
  
