import React, { useState } from "react";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

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
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const deleteEvent = () => {
    setIsButtonDisabled(true);
    axios
      .delete(`/v1/api/calendar/events/${event._id}`)
      .then((res) => {
        setEvents(events.filter((e) => e._id !== event._id));
        setIsButtonDisabled(false);
        setModalIsOpen(false); // Chiudi il modal di conferma
      })
      .catch((error) => {
        setIsButtonDisabled(false);
        setErrorMessage(error.response.data.message);
        setModalIsOpen(false); // Chiudi il modal di conferma
        openErrorModal(); // Apri il modal per errore
      });
  };

  const openErrorModal = () => {
    setModalIsOpen(true);
  };

  const editEvent = () => {
    setSelectedEvent(event);
    setClick(true);
  };

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
          onClick={() => setModalIsOpen(true)} // Apri il modal per confermare l'eliminazione
          disabled={isButtonDisabled}
        >
          <span> Elimina </span> <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>

      {/* Modal di conferma eliminazione */}
      <Modal
        isOpen={modalIsOpen && !errorMessage} // Mostra solo se non c'è errore
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Conferma Eliminazione"
      >
        <h2>Conferma Eliminazione</h2>
        <p>Sei sicuro di voler eliminare questo evento?</p>
        <button onClick={deleteEvent}>CONFERMA</button>
        <button onClick={() => setModalIsOpen(false)}>ANNULLA</button>
      </Modal>

      {/* Modal per messaggio di errore */}
      <Modal
        isOpen={!!errorMessage} // Mostra il modal se c'è un messaggio di errore
        onRequestClose={() => {
          setErrorMessage("");
          setModalIsOpen(false);
        }}
        contentLabel="Errore"
      >
        <h2>Errore</h2>
        <p>{errorMessage}</p>
        <button onClick={() => {
          setErrorMessage("");
          setModalIsOpen(false);
        }}>
          CHIUDI
        </button>
      </Modal>
    </>
  );
}
