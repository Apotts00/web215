const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

router.get('/:id', authMiddleware, async (req, res) => {
  // 🧪 Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
  } catch (err) {
    console.error('❌ Error fetching event:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST create new event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, date, checklist } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      checklist,
      user: req.user.id,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single event by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add checklist item
router.post('/:id/checklist', authMiddleware, async (req, res) => {
  try {
    const { item } = req.body;
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id });

    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.checklist.push({ item, completed: false });
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (err) {
    console.error('Error updating event:', err.message);
    res.status(500).json({ msg: 'Server error while updating event' });
  }
});

// Delete event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(500).json({ msg: 'Server error while deleting event' });
  }
});


module.exports = router;
