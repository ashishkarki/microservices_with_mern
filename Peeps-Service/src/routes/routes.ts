import express, { Request, Response } from 'express'
import { Mongoose } from 'mongoose'

import PeepModel from '../models/peep'

// import few things
const ampq = require('amqplib')
const { randomBytes } = require('crypto')

// router
const router = express.Router()

// paths
router.get('/api/v1/peeps/:squawkId', (req: Request, res: Response) => {
  const squawkId = req.params.squawkId

  PeepModel.find({ squawkId }, (err, peeps) => {
    if (err) {
      res.status(500).send(err)
    }
    res.send(peeps)
  })
})

router.post('/api/v1/peeps/:squawkId', async (req: Request, res: Response) => {
  const { peep } = req.body
  const peepid = randomBytes(4).toString('hex')
  const squawkId = req.params.squawkId
  const peepData = {
    peepid,
    peep,
  }
  const msg = {
    peepid,
    peep,
    squawkId,
  }

  try {
    await PeepModel.updateOne({ squawkId }, { $push: { peeps: peepData } })
    console.log(`Peep ${peepid} added to squawk ${squawkId}`)

    // send message to queue
    const connection = await ampq.connect('amqp://rabbitmq-service:5672')
    console.log(`peeps api connected to rabbitmq`)

    const channel = await connection.createChannel()
    await channel.assertExchange('birdsquawk-exchange', 'topic', {
      durable: false,
    })
    console.log(`peeps api exchange created`)

    await channel.publish(
      'birdsquawk-exchange',
      'peep',
      Buffer.from(JSON.stringify(msg)),
    )
    console.log(`peeps api message published`)

    res.status(201).send(peepData)
  } catch (error) {
    res.status(500).send('Peeps service routes - error:' + error)
  }
})

export default router
