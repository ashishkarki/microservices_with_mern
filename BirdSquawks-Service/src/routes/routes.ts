import express, { Request, Response } from 'express'
import BirdSquawkModel from '../models/birdsquawk'

import { randomBytes } from 'crypto'

const amqp = require('amqplib')

// router
const router = express.Router()

// paths
router.get('/api/v1/birdsquawk', (req: Request, res: Response) => {
  BirdSquawkModel.find({}, (err, birdsquawks) => {
    if (err) {
      res.send(err)
    }
    res.status(200).json(birdsquawks)
  })
})

router.post('/api/v1/birdsquawk', async (req: Request, res: Response) => {
  const { squawk } = req.body
  const squawkId = randomBytes(4).toString('hex')
  const squawkData = { squawk, squawkId }

  try {
    const newBirdSquawk = new BirdSquawkModel(squawkData)
    await newBirdSquawk.save()
    console.log(`Saved BirdSquawk to DB..`)

    const connection = await amqp.connect('amqp://rabbitmq-service:5672')
    console.log(`Connected to RabbitMQ`)

    const channel = await connection.createChannel()
    console.log(`Created RabbitMQ channel`)

    await channel.assertExchange('birdsquawk', 'topic', { durable: false })
    console.log(`Asserted RabbitMQ exchange`)

    await channel.publish(
      'birdsquawk',
      'squawk',
      Buffer.from(JSON.stringify(squawkData)),
    )
    console.log(`Published to RabbitMQ`)

    res.status(201).json(squawkData)
  } catch (error) {
    res.status(500).send(error)
  }
})

export default router
