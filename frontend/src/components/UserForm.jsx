import React from "react"
import {
  faUser,
  faKey,
  faCalendarAlt,
  faVenusMars,
  faMapMarkerAlt,
  faCity,
  faHome,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function UserForm({
  profileInfo,
  handleInfoChange,
  handleSubmit,
  isButtonDisabled,
}) {
  return (
    <div className="userForm">
      <h3>Aggiorna le tue informazioni:</h3>
      <form onSubmit={handleSubmit}>
        <label id="username">
          <FontAwesomeIcon icon={faUser} /> Username:{" "}
        </label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          name="username"
          value={profileInfo.username}
          onChange={handleInfoChange}
          required
        />

        <label id="password">
          <FontAwesomeIcon icon={faKey} /> Password:{" "}
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          name="password"
          value={profileInfo.password}
          onChange={handleInfoChange}
        />

        <label id="nome">
          <FontAwesomeIcon icon={faUser} /> Nome:{" "}
        </label>
        <input
          id="nome"
          type="text"
          placeholder="Nome"
          name="nome"
          value={profileInfo.nome}
          onChange={handleInfoChange}
          required
        />

        <label id="cognome">
          <FontAwesomeIcon icon={faUser} /> Cognome:{" "}
        </label>
        <input
          id="cognome"
          type="text"
          placeholder="Cognome"
          name="cognome"
          value={profileInfo.cognome}
          onChange={handleInfoChange}
          required
        />

        <label id="DataNascita">
          <FontAwesomeIcon icon={faCalendarAlt} /> Data di Nascita:{" "}
        </label>
        <div className="dob-container">
          <select
            name="birthDay"
            value={profileInfo.birthDay}
            onChange={handleInfoChange}
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
            value={profileInfo.birthMonth}
            onChange={handleInfoChange}
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
            value={profileInfo.birthYear}
            onChange={handleInfoChange}
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

        <label id="sesso">
          <FontAwesomeIcon icon={faVenusMars} /> Sesso:{" "}
        </label>
        <select
          id="sesso"
          name="gender"
          value={profileInfo.gender}
          onChange={handleInfoChange}
          required
        >
          <option value="">Seleziona il sesso</option>
          <option value="M">Maschio</option>
          <option value="F">Femmina</option>
          <option value="Altro">Altro</option>
        </select>

        <label id="zipCode">
          <FontAwesomeIcon icon={faMapMarkerAlt} /> CAP:{" "}
        </label>
        <input
          id="zipCode"
          type="text"
          placeholder="CAP"
          name="zipCode"
          value={profileInfo.zipCode}
          onChange={handleInfoChange}
          required
        />

        <label id="city">
          <FontAwesomeIcon icon={faCity} /> Città:{" "}
        </label>
        <input
          id="city"
          type="text"
          placeholder="Città"
          name="city"
          value={profileInfo.city}
          onChange={handleInfoChange}
          required
        />

        <label id="address">
          <FontAwesomeIcon icon={faHome} /> Indirizzo:{" "}
        </label>
        <input
          id="address"
          type="text"
          placeholder="Indirizzo"
          name="address"
          value={profileInfo.address}
          onChange={handleInfoChange}
          required
        />

        <button type="submit" disabled={isButtonDisabled}>
          <span>Salva Modifiche</span>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  )
}
