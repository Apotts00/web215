import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://eventhive-55x2.onrender.com/api/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 400 || response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const result = await response.json();
        const data = Array.isArray(result) ? result : result.events || [];
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err.message);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchEvents();
  }, [navigate]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://eventhive-55x2.onrender.com/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newEventName,
          description: newEventDescription,
          location: newEventLocation,
          date: newEventDate,
          checklist: []
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to create event');

      setEvents([...events, data]);
      setNewEventName('');
      setNewEventDescription('');
      setNewEventLocation('');
      setNewEventDate('');
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEventClick = (id) => {
    navigate(`/event/${id}`);
  };

  const startEditing = (event) => {
    setEditingEventId(event._id);
    setEditedTitle(event.title);
  };

  const handleUpdateEvent = async (e, id) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://eventhive-55x2.onrender.com/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: editedTitle })
      });

      const updated = await response.json();
      if (!response.ok) throw new Error(updated.msg || 'Failed to update event');

      setEvents(events.map(ev => (ev._id === id ? { ...ev, title: updated.title } : ev)));
      setEditingEventId(null);
    } catch (err) {
      console.error('Edit failed:', err.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://eventhive-55x2.onrender.com/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete event');

      setEvents(events.filter(ev => ev._id !== id));
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
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
        {events.map((event, index) => (
          <li key={event._id || index}>
            {editingEventId === event._id ? (
              <form onSubmit={(e) => handleUpdateEvent(e, event._id)}>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingEventId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <span onClick={() => handleEventClick(event._id)}>{event.title}</span>
                <button onClick={() => startEditing(event)}>Edit</button>
                <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;


