const axios = require('axios');
const User = require('../models/users');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Funzione per ottenere latitudine e longitudine da un indirizzo
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1
      }
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }
    throw new Error('Indirizzo non trovato');
  } catch (error) {
    console.error('Errore nella geocodifica:', error);
    throw new Error('Errore nella geocodifica');
  }
};

// Funzione per aggiornare il profilo dell'utente
exports.updateUserProfile = async (req, res) => {
  const { id, username, nome, cognome, birthDay, birthMonth, birthYear, gender, zipCode, city, address, password } = req.body;

  try {
    const updateData = {
      username,
      nome,
      cognome,
      dataNascita: new Date(`${birthYear}-${birthMonth}-${birthDay}`),
      sesso: gender,
      cap: zipCode,
      citta: city,
      indirizzo: address,
    };

    // Aggiungi la password all'aggiornamento solo se presente
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash della nuova password
      updateData.password = hashedPassword;
    }

    // Geocodifica l'indirizzo aggiornato
    const addressString = `${address}, ${city}, ${zipCode}`;
    const { lat, lon } = await geocodeAddress(addressString);
    updateData.residenzaLat = lat;
    updateData.residenzaLon = lon;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del profilo:', error);
    res.status(500).json({ message: 'Errore interno al server' });
  }
}

// Funzione per registrare un utente
exports.registerUser = async (req, res) => {
  const { username, password, nome, cognome, dataNascita, sesso, citta, indirizzo, cap } = req.body;

  try {
    // Geocodifica dell'indirizzo
    const address = `${indirizzo}, ${citta}, ${cap}`;
    const { lat, lon } = await geocodeAddress(address);

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username già esistente' });
    }

    const newUser = new User({
      username,
      password,
      nome,
      cognome,
      dataNascita,
      sesso,
      citta,
      indirizzo,
      cap,
      residenzaLat: lat,
      residenzaLon: lon
    });

    const savedUser = await newUser.save();
    req.session.userLogged = { id: savedUser._id, username: savedUser.username };
    res.status(201).json({ message: 'Registrazione avvenuta con successo' });
  } catch (error) {
    console.error('Errore nella registrazione:', error);
    res.status(500).json({ message: 'Errore interno al server' });
  }
};

// Funzione per ottenere i dettagli dell'utente loggato
exports.getUserLogged = (req, res) => {
  if (!req.session.userLogged) {
    return res.status(200).json({ isLogged: false, user: '' });
  }

  // Recupera l'ID dell'utente dalla sessione
  const userId = req.session.userLogged.id;

  // Trova l'utente nel database usando l'ID
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }

      // Invia i dati anagrafici dell'utente al frontend
      res.json({
        isLogged: true,
        user: {
          _id: userId,
          username: user.username,
          nome: user.nome,
          cognome: user.cognome,
          dataNascita: user.dataNascita,
          sesso: user.sesso,
          citta: user.citta,
          indirizzo: user.indirizzo,
          cap: user.cap,
          residenzaLat: user.residenzaLat,
          residenzaLon: user.residenzaLon
        }
      });
    })
    .catch(error => {
      console.error('Errore nel recupero dei dettagli utente:', error);
      res.status(500).json({ message: 'Errore interno al server' });
    });
};

// Funzione per effettuare il login
exports.loginUser = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.status(401).json({ message: 'Credenziali errate' });
      } else {
        return user.comparePassword(password)
          .then((isMatch) => {
            if (!isMatch) {
              res.status(401).json({ message: 'Credenziali errate' });
            } else {
              req.session.userLogged = { id: user._id, username: user.username };
              res.json({ message: 'Login avvenuto con successo' });
            }
          });
      }
    })
    .catch(error => {
      console.error('Errore nel login:', error);
      res.status(500).json({ message: 'Errore interno al server' });
    });
};

// Funzione per effettuare il logout
exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.clearCookie('userLogged');
  res.json({ message: 'Logout avvenuto con successo' });
};






/*const User = require('../models/users')

/*
In questo file abbiamo gestito i controllers per l'autenticazione al percorso /auth con i suoi sottopercorsi

/check --> utilizza il controller getUserLogged che ritornerà al frontend l'id dell'utente corrispondente al valore salvato nel cookie (su questo metodo non è applicato il middleware requireAuth)

/register --> utilizza il controller registerUser che permetterà di registrare un utente controllando che l'username non sia già utilizzato (su questo metodo non è applicato il middleware requireAuth)

/login --> utilizza il controller loginUser che permetterà di effettuare il login usando il metodo compare che abbiamo definito nel model users (su questo metodo non è applicato il middleware requireAuth)

/logout --> utilizza il controller logoutUser che permetterà di effettuare il logout comunicando al client di eliminare il cookie (su questo metodo è applicato il middleware requireAuth)

La scelta di usare il middleware solo sul logout verrà spiegata nel file apposito



module.exports = {
  
    registerUser: (req, res) => {
      const { username, password, nome, cognome, dataNascita, sesso, citta, indirizzo, cap } = req.body
    
      User.findOne({ username })
        .then(existingUser => {
          if (existingUser) {
            res.status(400).json({ message: 'Username già esistente' })
          } else {
            const newUser = new User({ 
              username,
              password,
              nome,
              cognome,
              dataNascita,
              sesso,
              citta,
              indirizzo,
              cap 
            })

            return newUser.save()
                    .then(newUser => {
                      req.session.userLogged = { id: newUser._id, username: newUser.username }
                      res.status(201).json({ message: 'Registrazione avvenuta con successo' })
                    })
          }
        })
        .catch(error => {
          console.error('Errore nella registrazione:', error)
          res.status(500).json({ message: 'Errore interno al server' })
        })
    },

    getUserLogged: (req, res) => {
      if (!req.session.userLogged) {
          return res.status(401).json({ message: 'Non sei autenticato' });
      }

      // Recupera l'ID dell'utente dalla sessione
      const userId = req.session.userLogged.id;

      // Trova l'utente nel database usando l'ID
      User.findById(userId)
          .then(user => {
              if (!user) {
                  return res.status(404).json({ message: 'Utente non trovato' });
              }

              // Invia i dati anagrafici dell'utente al frontend
              res.json({
                  username: user.username,
                  nome: user.nome,
                  cognome: user.cognome,
                  dataNascita: user.dataNascita,
                  sesso: user.sesso,
                  citta: user.citta,
                  indirizzo: user.indirizzo,
                  cap: user.cap
              });
          })
          .catch(error => {
              console.error('Errore nel recupero dei dettagli utente:', error);
              res.status(500).json({ message: 'Errore interno al server' });
          });
  },

    loginUser: (req, res) => {
      const username = req.body.username
      const password = req.body.password
    
      User.findOne({ username })
        .then(user => {
          if (!user) {
            res.status(401).json({ message: 'Credenziali errate' })
          } else {
            return user.comparePassword(password)
                    .then((isMatch) => {
                      if (!isMatch) {
                        res.status(401).json({ message: 'Credenziali errate' })
                      } else {
                        req.session.userLogged = { id: user._id, username: user.username }
                        res.json({ message: 'Login avvenuto con successo' })
                      }
                    })
          }
        })
        .catch(error => {
          console.error('Errore nel login:', error)
          res.status(500).json({ message: 'Errore interno al server' })
        })
    },

    logoutUser: (req, res) => {
        req.session.destroy()
        res.clearCookie('userLogged')
        res.json({ message: 'Logout avvenuto con successo' })
    }

}*/