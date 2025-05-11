import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await axios.get(`${API_URL}/api/auth/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetched events:', response.data); // <-- inspect this
    const data = Array.isArray(response.data)
      ? response.data
      : response.data.events || [];
    setEvents(data);
  } catch (err) {
    console.error('Error fetching events:', err.response?.data || err.message);
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }
};

    fetchEvents();
  }, [API_URL, navigate]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `$eventhive-55x2.onrender.com/api/events`,
        {
          title: newEventName,
          description: newEventDescription,
          location: newEventLocation,
          date: newEventDate,
          checklist: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents([...events, response.data]);
      setNewEventName('');
      setNewEventDescription('');
      setNewEventLocation('');
      setNewEventDate('');
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleEventClick = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div>
      <h2>Your Events</h2>
      <form onSubmit={handleCreateEvent}>
        <input
          type="text"
          placeholder="Event Name"
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
          required
        />
        <textarea
          placeholder="Event Description"
          value={newEventDescription}
          onChange={(e) => setNewEventDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Event Location"
          value={newEventLocation}
          onChange={(e) => setNewEventLocation(e.target.value)}
          required
        />
        <input
          type="date"
          value={newEventDate}
          onChange={(e) => setNewEventDate(e.target.value)}
          required
        />
        <button type="submit">Create Event</button>
      </form>
      <ul>
        {events.map((event) => (
          <li key={event._id} onClick={() => handleEventClick(event._id)}>
            {event.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

