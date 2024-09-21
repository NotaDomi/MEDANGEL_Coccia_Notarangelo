import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faUserCircle, faHome, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Navbar({ isLogged, setLogged, loggedUser, setLoggedUser }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios
      .post("/v1/auth/logout", {})
      .then((response) => {
        setModalMessage(response.data.message);
        setModalIsOpen(true);
      })
      .catch((error) => {
        setModalMessage(error.response.data.message);
        setModalIsOpen(true);
      });
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setTimeout(() => {
      navigate("/login");
    }, 300); // Attendi 300ms prima del redirect
  };

  const handleConfirmLogout = () => {
    axios.get("/v1/auth/check").then((response) => {
      setLogged(response.data.isLogged);
      setLoggedUser(response.data.user);
      navigate("/login");
    });
  };

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  return (
    <nav>
      <div className="infoUser">
        <img className="logo" alt="Logo web-app" src="logoMEDANGEL1.png" />
        {isLogged && (
          <span className="username">
            {loggedUser.sesso === "F" ? "Bentornata" : "Bentornato"} {loggedUser.username}
          </span>
        )}
      </div>
      <ul>
        <li>
          <FontAwesomeIcon icon={faHome} />
          <Link className="navLink" to="/home">Home</Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faCalendarAlt} />
          <Link className="navLink" to="/events">Personalizza Calendario</Link>
        </li>
      </ul>

      <div className="user-icon-container" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
        <FontAwesomeIcon icon={faUserCircle} className="navLink" />
        {showDropdown && (
          <div className="dropdown">
            <Link to="/profile" className="dropdown-item">Profilo</Link>
            <span className="dropdown-item" onClick={logoutHandler}>Logout</span>
          </div>
        )}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} contentLabel="Messaggio">
        <h2>Messaggio</h2>
        <p>{modalMessage}</p>
        <button onClick={handleConfirmLogout}>Conferma</button>
      </Modal>
    </nav>
  );
}
