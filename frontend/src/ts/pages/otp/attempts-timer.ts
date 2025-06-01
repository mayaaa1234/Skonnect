import {
  setSubmitDisabled,
  setInputDisabled,
  setResendDisabled,
} from "./disableFormEl.ts";
const errDiv = document.querySelector(".error-div") as HTMLDivElement;
const resendErrDiv = document.querySelector(
  ".resend-err-div",
) as HTMLDivElement;

export function renderAttemptsLeft(attemptsLeft: number): void {
  const attemptsDiv = document.querySelector(".attempts-left");
  if (attemptsDiv) {
    attemptsDiv.innerHTML = `Attempts Left: <span class="${attemptsLeft === 0 ? "text-error" : ""}">${attemptsLeft}<span/>`;
  }
}

let cooldownTimerIntervalId: number | null = null;

function renderResendCooldown(cooldown: string): void {
  const cd = new Date(cooldown);
  if (isNaN(cd.getTime())) {
    console.error("Invalid cooldown date:", cd);
    return;
  }

  const now = new Date();
  const cooldownLeft = cd.getTime() - now.getTime();

  setResendDisabled(true);

  if (cooldownLeft <= 0) {
    errDiv.textContent = "";
    resendErrDiv.textContent = "";
    setResendDisabled(false);
    return;
  }

  const minutes = Math.floor(cooldownLeft / 60000);
  const seconds = Math.floor((cooldownLeft % 60000) / 1000);
  resendErrDiv.innerHTML = `<p class="text-error fs-n1-xs">Too many requests please wait for ${minutes}m ${seconds}s to request a new OTP again</p>`;
}

export function renderResendCooldownInInterval(cd: string) {
  if (cooldownTimerIntervalId !== null) clearInterval(cooldownTimerIntervalId);
  renderResendCooldown(cd);
  cooldownTimerIntervalId = Number(
    setInterval(() => renderResendCooldown(cd), 1000),
  );
}

let expiredTimerIntervalId: number | null = null;

function renderExpiresAt(expiresAt: string): void {
  const expiry = new Date(expiresAt);
  if (isNaN(expiry.getTime())) {
    console.error("Invalid expiry date:", expiresAt);
    return;
  }

  const now = new Date();
  const diff = expiry.getTime() - now.getTime();

  const timeLeftDiv = document.querySelector(".time-left");
  if (!timeLeftDiv) return;

  if (diff <= 0) {
    errDiv.textContent = "OTP expired, please request a new OTP";
    clearTimer();
    clearAttempts();
    setInputDisabled(true);
    setSubmitDisabled(true);
    return;
  }

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  timeLeftDiv.textContent = `Expires In: ${minutes}m ${seconds}s`;
}

export function renderExpiresAtInInterval(expiresAt: string) {
  if (expiredTimerIntervalId !== null) clearInterval(expiredTimerIntervalId);
  renderExpiresAt(expiresAt);
  expiredTimerIntervalId = Number(
    setInterval(() => renderExpiresAt(expiresAt), 1000),
  );
}

export function clearTimer() {
  const timeLeftDiv = document.querySelector(".time-left");

  if (timeLeftDiv) timeLeftDiv.textContent = "";

  if (expiredTimerIntervalId !== null) {
    clearInterval(expiredTimerIntervalId);
    expiredTimerIntervalId = null;
  }
}

export function clearAttempts() {
  const attemptsDiv = document.querySelector(".attempts-left");
  if (attemptsDiv) attemptsDiv.textContent = "";
}
