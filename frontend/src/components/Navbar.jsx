import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  faUserCircle,
  faHome,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Navbar({
  isLogged,
  setLogged,
  loggedUser,
  setLoggedUser,
}) {
  const [showDropdown, setShowDropdown] = useState(false) // Stato per il dropdown
  const navigate = useNavigate()

  axios.defaults.withCredentials = true

  const logoutHandler = () => {
    axios
      .post("/auth/logout", {})
      .then((response) => {
        alert(response.data.message)
        //get per effettuare il check sui cookie settati
        axios.get("/auth/check").then((response) => {
          setLogged(response.data.isLogged)
          setLoggedUser(response.data.user)
        })
        navigate("/login")
      })
      .catch((error) => {
        alert(error.response.data.message)
        axios.get("/auth/check").then((response) => {
          setLogged(response.data.isLogged)
          setLoggedUser(response.data.user)
        })
      })
  }

  // Funzione per toggle del menu a tendina
  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState)
  }

  return (
    <nav>
      <div className="infoUser">
        <img className="logo" alt="Logo web-app" src="logoMEDANGEL1.png" />
        {isLogged && (
          <span className="username">
            {loggedUser.sesso === "F" ? "Bentornata" : "Bentornato"}{" "}
            {loggedUser.username}
          </span>
        )}
      </div>
      <ul>
        <li>
          <FontAwesomeIcon icon={faHome} />
          <Link className="navLink" to="/home">
            Home
          </Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faCalendarAlt} />
          <Link className="navLink" to="/events">
            Personalizza Calendario
          </Link>
        </li>
      </ul>

      {/* Icona utente con menu a tendina */}
      <div
        className="user-icon-container"
        onMouseEnter={toggleDropdown}
        onMouseLeave={toggleDropdown}
      >
        <FontAwesomeIcon icon={faUserCircle} className="navLink" />
        {showDropdown && (
          <div className="dropdown">
            <Link to="/profile" className="dropdown-item">
              Profilo
            </Link>
            <span className="dropdown-item" onClick={logoutHandler}>
              Logout
            </span>
          </div>
        )}
      </div>
    </nav>
  )
}
