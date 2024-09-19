const mongoose = require('mongoose');

// Definiamo il modello Reminder con una struttura avanzata per i riferimenti temporali
const reminderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicine_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  time: [{
    hour: {
      type: Number,
      required: true,
      min: 0,
      max: 23
    },
    minute: {
      type: Number,
      required: true,
      min: 0,
      max: 59
    }
  }],

  // Specifica per giorni della settimana
  days_of_week: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  // Se la frequenza è settimanale o personalizzata, possiamo specificare quali settimane coprire
  week_pattern: {
    type: String,
    enum: ['all', 'even_weeks', 'odd_weeks'],
    default: 'all'
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  }
});

// Creiamo il modello e lo esportiamo
const Reminder = mongoose.model('Event', reminderSchema);
module.exports = Reminder;
