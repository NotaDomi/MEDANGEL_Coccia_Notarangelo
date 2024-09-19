import React from "react"
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Event({
  event,
  setLogged,
  setLoggedUser,
  setClick,
  setSelectedEvent,
  events,
  setEvents,
  isButtonDisabled,
  setIsButtonDisabled,
}) {
  const navigate = useNavigate()

  const deleteEvent = () => {
    setIsButtonDisabled(true)
    axios
      .delete(`/api/calendar/events/${event._id}`)
      .then((res) => {
        alert(res.data.message)
        setEvents(events.filter((e) => e._id !== event._id))
        setIsButtonDisabled(false)
      })
      .catch((error) => {
        alert(error.response.data.message)
        axios.get("/auth/check").then((response) => {
          setLogged(response.data.isLogged)
          setLoggedUser(response.data.user)
          setIsButtonDisabled(false)
          navigate("/login")
        })
      })
  }

  const editEvent = () => {
    setSelectedEvent(event)
    setClick(true)
  }

  return (
    <>
      <div className="eventCard">
        <h3>{event.medicine_name}</h3>
        <p>{event.description}</p>
        <button
          className="button"
          onClick={editEvent}
          disabled={isButtonDisabled}
        >
          <span> Modifica </span> <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          className="button"
          onClick={deleteEvent}
          disabled={isButtonDisabled}
        >
          <span> Elimina </span> <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </>
  )
}
