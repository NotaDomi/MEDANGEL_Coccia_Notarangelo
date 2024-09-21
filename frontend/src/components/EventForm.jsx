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
    time1: "", // Orario 1
    time2: "", // Orario 2
    time3: "", // Orario 3
    days_of_week: [],
    week_pattern: "all",
    start_date: "",
    end_date: "",
  })

  const [showTime2, setShowTime2] = useState(false) // Stato per attivare/disattivare time2
  const [showTime3, setShowTime3] = useState(false) // Stato per attivare/disattivare time3

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
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        days_of_week: Array.isArray(selectedEvent.days_of_week)
          ? selectedEvent.days_of_week
          : [],
        time1:
          selectedEvent.time.length > 0
            ? `${selectedEvent.time[0].hour
                .toString()
                .padStart(2, "0")}:${selectedEvent.time[0].minute
                .toString()
                .padStart(2, "0")}`
            : "",
        time2:
          selectedEvent.time.length > 1
            ? `${selectedEvent.time[1].hour
                .toString()
                .padStart(2, "0")}:${selectedEvent.time[1].minute
                .toString()
                .padStart(2, "0")}`
            : "",
        time3:
          selectedEvent.time.length > 2
            ? `${selectedEvent.time[2].hour
                .toString()
                .padStart(2, "0")}:${selectedEvent.time[2].minute
                .toString()
                .padStart(2, "0")}`
            : "",
      })

      selectedEvent.days_of_week.forEach((day) => {
        const checkbox = document.getElementById(day)
        if (checkbox) {
          const label = checkbox.nextElementSibling
          if (label) {
            label.style.backgroundColor = "rgba(20, 156, 156, 0.792)"
            label.style.color = "white"
          }
        }
      })

      // Attiviamo i campi time2 e time3 solo se hanno un valore
      setShowTime2(selectedEvent.time.length > 1)
      setShowTime3(selectedEvent.time.length > 2)
    } else {
      // Imposta un nuovo form vuoto se selectedEvent è nullo
      setFormData({
        user_id: loggedUser._id,
        medicine_name: "",
        description: "",
        time1: "",
        time2: "",
        time3: "",
        days_of_week: [],
        week_pattern: "all",
        start_date: "",
        end_date: "",
      })

      const allDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]
      allDays.forEach((day) => {
        const checkbox = document.getElementById(day)
        if (checkbox) {
          const label = checkbox.nextElementSibling
          if (label) {
            label.style.backgroundColor = "" // Ripristina lo sfondo
            label.style.color = "" // Ripristina il colore del testo
          }
        }
      })

      setShowTime2(false) // Disattivato per default
      setShowTime3(false) // Disattivato per default
    }
  }, [selectedEvent, loggedUser._id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
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

    const label = e.target.nextElementSibling
    label.style.backgroundColor = checked ? "rgba(20, 156, 156, 0.792)" : ""
    label.style.color = checked ? "white" : ""
    label.style.cursor = "pointer"
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const times = []
    if (formData.time1) {
      const [hour1, minute1] = formData.time1.split(":")
      times.push({ hour: parseInt(hour1), minute: parseInt(minute1) })
    }
    if (showTime2 && formData.time2) {
      const [hour2, minute2] = formData.time2.split(":")
      times.push({ hour: parseInt(hour2), minute: parseInt(minute2) })
    }
    if (showTime3 && formData.time3) {
      const [hour3, minute3] = formData.time3.split(":")
      times.push({ hour: parseInt(hour3), minute: parseInt(minute3) })
    }

    const eventData = {
      ...formData,
      time: times, // Invia solo i campi attivi
    }
    if (selectedEvent) {
      axios
        .put(`/v1/api/calendar/events/${selectedEvent._id}`, eventData)
        .then((res) => {
          setEvents((prev) =>
            prev.map((ev) =>
              ev._id === res.data.event._id ? res.data.event : ev
            )
          )
          setClick(false)
        })
        .catch((error) => console.log(error.response.data.message))
    } else {
      axios
        .post("/v1/api/calendar/events", eventData)
        .then((res) => {
          setEvents((prev) => [...prev, res.data.event])
          setClick(false)
        })
        .catch((error) => console.log(error.response.data.message))
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

      <div className="form-group" id="times">
        {/* Orario 1 */}
        <div className="form-group" id="time1">
          <label htmlFor="time1">Orario:</label>
          <input
            type="time"
            id="time1"
            name="time1"
            value={formData.time1}
            onChange={handleInputChange}
          />
        </div>

        {/* Attiva/disattiva Orario 2 */}
        <div className="form-group" id="time2">
          <input
            type="checkbox"
            checked={showTime2}
            onChange={() => setShowTime2(!showTime2)}
          />
          <label
            htmlFor="time2"
            style={{ color: showTime2 ? "black" : "lightgray" }}
          >
            Orario 2:
          </label>
          <input
            type="time"
            id="time2"
            name="time2"
            value={formData.time2}
            onChange={handleInputChange}
            disabled={!showTime2} // Disabilitato se il checkbox non è selezionato
            style={{
              backgroundColor: showTime2 ? "white" : "lightgray",
            }}
          />
        </div>

        <div className="form-group" id="time3">
          <input
            type="checkbox"
            checked={showTime3}
            onChange={() => setShowTime3(!showTime3)}
          />
          <label
            htmlFor="time3"
            style={{ color: showTime3 ? "black" : "lightgray" }}
          >
            Orario 3:
          </label>
          <input
            type="time"
            id="time3"
            name="time3"
            value={formData.time3}
            onChange={handleInputChange}
            disabled={!showTime3} // Disabilitato se il checkbox non è selezionato
            style={{
              backgroundColor: showTime3 ? "white" : "lightgray",
            }}
          />
        </div>
      </div>

      {/* Giorni della settimana */}
      <div className="form-group" id="days">
        <label>Giorni della settimana:</label>
        <div className="checkbox-group">
          {[
            { value: "Monday", label: "L" },
            { value: "Tuesday", label: "M" },
            { value: "Wednesday", label: "M" },
            { value: "Thursday", label: "G" },
            { value: "Friday", label: "V" },
            { value: "Saturday", label: "S" },
            { value: "Sunday", label: "D" },
          ].map((day) => (
            <div key={day.value} className="checkbox-container">
              <input
                type="checkbox"
                id={day.value}
                name="days_of_week"
                value={day.value}
                checked={
                  Array.isArray(formData.days_of_week) &&
                  formData.days_of_week.includes(day.value)
                }
                onChange={handleCheckboxChange}
              />
              <label htmlFor={day.value}>{day.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group" id="frequency-dates">
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
