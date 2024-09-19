import React, { useEffect, useState } from "react"
import axios from "axios"

import EventList from "../components/EventList" // Lista degli eventi
import Navbar from "../components/Navbar" // Navbar
import Loading from "../components/Loading" // Componente Loading
import EventForm from "../components/EventForm" // Form per creare/modificare l'evento
import BannerEvents from "../components/BannerEvents" // Schermata vuota (sostituto del BannerEvents per visualizzare un messaggio di default)

export default function EventPage({
  isLogged,
  setLogged,
  loggedUser,
  setLoggedUser,
  isButtonDisabled,
  setIsButtonDisabled,
}) {
  const [events, setEvents] = useState([]) // Stato per gli eventi
  const [isLoading, setLoading] = useState(true) // Stato per il caricamento
  const [click, setClick] = useState(false) // Controlla se visualizzare o meno il form
  const [selectedEvent, setSelectedEvent] = useState(null) // Evento selezionato per la modifica

  axios.defaults.withCredentials = true // Abilita i cookie

  // Caricamento iniziale degli eventi
  useEffect(() => {
    axios
      .post("/api/calendar/getEvents", { user_id: loggedUser._id })
      .then((res) => {
        setEvents(res.data) // Salva gli eventi nel state
        setLoading(false) // Termina il caricamento
      })
      .catch((error) => {
        alert(error.response.data.message)
        axios
          .get("/auth/check") // Controlla se l'utente è loggato
          .then((response) => {
            setLogged(response.data.isLogged)
            setLoggedUser(response.data.user)
          })
      })
  }, [loggedUser._id, setLogged, setLoggedUser])

  return (
    <>
      <Navbar
        isLogged={isLogged}
        setLogged={setLogged}
        loggedUser={loggedUser}
        setLoggedUser={setLoggedUser}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <div id="event-content">
          {/* Lista degli eventi */}
          <EventList
            events={events}
            setEvents={setEvents}
            setClick={setClick}
            setSelectedEvent={setSelectedEvent}
            loggedUser={loggedUser}
            setLogged={setLogged}
            setLoggedUser={setLoggedUser}
            isButtonDisabled={isButtonDisabled}
            setIsButtonDisabled={setIsButtonDisabled}
          />

          <div id="event-container">
            {/* Se clicchi su "Crea Nuovo Evento" o "Modifica", viene mostrato il form */}
            {click ? (
              <EventForm
                loggedUser={loggedUser}
                selectedEvent={selectedEvent} // Evento da modificare (null per un nuovo evento)
                setSelectedEvent={setSelectedEvent}
                setEvents={setEvents} // Per aggiornare la lista degli eventi dopo creazione/modifica
                setClick={setClick} // Chiude il form al termine
              />
            ) : (
              <BannerEvents />
            )}
          </div>
        </div>
      )}
    </>
  )
}
