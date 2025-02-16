'use client'
import React, { useEffect } from 'react'

function Provider() {
  const publicKey =
    'BF6O-WXOV0rtMHhPqCMe_SO-OrXPIA-v6JTNPuR_rTvudgBPXOWvYO2SE2Y26hHqEPQU8-wfn2eQlu_jLAjNv4I' // Replace with actual public key

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
  const convertedKey = urlBase64ToUint8Array(publicKey)
  console.log('Converted Key:', convertedKey, 'Length:', convertedKey.length)

  useEffect(() => {
    console.log({ navigator, window })
    if ('serviceWorker' in navigator && 'Notification' in window) {
      console.log('Service Worker and Notification are supported.')
      const registerWorker = async function () {
        try {
          // Register the service worker
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log(
            'Service Worker registered with scope:',
            registration.scope
          )

          // Request notification permission
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            console.log('Notification permission granted.')

            navigator.serviceWorker.ready.then(async registration => {
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicKey,
              })

              console.log({ subscription })
              fetch(`${process.env['NEXT_PUBLIC_BASE_URL']}/api/subscribe`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription }),
              })
                .then(response => response.json())
                .then(data => {
                  console.log('Subscription sent to server:', data)
                })
                .catch(error => {
                  console.error('Error sending subscription to server:', error)
                })
              console.log('Push Subscription:', subscription)
            })

            // Send a test notification
            registration.showNotification('Hello!', {
              body: 'This is your test notification from frontend!',
              icon: '/vercel.svg',
            })
          } else {
            console.warn('Notification permission denied.')
          }
        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }

      registerWorker()
    }
  }, [])
  return <span></span>
}

export default Provider
