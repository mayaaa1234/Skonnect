const showNotification = (
  message: string,
  type: "success" | "error" | "warning" | "info",
) => {
  const container =
    document.getElementById("notification-container") ||
    createNotificationContainer();

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  container.appendChild(notification);

  // Trigger animation
  requestAnimationFrame(() => notification.classList.add("show"));

  setTimeout(() => {
    notification.classList.add("hide");
    setTimeout(() => notification.remove(), 500); // waits for css opacity prop time in _notif.scss
  }, 3000);
};

const createNotificationContainer = () => {
  const container = document.createElement("div");
  container.id = "notification-container";
  document.body.appendChild(container);
  return container;
};

const notifySuccess = (msg: string) => showNotification(msg, "success");
const notifyError = (msg: string) => showNotification(msg, "error");
const notifyWarning = (msg: string) => showNotification(msg, "warning");
const notifyInfo = (msg: string) => showNotification(msg, "info");
