import React from "react"
import { faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function UserInfo({ username, nome, cognome }) {
  return (
    <div className="user-info">
      {/* Immagine del profilo */}
      <FontAwesomeIcon icon={faUserCircle} className="navLink" />

      {/* Username */}
      <h3>{username}</h3>

      {/* Nome e cognome */}
      <p>
        {nome} {cognome}
      </p>
    </div>
  )
}
