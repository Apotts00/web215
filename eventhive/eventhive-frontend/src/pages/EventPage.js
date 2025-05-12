import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [checklistItem, setChecklistItem] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://eventhive-55x2.onrender.com/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch event');
        }

        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err.message);
      }
    };

    fetchEvent();
  }, [id]);

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://eventhive-55x2.onrender.com/api/events/${id}/checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ item: checklistItem })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add checklist item');
      }

      setEvent((prevEvent) => ({
        ...prevEvent,
        checklist: [...prevEvent.checklist, { item: checklistItem, completed: false }]
      }));

      setChecklistItem('');
    } catch (err) {
      console.error('Error adding checklist item:', err.message);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h2>{event.title}</h2>
      <h3>Checklist</h3>
      <ul>
        {event.checklist.map((item, index) => (
          <li key={index}>
            {item.item} {item.completed && '✔️'}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={checklistItem}
        onChange={(e) => setChecklistItem(e.target.value)}
        placeholder="Add checklist item"
      />
      <button onClick={handleAddItem}>Add Item</button>
      <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
    </div>
  );
};

export default EventPage;
