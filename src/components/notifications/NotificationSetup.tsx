'use client';
import { useEffect, useState } from 'react';
import { requestNotificationPermission, subscribeUserToPush } from '@/lib/notificationSystem/config';

export default function NotificationSetup({ userId, userType }) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      const permissionGranted = await requestNotificationPermission();
      
        if (permissionGranted) {
          console.log('hunt', userId, userType);
        await subscribeUserToPush(userId, userType);
        setIsSubscribed(true);
        setPermission('granted');
        console.log('Successfully subscribed to notifications');
      }
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Your browser doesnt support push notifications.
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Notifications are blocked. Please enable them in your browser settings.
      </div>
    );
  }

  if (permission === 'granted' && isSubscribed) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        ✅ You are subscribed to notifications!
      </div>
    );
  }

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
      <p className="mb-2">Stay updated with appointment notifications!</p>
      <button
        onClick={handleSubscribe}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Enable Notifications
      </button>
    </div>
  );
}