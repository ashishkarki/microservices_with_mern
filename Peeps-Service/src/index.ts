import express from 'express'
import moongoose from 'mongoose'
import PeepModel from './models/peep'
import router from './routes/routes'

const amqp = require('amqplib')

async function processSquawkMsg(msg: { content: { toString: () => any } }) {
  const content = JSON.parse(msg.content.toString())
  const { squawkId } = content
  console.log(
    `Peeps service - processSquawkMsg - squawkId: ${squawkId}, content: ${content}`,
  )

  const peepData = {
    squawkId,
    peeps: [],
  }

  try {
    const newPeep = new PeepModel(peepData)
    await newPeep.save()
    console.log(`Peep ${squawkId} added to squawk ${squawkId}`)
  } catch (error) {
    console.log(`Peeps service - processSquawkMsg - error: ${error}`)
  }
}

const app = express()

app.use(express.json())
app.use(router)

const Startup = async () => {
  try {
    await moongoose.connect('mongodb://peep-mongo-service:27017/peep')
    console.log('peeps-Service - index.ts - Connected to MongoDB')

    const connection = await amqp.connect(
      'amqp://rabbitmq-service:5672',
      'heartbeat-30',
    )
    console.log('peeps-Service - index.ts - Connected to RabbitMQ')

    const channel = await connection.createChannel()
    await channel.assertExchange('birdsquawk-exchange', 'topic', {
      durable: false,
    })
    console.log('peeps-Service - index.ts - Exchange created')

    await channel.assertQueue('peeps-squawk-queue', {
      durable: false,
    })
    await channel.bindQueue(
      'peeps-squawk-queue',
      'birdsquawk-exchange',
      'squawk.#',
    )
    await channel.consume(
      'peeps-squawk-queue',
      async (msg: { content: { toString: () => any } }) => {
        console.log('Peeps service - index.ts - message received')

        await processSquawkMsg(msg)
        await channel.ack(msg)
      },
      { noAck: false },
    )
  } catch (error) {
    console.error('Peeps service - index.ts error!!! ' + error)
  }

  app.listen(5051, () => {
    console.log('BirdSquawk Service is running on port 5051')
  })
}

Startup()
