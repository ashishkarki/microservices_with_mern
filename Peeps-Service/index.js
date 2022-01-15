import express from 'express'
import { randomBytes } from 'crypto'

const app = express()
app.use(express.json())

// app logic
const peepsBySquawkId = {}

app.get('/birdsquawk/:id/peeps', (req, res) => {
  // the squawk id for which peeps are to be get
  const squawkId = req.params.id

  res.status(200).send(peepsBySquawkId[squawkId] || [])
})

app.post('/birdsquawk/:id/peeps', (req, res) => {
  // the squawk id for which peeps are to be posted
  const squawkId = req.params.id

  // generate a random id for the new peep
  const newPeepId = randomBytes(8).toString('hex')

  // get the peep data from the request body
  const { peep } = req.body

  // get peeps for this squawk id
  const peeps = peepsBySquawkId[squawkId] || []

  // push the new peep into peeps array
  peeps.push({
    id: newPeepId,
    peep,
  })

  // set updated peeps for this squawk id
  peepsBySquawkId[squawkId] = peeps

  res.status(201).send(peeps)
})

app.listen(5051, () => {
  console.log('Peeps-Service listening on port 5051')
})
