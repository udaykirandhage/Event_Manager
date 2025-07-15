const express = require('express')
const {initializeDB,getDB} = require('./Model/db')
const userRouter = require("./routes/userroute")
const {Eventrouter} = require('./routes/userEventroutes')
const port = process.env.PORT || 3006
require('dotenv').config();

const app = express()
app.use(express.json())


app.use('/',userRouter)

app.use('/',Eventrouter)


initializeDB().then(() => {
  app.listen(port, () =>
    console.log('Server Running at http://localhost:3006/'),
  )
}) 



module.exports = {app}