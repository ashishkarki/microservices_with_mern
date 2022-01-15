import express from 'express'
import moongoose from 'mongoose'
import router from './routes/routes'

const app = express()

app.use(express.json())
app.use(router)

const Startup = async () => {
  try {
    await moongoose.connect(
      'mongodb://birdsquawk-mongo-service:27017/birdsquawk',
    )
    console.log('BS-Service - index.ts - Connected to MongoDB')
  } catch (error) {
    console.error('BS-Service - index.ts error!!! ' + error)
  }

  app.listen(5050, () => {
    console.log('BirdSquawk Service is running on port 5050')
  })
}

Startup()
