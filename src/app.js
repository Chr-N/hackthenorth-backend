module.exports = () => {
  const express = require('express')
  const app = express()
  const apiRoute = require('./routes/api')()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static('public'))

  app.use('/api' , apiRoute)

  return app
}
