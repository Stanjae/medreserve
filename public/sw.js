// public/sw.js (Service Worker file)
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192x192.png', // Add your app icon
    badge: '/badge-72x72.png', // Add your badge icon
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/dismiss-icon.png'
      }
    ],
    requireInteraction: true, // Keep notification visible until user interacts
    tag: data.tag || 'default' // Group similar notifications
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'view' || !action) {
    // Open the app and navigate to relevant page
    event.waitUntil(
      clients.openWindow(getActionUrl(data))
    );
  } else if (action === 'dismiss') {
    // Just close the notification
    event.notification.close();
  }
});

// Helper function to determine where to navigate
function getActionUrl(data) {
  switch (data.type) {
    case 'new_appointment':
    case 'appointment_rescheduled':
    case 'appointment_confirmation':
      return `/appointments/${data.appointmentId}`;
    case 'appointment_cancelled':
      return '/appointments';
    case 'admin_notification':
      return '/admin/appointments';
    default:
      return '/dashboard';
  }
}

