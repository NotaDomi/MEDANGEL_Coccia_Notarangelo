const express = require('express')
const calendarRouter = require('./calendar.js')
const pharmacyRouter = require('./pharmacy.js')

const router = express.Router()

router.use('/calendar', calendarRouter)

router.use('/pharmacy', pharmacyRouter)

module.exports = router

//QUI SI AGGIUNGERANNO I ROUTER PER LE API DELLE MAPP, CALENDARIO E CHATBOT
