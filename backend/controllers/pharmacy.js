const axios = require('axios');
const User = require('../models/users');

// Calcola il bounding box per un raggio di 1 km
const getBoundingBox = (lat, lon, radius) => {
  const earthRadius = 6378137; // Raggio della Terra in metri
  const latRad = lat * (Math.PI / 180);
  const lonRad = lon * (Math.PI / 180);
  const radiusInDegrees = radius / earthRadius * (180 / Math.PI);

  return {
    north: lat + radiusInDegrees,
    south: lat - radiusInDegrees,
    east: lon + radiusInDegrees / Math.cos(latRad),
    west: lon - radiusInDegrees / Math.cos(latRad),
  };
};

// Ottieni farmacie usando Nominatim
const getPharmacies = async (boundingBox) => {
  const { north, south, east, west } = boundingBox;
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: 'pharmacy',
        format: 'json',
        bounded: 1,
        viewbox: `${west},${south},${east},${north}`,
        addressdetails: 1,
        limit: 50
      }
    });

    if (response.data && response.data.length > 0) {
      return response.data;
    }
    throw new Error('Nessuna farmacia trovata');
  } catch (error) {
    console.error('Errore nella ricerca delle farmacie:', error);
    throw new Error('Errore nella ricerca delle farmacie');
  }
};

module.exports = {
  // Aggiungi questo metodo al controller per cercare farmacie vicine
  findNearbyPharmacies: async (req, res) => {
    try {
      // Assumiamo che l'utente sia loggato e le informazioni siano disponibili nella sessione
      const userId = req.session.userLogged.id;

      // Trova l'utente nel database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }

      // Calcola il bounding box per 1 km
      const boundingBox = getBoundingBox(user.residenzaLat, user.residenzaLon, 500); // 1 km = 1000 metri

      // Trova le farmacie
      const pharmacies = await getPharmacies(boundingBox);
      res.json(pharmacies);
    } catch (error) {
      console.error('Errore nella ricerca delle farmacie:', error);
      res.status(500).json({ message: 'Errore interno al server' });
    }
  }
};
