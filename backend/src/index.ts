import express, { Handler } from 'express'
import webPush from 'web-push'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: '*', // Allow all origins
  })
)

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

  // Payload for the notification
  const payload = JSON.stringify({
    title: 'Test Notification',
    message: 'This is a test push notification.',
  })

  // Send the notification to the subscribed user
  try {
    await webPush.sendNotification(subscription, payload)
    res.status(200).json({ message: 'Notification sent successfully!' })
  } catch (err) {
    console.error('Error sending notification', err)
  }
}
app.post('/api/subscribe', subscribeHandler)

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
