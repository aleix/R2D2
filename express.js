const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/static', express.static('static'));