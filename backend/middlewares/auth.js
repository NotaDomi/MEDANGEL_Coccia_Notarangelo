const User = require('../models/users.js')

/*
Questo è il middleware che si occuperà di verificare che il cookie mandato dal client contenga le informazioni di un utente loggato. 
Viene usato su tutti i sottopercorsi di /api e per il percorso /auth/logout

Il middleware è necessario per impedire l'utilizzo delle api se non si è autenticati, o se la sessione ( maxAge: 24 ore) risulta scaduta
*/

module.exports = {

  requireAuth: (req, res, next) => {

    if (!req.session.userLogged) {
      res.status(401).json({ notAutorized: true, message: 'Sessione scaduta. Per favore effettua nuovamente il login' })
    } else {
      User.findById(req.session.userLogged.id)
        .then(user => {
          req.user = user
          next()
        })
    }
  }
}