import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarAlt,
  faRobot,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons"
import Modal from "react-modal"

Modal.setAppElement("#root")

export default function Login({
  setLogged,
  setLoggedUser,
  setIsButtonDisabled,
  isButtonDisabled,
}) {
  const [signInfo, setSignInfo] = useState({ username: "", password: "" })
  const [signUpInfo, setSignUpInfo] = useState({
    username: "",
    password: "",
    nome: "",
    cognome: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: "",
    city: "",
    address: "",
    zipCode: "",
  })
  const [isSignUp, setIsSignUp] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [shouldRedirect, setShouldRedirect] = useState(false)
  let navigate = useNavigate()

  axios.defaults.withCredentials = true

  const handleCloseModal = () => {
    setModalIsOpen(false)
    if (shouldRedirect) {
      axios.get("/v1/auth/check").then((response) => {
        setLogged(response.data.isLogged)
        setLoggedUser(response.data.user)
      })
      navigate("/home") // Solo dopo la chiusura del modal
    }
  }

  const handleInfo = (e) => {
    setSignInfo({ ...signInfo, [e.target.name]: e.target.value })
  }

  const handleSignUpInfo = (e) => {
    setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value })
  }

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    return passwordRegex.test(password)
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setIsButtonDisabled(true)
    axios
      .post("/v1/auth/login", {
        username: signInfo.username,
        password: signInfo.password,
      })
      .then((r) => {
        setModalMessage(r.data.message)
        setModalIsOpen(true)
        setShouldRedirect(true)
        // Non eseguire il reindirizzamento qui
      })
      .catch((error) => {
        setModalMessage(error.response.data.message)
        setModalIsOpen(true)
        setSignInfo({ username: "", password: "" })
        setIsButtonDisabled(false)
      })
  }

  const handleSignUpSubmit = (e) => {
    e.preventDefault()
    if (!validatePassword(signUpInfo.password)) {
      setModalMessage("La password deve essere lunga almeno 8 caratteri, contenere almeno una lettera maiuscola, una minuscola, un numero e un simbolo (!@#$%^&*).")
      setModalIsOpen(true)
      return
    }
    setIsButtonDisabled(true)
    const { birthDay, birthMonth, birthYear } = signUpInfo
    let dataNascita = ""
    if (birthDay && birthMonth && birthYear) {
      const date = new Date(birthYear, birthMonth - 1, birthDay)
      dataNascita = date.toString()
    }
    axios
      .post("/v1/auth/register", {
        username: signUpInfo.username,
        password: signUpInfo.password,
        nome: signUpInfo.nome,
        cognome: signUpInfo.cognome,
        dataNascita,
        sesso: signUpInfo.gender,
        citta: signUpInfo.city,
        indirizzo: signUpInfo.address,
        cap: signUpInfo.zipCode,
      })
      .then((r) => {
        setModalMessage(r.data.message)
        setModalIsOpen(true)
        setShouldRedirect(true)
      })
      .catch((error) => {
        setModalMessage(error.response.data.message)
        setModalIsOpen(true)
        setSignUpInfo({
          username: "",
          password: "",
          nome: "",
          cognome: "",
          birthDay: "",
          birthMonth: "",
          birthYear: "",
          gender: "",
          city: "",
          address: "",
          zipCode: "",
        })
      })
      .finally(() => {
        setIsButtonDisabled(false)
      })
  }

  return (
    <div className={`container ${isSignUp ? "right-panel-active" : ""}`} id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUpSubmit}>
          <h1 className="bold">Crea il tuo Account</h1>
          <input
            type="text"
            placeholder="Nome"
            name="nome"
            value={signUpInfo.nome}
            onChange={handleSignUpInfo}
            required
          />
          <input
            type="text"
            placeholder="Cognome"
            name="cognome"
            value={signUpInfo.cognome}
            onChange={handleSignUpInfo}
            required
          />
          <input
            type="username"
            placeholder="Username"
            name="username"
            value={signUpInfo.username}
            onChange={handleSignUpInfo}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={signUpInfo.password}
            onChange={handleSignUpInfo}
            required
          />
          <div className="dob-container">
            <select
              name="birthDay"
              value={signUpInfo.birthDay}
              onChange={handleSignUpInfo}
              required
            >
              <option value="">Giorno</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="birthMonth"
              value={signUpInfo.birthMonth}
              onChange={handleSignUpInfo}
              required
            >
              <option value="">Mese</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="birthYear"
              value={signUpInfo.birthYear}
              onChange={handleSignUpInfo}
              required
            >
              <option value="">Anno</option>
              {Array.from({ length: 100 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
          <div className="gender">
            <select
              name="gender"
              value={signUpInfo.gender}
              onChange={handleSignUpInfo}
              required
            >
              <option value="">Seleziona il sesso</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="CAP"
            name="zipCode"
            value={signUpInfo.zipCode}
            onChange={handleSignUpInfo}
            required
          />
          <input
            type="text"
            placeholder="Città"
            name="city"
            value={signUpInfo.city}
            onChange={handleSignUpInfo}
            required
          />
          <input
            type="text"
            placeholder="Indirizzo"
            name="address"
            value={signUpInfo.address}
            onChange={handleSignUpInfo}
            required
          />
          <button type="submit" disabled={isButtonDisabled}>
            Registrati
          </button>
        </form>
      </div>

      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <img className="logoForm" alt="Logo web-app" src="logo-scritta1.png" />
          <h1 className="bold">Inserisci le tue credenziali</h1>
          <input
            type="username"
            placeholder="Username"
            name="username"
            value={signInfo.username}
            onChange={handleInfo}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={signInfo.password}
            onChange={handleInfo}
            required
          />
          <button type="submit" disabled={isButtonDisabled}>
            Login
          </button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Bentornato!</h1>
            <p>
              Per usufruire dei nostri servizi ed accedere alla tua area
              personale effettua il login con le tue credenziali.
            </p>
            <button className="ghost" onClick={() => setIsSignUp(false)}>
              Login
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Ciao! Conosci MEDANGEL?</h1>
            <p>
              MedAngel è una piattaforma innovativa progettata per migliorare
              l'accesso alle informazioni sanitarie attraverso un'intuitiva
              interfaccia grafica.
            </p>
            <div className="features-container">
              <div className="feature">
                <FontAwesomeIcon icon={faCalendarAlt} className="feature-icon" />
                <p className="section-description">
                  Organizza il calendario delle tue medicine.
                </p>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faRobot} className="feature-icon" />
                <p className="section-description">
                  Parla con il chatbot medico disponibile 24/7.
                </p>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="feature-icon" />
                <p className="section-description">
                  Trova facilmente le farmacie più vicine a te.
                </p>
              </div>
            </div>
            <button className="ghost" onClick={() => setIsSignUp(true)}>
              Registrati
            </button>
          </div>
        </div>
      </div>

      {/* Modal per i messaggi */}
      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} contentLabel="Messaggio">
        <h2>Messaggio</h2>
        <p>{modalMessage}</p>
        <button onClick={handleCloseModal}>CHIUDI</button>
      </Modal>
    </div>
  )
}
