import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Events from "./pages/Events";
import Profile from "./pages/Profile";

export default function App() {
  //stato che tiene traccia se l'utente è loggato o meno (settato a false quando si effettua il logout)
  const [isLogged, setLogged] = useState(false);

  //stato che tiene traccia dell'utente loggato
  const [loggedUser, setLoggedUser] = useState({
    username: "",
    _id: "",
    nome: "",
    cognome: "",
    dataNascita: "",
    sesso: "",
    citta: "",
    indirizzo: "",
    cap: "",
  });

  //stato per disabilitare tutti i button quando si preme su uno di loro
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  //react-hook utile per effettuare la redirezione
  const navigate = useNavigate();

  /* 
  Appena caricata l'app viene verificato se la sessione è ancora valida, e setta isLogged e loggedUser 
  in base alle informazioni correnti
  */
  useEffect(() => {
    axios.get("/v1/auth/check").then((response) => {
      setLogged(response.data.isLogged);
      setLoggedUser(response.data.user);
    });
  }, []);

  /* 
  useEffect eseguito solo quando cambia isLogged (scaduto il cookie o effettuato il logout)
  una volta loggato isLogged è true e mi reindirizza alla home
  Se scade il cookie o effettuo il logout, isLogged va a false e vengo reindirizzato alla pagina di login
  Ogni volta che aprirò l'app e la sessione è ancora attiva visualizzerò direttamente la home senza dovre rieffettuare il login
  */
  useEffect(() => {
    isLogged ? navigate("/home") : navigate("/login");
  }, [isLogged]);

  return (
    <Routes>
      <Route
        path="/home"
        element={
          <Home
            isLogged={isLogged}
            setLogged={setLogged}
            loggedUser={loggedUser}
            setLoggedUser={setLoggedUser}
            setIsButtonDisabled={setIsButtonDisabled}
          />
        }
      />
      <Route
        path="/login"
        element={
          <Login
            setLogged={setLogged}
            setLoggedUser={setLoggedUser}
            isButtonDisabled={isButtonDisabled}
            setIsButtonDisabled={setIsButtonDisabled}
          />
        }
      />
      <Route
        path="/events"
        element={
          <Events
            isLogged={isLogged}
            setLogged={setLogged}
            loggedUser={loggedUser}
            setLoggedUser={setLoggedUser}
            isButtonDisabled={isButtonDisabled}
            setIsButtonDisabled={setIsButtonDisabled}
          />
        }
      />
      <Route
        path="/profile"
        element={
          <Profile
            isLogged={isLogged}
            setLogged={setLogged}
            loggedUser={loggedUser}
            setLoggedUser={setLoggedUser}
            isButtonDisabled={isButtonDisabled}
            setIsButtonDisabled={setIsButtonDisabled}
          />
        }
      />
    </Routes>
  );
}
