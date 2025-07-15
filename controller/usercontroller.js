const {getDB} = require('../Model/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validateSignup,validateSignin }= require('../validator/Joi.validator')
const transporter= require('../Email/email')
const secret_key = process.env.secret_key

const register = async (req, res) => {
    const db = getDB();
  const { name, email, phone_num, age, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if the email already exists
  const check_user_query = await db.get(`SELECT * FROM user WHERE email = ?`, [email]);
  
  if (check_user_query === undefined) {
    const { error,value } = validateSignup(req.body);
    
    if (error) {
      console.log(error);
      return res.status(400).send(error.details); // send validation error
    }

    try {
      await db.run(
        `INSERT INTO user (name, email, phone_num, age, password, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, phone_num, age, hashedPassword, role]
      );
      console.log('User created');
      res.status(201).send('User created successfully');
      const options={
        from:"udaykirandhage@gmail.com",
        to:email,
        subject:"I was testing the Node Js auth",
        html: `<h1> User created successfully </h1>
        <p1> User name = ${name}</p1>`
}
transporter.sendMail(options,function(err,info){
    if(err){
        console.log(err)
    }
    else{
        console.log('sent email',name)
    }
})

    } catch (err) {
      console.error( err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(409).send('Conflict: User already exists');
  }
}


//Login 

const login = async (req, res) => {
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
    const jwtToken = jwt.sign(email,secret_key)
    res.send(jwtToken)
    console.log(`User ${db_user.name} logged in`);
    // res.status(200).send(`User ${db_user.name} logged in`);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
}


module.exports = {register,login}