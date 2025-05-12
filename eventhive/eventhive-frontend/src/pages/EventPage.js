import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Dashboard.css';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editedEvent, setEditedEvent] = useState({ title: '', description: '', location: '', date: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://eventhive-55x2.onrender.com/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        console.log('Fetched events from API:', data);
        if (!response.ok) throw new Error(data.message || 'Failed to fetch events');

        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err.message);
        navigate('/login');
      }
    };

    fetchEvents();
  }, [navigate]);

  const startEditing = (event) => {
    setEditingEventId(event._id);
    setEditedEvent({
      title: event.title,
      description: event.description,
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
      setSuccessMessage('Event updated successfully!');
      setTimeout(() => setSuccessMessage(''), 2000);
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
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete event');
      setEvents(events.filter(ev => ev._id !== id));
      setSuccessMessage('Event deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  return (
    <div>
      <h2>Your Events</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <button className="back-button" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      <table className="event-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event._id}>
              {editingEventId === event._id ? (
                <>
                  <td><input type="text" value={editedEvent.title} onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })} /></td>
                  <td><textarea value={editedEvent.description} onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })} /></td>
                  <td><input type="date" value={editedEvent.date} onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })} /></td>
                  <td>
                    <button onClick={(e) => handleUpdateEvent(e, event._id)}>Save</button>
                    <button onClick={() => setEditingEventId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => startEditing(event)}>Edit</button>
                    <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventPage;

