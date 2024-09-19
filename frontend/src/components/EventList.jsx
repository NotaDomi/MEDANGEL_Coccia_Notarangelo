import React, { useEffect, useState } from "react"
import Event from "./Event"

export default function EventList({
  events,
  setEvents,
  setLogged,
  loggedUser,
  setLoggedUser,
  setClick,
  setSelectedEvent,
  isButtonDisabled,
  setIsButtonDisabled,
}) {
  const [showTextEvent, setText] = useState(false)

  useEffect(() => {
    events.length > 0 ? setText(false) : setText(true)
  }, [events])

  return (
    <div id="aside-events">
      <div className="lista-eventi">
        {showTextEvent ? (
          <p id="lista-vuota">
            Al momento non hai eventi programmati. <br /> Aggiungine uno.
          </p>
        ) : (
          events.map((event, index) => (
            <Event
              key={index}
              event={event}
              setLogged={setLogged}
              loggedUser={loggedUser}
              setLoggedUser={setLoggedUser}
              setClick={setClick}
              setSelectedEvent={setSelectedEvent}
              events={events}
              setEvents={setEvents}
              isButtonDisabled={isButtonDisabled}
              setIsButtonDisabled={setIsButtonDisabled}
            />
          ))
        )}
      </div>
      <button
        className="button"
        onClick={() => {
          setSelectedEvent(null)
          setClick(true)
        }}
      >
        Crea Nuovo Evento
      </button>
    </div>
  )
}
