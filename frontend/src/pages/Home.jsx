import { React, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import markerIconRed from "../img/TuSeiQui-logo.png"
import L from "leaflet"
import "leaflet-defaulticon-compatibility"
import "leaflet/dist/leaflet.css"
import "react-calendar/dist/Calendar.css" // Stile per il calendario

import CalendarWithEvents from "../components/CalendarWithEvents"
import Navbar from "../components/Navbar"
import ChatBot from "../components/ChatBot"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

export default function Home({
  isLogged,
  setLogged,
  loggedUser,
  setLoggedUser,
  setIsButtonDisabled,
}) {
  const [allPharmacies, setAllPharmacies] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [isLoading, setLoading] = useState(true)

  let navigate = useNavigate()
  axios.defaults.withCredentials = true

  // Ottenere la latitudine e longitudine dalla residenza dell'utente
  const userResidenceLat = loggedUser?.residenzaLat
  const userResidenceLon = loggedUser?.residenzaLon

  // Icona per la residenza
  let UserIcon = L.icon({
    iconUrl: markerIconRed, // Usa l'icona rossa
    shadowUrl: markerShadow,
    iconSize: [40, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  // Crea un'icona personalizzata con le immagini predefinite di Leaflet
  let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  // Imposta l'icona predefinita per i marker
  L.Marker.prototype.options.icon = DefaultIcon

  useEffect(() => {
    if (userResidenceLat && userResidenceLon) {
      axios
        .get("/v1/api/pharmacy/findNearbyPharmacies", {
          params: {
            latitude: userResidenceLat, // Invia la latitudine della residenza dell'utente
            longitude: userResidenceLon, // Invia la longitudine della residenza dell'utente
          },
        })
        .then((res) => {
          setAllPharmacies(res.data)
          setLoading(false)
        })
        .catch((error) => {
          alert(error.response.data.message)
          axios.get("/v1/auth/check").then((response) => {
            setLogged(error.response.data.isLogged)
            setLoggedUser(error.response.data.user)
            setIsButtonDisabled(false)
            navigate("/login")
          })
        })

      axios
        .post("/v1/api/calendar/getRecurringEvents", { user_id: loggedUser._id })
        .then((res) => {
          setAllEvents(res.data)
          setLoading(false)
        })
        .catch((error) => {
          alert(error.response.data.message)
          axios.get("/v1/auth/check").then((response) => {
            setLogged(error.response.data.isLogged)
            setLoggedUser(error.response.data.user)
            setIsButtonDisabled(false)
            navigate("/login")
          })
        })
    }
  }, [isLogged, userResidenceLat, userResidenceLon])

  return (
    <>
      <Navbar
        isLogged={isLogged}
        setLogged={setLogged}
        loggedUser={loggedUser}
        setLoggedUser={setLoggedUser}
      />
      <div className="Home-page">
        {/* Calendario */}
        <div className="calendar-section">
          <h2 className="calendar-title">Il tuo calendario degli eventi</h2>
          {/* Passa allEvents come prop a CalendarWithEvents */}
          <CalendarWithEvents allEvents={allEvents} />
        </div>

        <ChatBot loggedUser={loggedUser} />

        <div className="faq-map">
          <div className="faq">
            <div className="noscroll">
              <h1>FAQ</h1>
            </div>
            <div className="faq2">
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {" "}
                {/* Rimuove il pallino */}
                <li style={{ marginBottom: "15px", color: "white" }}>
                  <strong>Come funziona il calendario degli eventi?</strong>
                  <p>
                    Il calendario ti aiuta a gestire e monitorare l'assunzione
                    giornaliera delle tue medicine. Puoi aggiungere, modificare
                    o eliminare eventi e ricevere promemoria per non dimenticare
                    nulla.
                  </p>
                </li>
                <li style={{ marginBottom: "15px", color: "white" }}>
                  <strong>
                    Come posso inserire le mie medicine nel Calendario?
                  </strong>
                  <p>
                    Nella sezione "Personalizza Calendario", puoi aggiungere le
                    tue medicine cliccando il pulsante "Crea evento".
                  </p>
                </li>
                <li style={{ marginBottom: "15px", color: "white" }}>
                  <strong>Il chatbot medico è affidabile?</strong>
                  <p>
                    Il nostro chatbot risponde a domande generali sulla salute.
                    Tuttavia, non sostituisce il consulto di un medico. Per
                    diagnosi e trattamenti, consulta sempre il tuo medico.
                  </p>
                </li>
                <li style={{ marginBottom: "15px", color: "white" }}>
                  <strong>MedAngel è gratuito?</strong>
                  <p>
                    Sì, l'uso delle funzionalità di base è gratuito. Alcuni
                    servizi aggiuntivi potrebbero richiedere un abbonamento in
                    futuro, ma per ora tutto è accessibile senza costi.
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="map">
            <h1 className="titleMap">Ecco le farmacie più vicine a te!</h1>
            <div className="mappa-container">
              {!userResidenceLat || !userResidenceLon ? (
                <p>Caricamento delle farmacie più vicine a casa tua...</p> // Mostra un messaggio mentre carichi la residenza
              ) : (
                <MapContainer
                  center={[userResidenceLat, userResidenceLon]} // Centro sulla residenza dell'utente
                  zoom={16}
                  style={{ height: "280px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* Marker per la residenza dell'utente */}
                  <Marker
                    position={[userResidenceLat, userResidenceLon]} // Posizione della residenza dell'utente
                    icon={UserIcon} // Icona personalizzata per l'utente
                  >
                    <Popup>
                      <strong>La tua residenza</strong>
                    </Popup>
                  </Marker>

                  {/* Marker per le farmacie */}
                  {allPharmacies.map(
                    (pharmacy) =>
                      pharmacy.lat &&
                      pharmacy.lon && (
                        <Marker
                          key={pharmacy.place_id} // Usa place_id come chiave unica
                          position={[
                            parseFloat(pharmacy.lat),
                            parseFloat(pharmacy.lon),
                          ]} // Converti lat e lon in numeri
                        >
                          <Popup>
                            <strong>{pharmacy.name}</strong>
                            <br />
                            Indirizzo: {pharmacy.display_name}
                          </Popup>
                        </Marker>
                      )
                  )}
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
