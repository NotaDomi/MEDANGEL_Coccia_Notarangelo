const express = require('express');
const calendarController = require('../controllers/calendar');

const router = express.Router();

router.post('/events', calendarController.createEvent);

router.post('/getEvents', calendarController.getEvents);

router.post('/getRecurringEvents', calendarController.getRecurringEvents);

router.get('/events/:eventId', calendarController.getEvent);

router.put('/events/:eventId', calendarController.updateEvent);

router.delete('/events/:eventId', calendarController.deleteEvent);

module.exports = router;
