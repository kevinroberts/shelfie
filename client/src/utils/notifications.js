

export function notifyUser(title, message, icon) {

  let options = {
    body: message,
    icon: icon
  };

  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    return null;
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification

    const notification = new Notification(title,options);
    setTimeout(notification.close.bind(notification), 4000);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(title,options);
      }
    });
  }
}