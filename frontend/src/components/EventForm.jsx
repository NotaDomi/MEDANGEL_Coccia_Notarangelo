import React, { useState, useEffect } from "react"
import axios from "axios"

export default function EventForm({
  loggedUser,
  selectedEvent,
  setEvents,
  setClick,
}) {
  const [formData, setFormData] = useState({
    user_id: loggedUser._id,
    medicine_name: "",
    description: "",
    time: "",
    days_of_week: [],
    week_pattern: "all",
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    if (selectedEvent) {
      // Se l'evento ha una data di inizio o di fine, formattala in "YYYY-MM-DD"
      const formattedStartDate = selectedEvent.start_date
        ? new Date(selectedEvent.start_date).toISOString().split("T")[0]
        : ""
      const formattedEndDate = selectedEvent.end_date
        ? new Date(selectedEvent.end_date).toISOString().split("T")[0]
        : ""

      setFormData({
        ...selectedEvent,
        start_date: formattedStartDate, // Assegna la data formattata
        end_date: formattedEndDate, // Assegna la data formattata
        time:
          selectedEvent.time.length > 0
            ? `${selectedEvent.time[0].hour
                .toString()
                .padStart(2, "0")}:${selectedEvent.time[0].minute
                .toString()
                .padStart(2, "0")}`
            : "",
      })
    } else {
      // Imposta un nuovo form vuoto se selectedEvent è nullo
      setFormData({
        user_id: loggedUser._id,
        medicine_name: "",
        description: "",
        time: "",
        days_of_week: [],
        week_pattern: "all",
        start_date: "",
        end_date: "",
      })
    }
  }, [selectedEvent, loggedUser._id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleTimeChange = (e) => {
    setFormData({
      ...formData,
      time: e.target.value,
    })
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target
    const updatedDays = checked
      ? [...formData.days_of_week, value]
      : formData.days_of_week.filter((day) => day !== value)

    setFormData({
      ...formData,
      days_of_week: updatedDays,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const [hour, minute] = formData.time.split(":")
    const eventData = {
      ...formData,
      time: formData.time
        ? [{ hour: parseInt(hour), minute: parseInt(minute) }]
        : [], // Ensure time is an array of objects
    }
    if (selectedEvent) {
      axios
        .put(`/api/calendar/events/${selectedEvent._id}`, eventData)
        .then((res) => {
          setEvents((prev) =>
            prev.map((ev) =>
              ev._id === res.data.event._id ? res.data.event : ev
            )
          )
          setClick(false)
        })
        .catch((error) => alert(error.response.data.message))
    } else {
      axios
        .post("/api/calendar/events", eventData)
        .then((res) => {
          setEvents((prev) => [...prev, res.data.event])
          setClick(false)
        })
        .catch((error) => alert(error.response.data.message))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Nome del farmaco */}
      <div className="form-group" id="name">
        <label htmlFor="medicine_name">Nome del farmaco:</label>
        <input
          type="text"
          id="medicine_name"
          name="medicine_name"
          value={formData.medicine_name}
          onChange={handleInputChange}
          placeholder="Inserisci il nome del farmaco"
          required
        />
      </div>

      {/* Descrizione */}
      <div className="form-group" id="description">
        <label htmlFor="description">Descrizione:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Inserisci la descrizione"
          cols={40}
        />
      </div>

      {/* Orario */}
      <div className="form-group" id="time">
        <label htmlFor="time">Orario:</label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleTimeChange}
          required
        />
      </div>

      {/* Giorni della settimana */}
      <div className="form-group" id="days">
        <label>Giorni della settimana:</label>
        <div className="checkbox-group">
          {[
            { value: "Monday", label: "LUN" },
            { value: "Tuesday", label: "MAR" },
            { value: "Wednesday", label: "MER" },
            { value: "Thursday", label: "GIO" },
            { value: "Friday", label: "VEN" },
            { value: "Saturday", label: "SAB" },
            { value: "Sunday", label: "DOM" },
          ].map((day) => (
            <div key={day.value} className="checkbox-container">
              <input
                type="checkbox"
                id={day.value}
                name="days_of_week"
                value={day.value}
                checked={formData.days_of_week.includes(day.value)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={day.value}>{day.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern settimanale */}
      <div className="form-group" id="week_pattern">
        <label htmlFor="week_pattern">Frequenza:</label>
        <div className="week_pattern1">
          <select
            id="week_pattern"
            name="week_pattern"
            value={formData.week_pattern}
            onChange={handleInputChange}
            required
          >
            <option value="all">Tutte le settimane</option>
            <option value="even_weeks">Settimane pari</option>
            <option value="odd_weeks">Settimane dispari</option>
          </select>
        </div>
      </div>

      {/* Data di inizio */}
      <div className="form-group" id="start_date">
        <label htmlFor="start_date">Data di inizio:</label>
        <input
          type="date"
          id="start_date"
          name="start_date"
          value={formData.start_date}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Data di fine */}
      <div className="form-group" id="end_date">
        <label htmlFor="end_date">Data di fine:</label>
        <input
          type="date"
          id="end_date"
          name="end_date"
          value={formData.end_date}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Pulsanti di controllo */}
      <div className="form-group" id="buttons">
        <button type="submit">Salva Evento</button>
        <button type="button" onClick={() => setClick(false)}>
          Annulla
        </button>
      </div>
    </form>
  )
}
