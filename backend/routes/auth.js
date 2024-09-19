const express = require('express')
const authController = require('../controllers/auth')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

router.get('/check',authController.getUserLogged)

router.put('/update',authController.updateUserProfile)

router.post('/register',authController.registerUser)

router.post('/login', authController.loginUser)

router.post('/logout', authMiddleware.requireAuth, authController.logoutUser)

module.exports = router

