import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [checklistItem, setChecklistItem] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`eventhive-55x2.onrender.com/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvent(response.data);
      } catch (err) {
        console.error(err?.response?.data || err.message);
      }
    };
    fetchEvent();
  }, [id]);

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/events/${id}/checklist`,
        { item: checklistItem },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvent((prevEvent) => ({
        ...prevEvent,
        checklist: [...prevEvent.checklist, { item: checklistItem, completed: false }]
      }));
      setChecklistItem('');
    } catch (err) {
      console.error(err?.response?.data || err.message);
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
    </div>
  );
};

export default EventPage;
