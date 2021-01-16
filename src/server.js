const dotenv = require('dotenv')
const app = require('./app')()

dotenv.config()

// pass app its dependencies:
const port = process.env.PORT || 8000

app.listen(port , () => {
  console.log(`Listening to the port ${port}`)
})
