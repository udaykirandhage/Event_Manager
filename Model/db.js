const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')

let db

const initializeDB = async () => {
  db = await open({
    filename: path.join(__dirname, 'EventManagement.db'),
    driver: sqlite3.Database,
  })
  return db
}

const getDB = () => {
  if (!db) {
    throw new Error('DB not initialized. Call initializeDB() first.')
  }
  return db
}

module.exports = {initializeDB, getDB}
