const express = require('express')
const router = express.Router()
const Vonage = require('@vonage/server-sdk')
const pg = require('pg')

const messages = []

const pool = new pg.Pool()


module.exports = () => {
  router.get('/', async (req,res) => {
    res.json({ message: 'Hello from the api 👋' })
  })

  router.post('/send', async (req,res) => {
    // phoneNumber string format: 16470000000
    const { text, phoneNumber } = req.body

    if (!text || !phoneNumber) res.send('text and phoneNumber required to send text')

    const vonage = new Vonage({
      apiKey: process.env.API_KEY,
      apiSecret: process.env.API_SECRET
    })

    const sender = process.env.SENDER_PHONE_NUMBER

    vonage.message.sendSms(sender, phoneNumber, text, (err,data) => {
      if (err) console.log(err)
      else {
        if (data.messages[0].status === '0') {
          messages.push({ text, sender, recipient: phoneNumber })

          console.log('Sent')
          console.dir(messages[messages.length - 1])
          res.send(`We've sent the text "${text}" to ${phoneNumber}!`)
      }
        else {
          console.log(`Error: ${data.messages[0]['error-text']}`)
          res.send('Error sending text 😢')
        }
      }
    })
  })

  router
    .route('/webhooks/inbound')
    .get((req,res) => {
      const params = Object.assign(req.query, req.body)

      messages.push({ text: params.text, sender: params.msisdn, recipient: params.to })

      console.log('Received')
      console.dir(messages[messages.length - 1])
      res.status(204).send('Received an SMS!')
    })
    .post((req,res) => {
      const params = Object.assign(req.query, req.body)

      messages.push({ text: params.text, sender: params.msisdn, recipient: params.to })

      console.log('Received')
      console.dir(messages[messages.length - 1])
      res.status(204).send('Received an SMS!')
    })

  router.get('/messages', async (req,res) => {
    const result = await pool.query('SELECT * FROM people')
    res.json({ messages: result.rows })
  })

  return router
}
