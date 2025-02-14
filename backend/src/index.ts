import express, { Handler } from 'express'
import webPush from 'web-push'
import cors from 'cors'
import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: '*', // Allow all origins
  })
)

const pool = new Pool({
  connectionString: process.env['POSTGRES_URI'],
})

const createSubscriptionTable = async () => {
  const data = await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    expirationTime TIMESTAMP DEFAULT NOW() + INTERVAL '1 hour',
    subscription JSONB NOT NULL
  );`)
  console.log({ data })
}
createSubscriptionTable()

webPush.setVapidDetails(
  'mailto:olorunnisholaolamilekan@gmail.com',
  process.env['SW_PUBLIC_KEY']!,
  process.env['SW_PRIVATE_KEY']!
)

const subscribeHandler: Handler = async function (req, res) {
  const subscription = req.body.subscription // Get the subscription object from the request body
  console.log('Received Subscription:', req.body.subscription)
  if (!subscription) {
    res.status(400).json({ error: 'Subscription is required' })
    return
  }

  // Save the subscription to the database
  const data = await pool.query(
    `
    INSERT INTO subscriptions (user_id, subscription)
    VALUES ($1, $2)
    ON CONFLICT (user_id)
    DO UPDATE SET 
      subscription = $2,
      expirationTime = NOW() + INTERVAL '1 hour';
    `,
    [1, subscription]
  )
  console.log('saved subscription!', { data })
  res.status(201).json({ message: 'Subscription saved successfully!' })
}

const notifyHandler: Handler = async function (req, res) {
  const { message, title } = req.body
  const userId = req.params['id']
  if (!message || !title) {
    res.status(400).json({ error: 'Message and title are required' })
    return
  }

  // Get the user's subscription from the database
  const data = await pool.query(
    `SELECT * FROM subscriptions WHERE user_id = $1`,
    [userId]
  )
  console.log({ data })
  const subscription = data.rows[0].subscription

  if (!subscription) {
    res.status(400).json({ error: 'Subscription not found' })
    return
  }

  // Send the notification to the subscribed user
  try {
    await webPush.sendNotification(
      subscription,
      JSON.stringify({ title, message })
    )
    res.status(200).json({ message: 'Notification sent successfully!' })
  } catch (err) {
    console.error('Error sending notification', err)
  }
}
app.post('/api/subscribe', subscribeHandler)
app.post('/api/notify/:id', notifyHandler)

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
