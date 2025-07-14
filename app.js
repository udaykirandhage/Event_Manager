const express = require('express')
const bcrypt = require('bcrypt')
const Joi = require('joi');
const {initializeDB,getDB} = require('./Model/db')
const {register} = require('./controller/usercontroller')
const {validateSignup,validateSignin }= require('./validator/Joi.validator')
const router = require("./routes/route")

const port = process.env.PORT || 3006
require('dotenv').config();
const app = express()


app.use(express.json())

app.use('/',router)

//Login

app.post('/login/', async (req, res) => {
  const db = getDB();
  const { email, password } = req.body;

  // 🔍 Validate input
  const { error } = validateSignin(req.body);
  if (error) {
    console.log('Validation error:', error.details);
    return res.status(400).send(error.details.map(e => e.message)); // Send error messages
  }

  //  Check if user exists
  try {
    const query = `SELECT * FROM user WHERE email = ?`;
    const db_user = await db.get(query, [email]);

    if (!db_user) {
      console.log('User not found');
      return res.status(400).send('Invalid user');
    }

    //  Compare passwords
    const passwordMatch = await bcrypt.compare(password, db_user.password);

    if (!passwordMatch) {
      console.log('Incorrect password');
      return res.status(400).send('Invalid password');
    }

    //  Successful login
    console.log(`User ${db_user.name} logged in`);
    res.status(200).send(`User ${db_user.name} logged in`);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});




























initializeDB().then(() => {
  app.listen(port, () =>
    console.log('Server Running at http://localhost:3006/'),
  )
}) 



module.exports = {app}