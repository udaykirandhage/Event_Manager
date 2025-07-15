const express = require('express')
const EventController = require('../controller/userEventcontroller')
const {authenticateToken} = require('../Middlewares/Jwttoken')

const Eventrouter = express.Router()

Eventrouter.get('/events/',authenticateToken,EventController.get_all_events)
Eventrouter.get('/events/:id',authenticateToken,EventController.get_specific_event_details)
Eventrouter.post('/events/:event_code',authenticateToken,EventController.Event_register);
Eventrouter.get('/event/registration',authenticateToken,EventController.get_all_registrations)
Eventrouter.delete('/events',authenticateToken,EventController.deregister)

module.exports = {Eventrouter}