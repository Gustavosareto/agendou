const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available slots for a date and service
router.get('/available-slots', async (req, res) => {
  const { date, serviceId } = req.query;
  if (!date || !serviceId) {
    return res.status(400).json({ error: 'Date and serviceId are required' });
  }

  try {
    // Mock available slots - in real app, this would check business hours and existing appointments
    const slots = [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true }
    ];

    // Check existing appointments for this date
    const existingAppointments = await Appointment.find({
      date,
      status: { $ne: 'CANCELLED' }
    });

    const bookedTimes = existingAppointments.map(apt => apt.startTime);

    const availableSlots = slots.filter(slot => !bookedTimes.includes(slot.time));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create appointment
router.post('/', [
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('clientName').trim().isLength({ min: 1 }).withMessage('Client name is required'),
  body('clientPhone').isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if slot is still available
    const existing = await Appointment.findOne({
      date: req.body.date,
      startTime: req.body.startTime,
      status: { $ne: 'CANCELLED' }
    });

    if (existing) {
      return res.status(409).json({ error: 'Time slot already booked' });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;