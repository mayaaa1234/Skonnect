const maxNotif = 4;

const showNotification = (
  message: string,
  type: "success" | "error" | "warning" | "info" | "gradient",
  instant = false,
) => {
  const container =
    document.getElementById("notification-container") ||
    createNotificationContainer();

  if (container.children.length >= maxNotif) return;

  const notification = document.createElement("div");
  notification.className = `notification ${type} ${instant ? "no-animation" : ""}`;
  notification.textContent = message;

  container.appendChild(notification);

  if (!instant) {
    requestAnimationFrame(() => notification.classList.add("show"));
  } else {
    requestAnimationFrame(() =>
      notification.classList.add("show.no-animation"),
    );
  }

  setTimeout(() => {
    notification.classList.add("hide");
    setTimeout(() => notification.remove(), 400); // this waits for the the opacity fade time set in _notif.scss
  }, 3500);
};

const createNotificationContainer = () => {
  const container = document.createElement("div");
  container.id = "notification-container";
  document.body.appendChild(container);
  return container;
};

export const notifyGradient = (msg: string, instant = false) =>
  showNotification(msg, "gradient", instant);

export const notifySuccess = (msg: string, instant = false) =>
  showNotification(msg, "success", instant);

export const notifyError = (msg: string, instant = false) =>
  showNotification(msg, "error", instant);

export const notifyWarning = (msg: string, instant = false) =>
  showNotification(msg, "warning", instant);

export const notifyInfo = (msg: string, instant = false) =>
  showNotification(msg, "info", instant);
