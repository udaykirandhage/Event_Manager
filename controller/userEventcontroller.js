const {getDB} = require('../Model/db')


const get_all_events = async(req,res)=>{
  try {
  const db  = getDB()
  const db_query = `select * from events;`
  const run_query = await db.all(db_query)
  res.send(run_query)
  }
  catch( err){
     res.status(500).json({ error: 'Failed to retrieve event', detail: err.message });
  }
  
}

const get_specific_event_details = async(req,res)=>{
  const id  = req.params.id;
 
  try {
  const db  = getDB()
  const db_query = `select * from events where event_code = ?`
  const run_query = await db.get(db_query,[id])
  if(!run_query){
    res.status(400).send('Could not find data')
  }
  res.send(run_query)
  console.log(run_query)
  }
 catch(err){
   res.status(500).json({ error: 'Failed to retrieve event', detail: err.message });
 }
  
}

const Event_register =  async (req, res) => {
  const { event_code } = req.params;
    const db  = getDB()
   const user_id = req.user; // from decoded JWT
  console.log(user_id)
  if (!event_code) {
    return res.status(400).json({ error: 'Missing event_code' });
  }
  try {
    const event = await db.get(
      `SELECT id, event_name, event_date FROM events WHERE event_code = ?`,
      [event_code]
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const alreadyRegistered = await db.get(
      `SELECT id FROM registration WHERE user_id = ? AND event_id = ?`,
      [user_id, event.id]
    );

    if (alreadyRegistered) {
      return res.status(409).json({ error: 'User already registered for this event' });
    }

    await db.run(
      `INSERT INTO registration (user_id, event_id) VALUES (?, ?)`,
      [user_id, event.id]
    );

    res.status(201).json({
      message: `Successfully registered for "${event.event_name}"`,
      registration_time: new Date().toISOString()
    });

  } catch (err) {
    res.status(500).json({ error: 'Registration failed', detail: err.message });
  }
}

const get_all_registrations =  async (req, res) => {
  const user_id = req.user;
const db  = getDB()

  try {
     const user = await db.get(
      `SELECT id, name, email FROM user WHERE email =? `,
      [user_id]
    );
    const query = `
      SELECT 
        e.id,
        e.event_name,
        e.event_code,
        e.event_name,
        e.event_date,
        e.location,
        r.registration_time
      FROM registration r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = ? 
      ORDER BY e.event_date ASC;
    `;

    const registrations = await db.all(query, [user_id]);

    if (registrations.length === 0) {
      return res.status(200).json({ message: 'No registrations found for this user.' });
    }

     res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      registrations: registrations
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registrations', detail: err.message });
  }
}

const deregister = async (req, res) => {
  const db = getDB(); 
  const user_id = req.user;
  const { event_code } = req.body;

  if (!event_code) {
    return res.status(400).json({ error: 'Missing event_code' });
  }

  try {
  
    const event = await db.get(
      `SELECT id, event_name FROM events WHERE event_code = ?`,
      [event_code]
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registration = await db.get(
      `SELECT id FROM registration WHERE user_id = ? AND event_id = ?`,
      [user_id, event.id]
    );

    if (!registration) {
      return res.status(404).json({ error: 'You are not registered for this event' });
    }
    await db.run(
      `DELETE FROM registration WHERE user_id = ? AND event_id = ?`,
      [user_id, event.id]
    );

    res.status(200).json({
      message: `Successfully canceled registration for "${event.event_name}"`,
      canceled_at: new Date().toISOString()
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel registration', detail: err.message });
  }
}

const put_details = async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { name, email, phone_num, age } = req.body;

  try {
   
    const existingUser = await db.get(
      `SELECT id FROM user WHERE email = ? AND id != ?`,
      [email, id]
    );

    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use by another user' });
    }

    await db.run(
      `UPDATE user SET name = ?, email = ?, phone_num = ?, age = ? WHERE id = ?`,
      [name, email, phone_num, age, id]
    );

    res.status(200).json({ message: 'User updated successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', detail: err.message });
  }
}


module.exports = {get_all_events,get_specific_event_details,Event_register,get_all_registrations,deregister,put_details}