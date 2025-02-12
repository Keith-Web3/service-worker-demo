import express, { Handler } from "express";
import webPush from "web-push";
import cors from "cors";

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all origins
  })
);

webPush.setVapidDetails(
  "mailto:olorunnisholaolamilekan@gmail.com",
  "BF6O-WXOV0rtMHhPqCMe_SO-OrXPIA-v6JTNPuR_rTvudgBPXOWvYO2SE2Y26hHqEPQU8-wfn2eQlu_jLAjNv4I",
  "VWwnQcL1ypDILEra2l-pLVHCO43GwXJkT1llbiFCRCs"
);

const subscribeHandler: Handler = async function (req, res) {
  const subscription = req.body.subscription; // Get the subscription object from the request body
  console.log("Received Subscription:", req.body.subscription);
  if (!subscription) {
    res.status(400).json({ error: "Subscription is required" });
    return;
  }

  // Payload for the notification
  const payload = JSON.stringify({
    title: "Test Notification",
    message: "This is a test push notification.",
  });

  // Send the notification to the subscribed user
  try {
    await webPush.sendNotification(subscription, payload);
    res.status(200).json({ message: "Notification sent successfully!" });
  } catch (err) {
    console.error("Error sending notification", err);
  }
};
app.post("/api/subscribe", subscribeHandler);

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
