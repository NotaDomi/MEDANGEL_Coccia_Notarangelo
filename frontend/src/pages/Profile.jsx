import React, { useState } from "react"
import axios from "axios"

import Navbar from "../components/Navbar"
import UserForm from "../components/UserForm"
import UserInfo from "../components/UserInfo" // Importa il nuovo componente

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
        alert("Profilo aggiornato con successo!")
        setLoggedUser(res.data.updatedUser)
      })
      .catch((error) => {
        console.error("Errore durante l'aggiornamento del profilo:", error)
        alert("Errore durante l'aggiornamento del profilo.")
      })
      .finally(() => {
        setIsButtonDisabled(false)
      })
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
    </>
  )
}
