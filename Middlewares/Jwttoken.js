const jwt = require('jsonwebtoken');
const secret_key = process.env.secret_key;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send('Authorization header missing');
  }

  const jwtToken = authHeader.split(' ')[1];
  if (!jwtToken) {
    return res.status(401).send('JWT token missing');
  }

  jwt.verify(jwtToken, secret_key, (error, payload) => {
  if (error) {
    return res.status(401).send('Invalid JWT token');
  }

  req.user = payload;
  next();
});

};

module.exports = { authenticateToken };
