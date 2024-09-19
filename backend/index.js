require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const cors = require('cors')
const https = require('https')
const fs = require('fs')

const app = express()

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}

const server = https.createServer(options, app)

mongoose.connect(process.env.DB_URL)

const db = mongoose.connection
db.once('open', () => {
  console.log('Connesso al DB')
  server.listen(process.env.PORT, () => {
    console.log('App in ascolto sulla porta ' + process.env.PORT)
  })
})

const authRouter = require('./routes/auth')
const router = require('./routes/api')
const authMiddleware = require('./middlewares/auth')

app.use(express.json())
app.use(cors({
  origin:[process.env.ORIGIN],
  methods: ["GET","POST"],
  credentials: true
}))

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
  key: 'userLogged',
  secret: 'key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24*60*60*1000,
    sameSite: true,
    //secure: true,
    httpOnly: true
  }
}))


app.use('/auth', authRouter)

app.use('/api',authMiddleware.requireAuth)

app.use('/api', router)