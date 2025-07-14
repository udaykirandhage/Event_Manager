const {getDB} = require('../Model/db')
const express = require('express')
const bcrypt = require('bcrypt')
const Joi = require('joi');
const {validateSignup,validateSignin }= require('../validator/Joi.validator')
const nodeMailer = require('nodemailer')
const transporter= require('../Email/email')

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

module.exports = {register}