const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const Database = require('./app/config/Database')
const bodyParser = require('body-parser')
const app = express()
const ejs = require('ejs')

Database()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.set(express.static(__dirname+ '/public'))
app.set(express.static(__dirname+ "/reports"))
// app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(cors())

//Api Router
const apiRouter = require('./app/routes/ApiRoutes')
app.use('/api', apiRouter)

//Report Router
const reportRouter = require('./app/routes/ReportRoutes')
app.use("/report",reportRouter)

const port = 5000
app.listen(port, () => {
  console.log('Server is running on http://localhost:5000')
})