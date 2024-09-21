const moment = require('moment');

// Funzione per calcolare le date ricorrenti
function calculateRecurringEvents(event) {
  const _id = event._id;
  const events = [];
  const startDate = moment(event.start_date);
  const endDate = event.end_date ? moment(event.end_date) : null;
  const weekPattern = event.week_pattern || 'all';
  const daysOfWeek = event.days_of_week || [];
  const times = event.time || [];

  let currentDate = startDate.clone();

  // Funzione per formattare correttamente le ore e i minuti
  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  // Loop attraverso le date dal start_date fino a end_date
  while (!endDate || currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    const currentDayOfWeek = currentDate.format('dddd');
    const weekNumber = currentDate.isoWeek(); // Ottieni il numero della settimana ISO

    // Verifica se il giorno corrente è tra i giorni della settimana specificati
    if (daysOfWeek.includes(currentDayOfWeek)) {
      // Controlla il pattern settimanale (tutte le settimane, settimane pari, settimane dispari)
      if (
        weekPattern === 'all' || 
        (weekPattern === 'even_weeks' && weekNumber % 2 === 0) || 
        (weekPattern === 'odd_weeks' && weekNumber % 2 !== 0)
      ) {
        // Aggiungi un evento per ogni orario specificato
        times.forEach(time => {
          events.push({
            _id: _id + '-' + time._id + currentDate.format('YYYY-MM-DD'),
            date: currentDate.format('YYYY-MM-DD'),
            time: formatTime(time.hour, time.minute),
            medicine_name: event.medicine_name,
            description: event.description
          });
        });
      }
    }

    currentDate.add(1, 'days'); // Avanza di un giorno per le ricorrenze settimanali
  }

  return events;
}



const Event = require('../models/event'); // Assumendo che il modello Event sia definito in models/Event.js

module.exports = {
  createEvent: (req, res) => {
    const { user_id, medicine_name, description, time, frequency, days_of_week, week_pattern, start_date, end_date } = req.body;

    const newEvent = new Event({ user_id, medicine_name, description, time, frequency, days_of_week, week_pattern, start_date, end_date});

    newEvent.save()
      .then(event => res.status(201).json({ message: 'Evento creato con successo', event }))
      .catch(error => {
        console.error('Errore nella creazione dell\'evento:', error);
        res.status(500).json({ message: 'Errore interno al server' });
      });
  },

  getEvents: (req, res) => {
    const { user_id } = req.body;
    
    Event.find({ user_id: user_id })
    .then(events => res.json(events))
    .catch(error => {
      console.error('Errore nel recupero degli eventi:', error);
      res.status(500).json({ message: 'Errore interno al server' });
    });
  },

  getRecurringEvents: (req, res) => {
    const { user_id } = req.body;

    Event.find({ user_id: user_id })
      .then(events => {
        let allRecurringEvents = [];

        events.forEach(event => {
          const recurringEvents = calculateRecurringEvents(event);
          allRecurringEvents = allRecurringEvents.concat(recurringEvents);
        });

        res.json(allRecurringEvents);  // Restituisci tutti gli eventi ricorrenti
      })
      .catch(error => {
        console.error('Errore nel recupero degli eventi:', error);
        res.status(500).json({ message: 'Errore interno al server' });
      });
  },

  getEvent: (req, res) => {
    const { eventId } = req.params;

    Event.findById(eventId)
      .then(event => {
        if (!event) {
          return res.status(404).json({ message: 'Evento non trovato' });
        }
        res.json(event);
      })
      .catch(error => {
        console.error('Errore nel recupero dell\'evento:', error);
        res.status(500).json({ message: 'Errore interno al server' });
      });
  },

  updateEvent: (req, res) => {
    const { eventId } = req.params;
    const { medicine_name, description, time, frequency, days_of_week, week_pattern, start_date, end_date } = req.body;

    Event.findByIdAndUpdate(eventId, { medicine_name, description, time, frequency, days_of_week, week_pattern, start_date, end_date }, { new: true })
      .then(event => {
        if (!event) {
          return res.status(404).json({ message: 'Evento non trovato' });
        }
        res.json({ message: 'Evento aggiornato con successo', event });
      })
      .catch(error => {
        console.error('Errore nell\'aggiornamento dell\'evento:', error);
        res.status(500).json({ message: 'Errore interno al server' });
      });
  },

  deleteEvent: (req, res) => {
    const { eventId } = req.params;

    Event.findByIdAndDelete(eventId)
      .then(event => {
        if (!event) {
          return res.status(404).json({ message: 'Evento non trovato' });
        }
        res.json({ message: 'Evento eliminato con successo' });
      })
      .catch(error => {
        console.error('Errore nell\'eliminazione dell\'evento:', error);
        res.status(500).json({ message: 'Errore interno al server' });
      });
  }
};
