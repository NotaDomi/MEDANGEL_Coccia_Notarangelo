import React, { useState, useEffect } from "react"
import Calendar from "react-calendar"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome" // Assumendo che tu stia usando FontAwesome
import { faMedkit, faClock } from "@fortawesome/free-solid-svg-icons" // Nuova icona più estetica
import "moment/locale/it"

export default function CalendarWithEvents({ allEvents }) {
  moment.locale("it")
  // Imposta la data corrente come valore di default
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([])

  // Funzione per verificare se l'evento è esattamente nella data specifica
  const isEventOnDate = (date, event) => {
    const eventDate = moment(event.date).format("YYYY-MM-DD")
    const selectedFormattedDate = moment(date).format("YYYY-MM-DD")
    return eventDate === selectedFormattedDate // Verifica se la data è la stessa
  }

  // Quando si seleziona una data nel calendario
  const onDateClick = (date) => {
    setSelectedDate(date)
    // Filtra gli eventi che si verificano nella data selezionata
    const eventsOnThatDate = allEvents.filter((event) =>
      isEventOnDate(date, event)
    )
    setEventsForSelectedDate(eventsOnThatDate)
  }

  // Funzione per ottenere i giorni con eventi
  const getDaysWithEvents = () => {
    const daysWithEvents = new Set()
    allEvents.forEach((event) => {
      const eventDate = moment(event.date).format("YYYY-MM-DD")
      daysWithEvents.add(eventDate)
    })
    return daysWithEvents
  }

  const daysWithEvents = getDaysWithEvents()

  // Funzione per personalizzare il contenuto delle celle del calendario
  const tileContent = ({ date }) => {
    const formattedDate = moment(date).format("YYYY-MM-DD")
    return daysWithEvents.has(formattedDate) ? (
      <div className="tile-content">
        <FontAwesomeIcon icon={faMedkit} className="event-icon" />
      </div>
    ) : (
      <div className="tile-content-no-event" style={{ color: "transparent" }}>
        o
      </div>
    )
  }

  // Filtra gli eventi per la data corrente al caricamento della pagina
  useEffect(() => {
    const eventsOnThatDate = allEvents.filter((event) =>
      isEventOnDate(selectedDate, event)
    )
    setEventsForSelectedDate(eventsOnThatDate)
  }, [allEvents, selectedDate])

  return (
    <div className="calendar-list">
      <Calendar
        onClickDay={onDateClick} // Aggiorna gli eventi quando clicchi su una data
        value={selectedDate} // Imposta la data corrente di default
        tileContent={tileContent} // Personalizza il contenuto delle celle
      />
      <h1>
        {eventsForSelectedDate.length} eventi in data{" "}
        {moment(selectedDate).format("DD MMMM YYYY")}:
      </h1>
      <div className="shadow-top"></div>
      <div className="event-details">
        {selectedDate && (
          <div className="ev2">
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate
                .sort((a, b) => a.time.localeCompare(b.time)) // Ordina gli eventi per orario
                .map((event) => (
                  <div className="event-popup" key={event._id}>
                    <strong>{event.medicine_name}</strong> -{" "}
                    <FontAwesomeIcon
                      icon={faClock}
                      style={{
                        color: "white", // Cambia il colore dell'icona
                        backgroundColor: "black", // Cambia il colore di sfondo
                        borderRadius: "50%", // Aggiungi un bordo circolare se lo desideri
                        padding: "0.1vh",
                      }}
                    />{" "}
                    {event.time}
                    <br />
                    {event.description}
                  </div>
                ))
            ) : (
              <p>Nessun evento per questa data.</p>
            )}
          </div>
        )}
      </div>
      <div className="shadow-bottom"></div>
    </div>
  )
}
