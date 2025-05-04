import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={() => history.push('/events/new')}>Create New Event</button>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <a href={`/events/${event._id}`}>{event.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
