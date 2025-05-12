import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import './Dashboard.css';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://eventhive-55x2.onrender.com/api/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch events');

        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err.message);
        navigate('/login');
      }
    };

    fetchEvents();
  }, [navigate]);

  return (
    <div>
      <Header />
      <h2>All Events</h2>
      <table className="event-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Location</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>
                <Link to={`/event/${event._id}`} className="event-link">
                  {event.title}
                </Link>
              </td>
              <td>{event.description}</td>
              <td>{event.location}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventPage;
