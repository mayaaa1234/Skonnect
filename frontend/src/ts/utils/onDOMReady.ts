export default function onDOMReady(callback: () => void | Promise<void>) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}
