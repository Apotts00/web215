import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Header from '../components/Header';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editedEvent, setEditedEvent] = useState({ title: '', description: '', location: '', date: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
  setIsLoading(true); // ⏳ Start loading
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

    setSuccessMessage('Event created successfully!');
    setTimeout(() => {
      setSuccessMessage('');
      navigate(`/event/${data._id}`);
    }, 1500);

    setNewEventName('');
    setNewEventDescription('');
    setNewEventLocation('');
    setNewEventDate('');
  } catch (err) {
    console.error(err.message);
  } finally {
    setIsLoading(false); // ✅ Stop loading
  }
};



  const handleEventClick = (id) => {
    navigate(`/event/${id}`);
  };

  const startEditing = (event) => {
    setEditingEventId(event._id);
    setEditedEvent({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.slice(0, 10)
    });
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
        body: JSON.stringify(editedEvent)
      });

      const updated = await response.json();
      if (!response.ok) throw new Error(updated.msg || 'Failed to update event');

      setEvents(events.map(ev => (ev._id === id ? updated : ev)));
      setEditingEventId(null);
    } catch (err) {
      console.error('Edit failed:', err.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
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
    <h2>Create a New Event</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
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
    </div>
  );
};

export default Dashboard;


