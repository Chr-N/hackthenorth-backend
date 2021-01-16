const express = require('express')
const router = express.Router()
const Vonage = require('@vonage/server-sdk')

module.exports = () => {
  router.get('/', async (req,res) => {
    res.json({ message: 'Hello from the api 👋' })
  })

  router.post('/send', async (req,res) => {
    const { text } = req.body

    const vonage = new Vonage({
      apiKey: process.env.API_KEY,
      apiSecret: process.env.API_SECRET
    })

    const from = process.env.FROM
    const to = process.env.TO

    vonage.message.sendSms(from, to, text, (err,data) => {
      if (err) console.log(err)
      else {
        if (data.messages[0].status === '0') console.log(`Sent "${text}" to ${to}!`)
        else console.log(`Error: ${data.messages[0]['error-text']}`)
      }
    })

    res.send(`We've sent the text "${text}" to ${to}!`)
  })

  router.route('/webhooks/inbound')
    .get((req,res) => {
      const params = Object.assign(req.query, req.body)
      console.log(params)
      res.status(204).send('Received SMS!')
    })
    .post((req,res) => {
      const params = Object.assign(req.query, req.body)
      console.log(params)
      res.status(204).send('Received SMS!')
    })


  return router
}
