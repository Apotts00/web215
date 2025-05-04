import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventPage = ({ match }) => {
  const { id } = match.params;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(response.data);
      } catch (err) {
        console.error('Error fetching event', err);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h2>{event.title}</h2>
      <ul>
        {event.checklist.map((item) => (
          <li key={item._id}>{item.name} - {item.completed ? 'Completed' : 'Pending'}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventPage;
