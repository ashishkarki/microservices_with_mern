import express, { Request, Response } from 'express'

// router
const router = express.Router()

// paths
router.get('/api/v1/birdsquawk/get', (req: Request, res: Response) => {
  res.send('BirdSquawk Service is running on port 5050')
})

router.post('/api/v1/birdsquawk/post', (req: Request, res: Response) => {})

export default router
