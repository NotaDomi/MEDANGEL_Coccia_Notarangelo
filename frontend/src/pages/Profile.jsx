import React, { useState } from "react"
import axios from "axios"
import Modal from "react-modal" // Importa il Modal

import Navbar from "../components/Navbar"
import UserForm from "../components/UserForm"
import UserInfo from "../components/UserInfo"

Modal.setAppElement("#root") // Imposta l'elemento principale

export default function Profile({
  isLogged,
  setLogged,
  loggedUser,
  setLoggedUser,
  isButtonDisabled,
  setIsButtonDisabled,
}) {
  const [profileInfo, setProfileInfo] = useState({
    id: loggedUser._id,
    username: loggedUser.username || "",
    nome: loggedUser.nome || "",
    cognome: loggedUser.cognome || "",
    birthDay: loggedUser.dataNascita
      ? new Date(loggedUser.dataNascita).getDate().toString()
      : "",
    birthMonth: loggedUser.dataNascita
      ? (new Date(loggedUser.dataNascita).getMonth() + 1).toString()
      : "",
    birthYear: loggedUser.dataNascita
      ? new Date(loggedUser.dataNascita).getFullYear().toString()
      : "",
    gender: loggedUser.sesso || "",
    zipCode: loggedUser.cap || "",
    city: loggedUser.citta || "",
    address: loggedUser.indirizzo || "",
    password: "", // Lasciato vuoto per la sicurezza
  })

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  // Gestisce i cambiamenti nei campi del modulo
  const handleInfoChange = (e) => {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value })
  }

  // Gestisce l'invio dei dati del modulo
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsButtonDisabled(true)

    const updatedUserData = {
      id: loggedUser._id,
      username: profileInfo.username,
      nome: profileInfo.nome,
      cognome: profileInfo.cognome,
      birthDay: profileInfo.birthDay,
      birthMonth: profileInfo.birthMonth,
      birthYear: profileInfo.birthYear,
      gender: profileInfo.gender,
      zipCode: profileInfo.zipCode,
      city: profileInfo.city,
      address: profileInfo.address,
    }

    // Aggiungi la password solo se è stata modificata (non vuota)
    if (profileInfo.password && profileInfo.password.trim() !== "") {
      updatedUserData.password = profileInfo.password
    }

    axios
      .put("/v1/auth/update", updatedUserData)
      .then((res) => {
        setModalMessage("Profilo aggiornato con successo!")
        setModalIsOpen(true)
        setLoggedUser(res.data.updatedUser)
      })
      .catch((error) => {
        console.error("Errore durante l'aggiornamento del profilo:", error)
        setModalMessage("Errore durante l'aggiornamento del profilo.")
        setModalIsOpen(true)
      })
      .finally(() => {
        setIsButtonDisabled(false)
      })
  }

  const handleCloseModal = () => {
    setModalIsOpen(false)
  }

  return (
    <>
      <Navbar
        isLogged={isLogged}
        setLogged={setLogged}
        loggedUser={loggedUser}
        setLoggedUser={setLoggedUser}
      />
      <div className="profile-page">
        {/* Sezione con le informazioni utente */}
        <UserInfo
          username={loggedUser.username}
          nome={loggedUser.nome}
          cognome={loggedUser.cognome}
        />
        {/* Form per modificare il profilo */}
        <UserForm
          profileInfo={profileInfo}
          handleInfoChange={handleInfoChange}
          handleSubmit={handleSubmit}
          isButtonDisabled={isButtonDisabled}
        />
      </div>

      {/* Modal per i messaggi */}
      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} contentLabel="Messaggio">
        <h2>Messaggio</h2>
        <p>{modalMessage}</p>
        <button onClick={handleCloseModal}>CHIUDI</button>
      </Modal>
    </>
  )
}
