const express = require('express')
const router = express.Router()

module.exports = () => {
  router.get('/', async (req,res) => {
    res.json({ message: 'Hello from the api 👋' })
  })

  return router
}
