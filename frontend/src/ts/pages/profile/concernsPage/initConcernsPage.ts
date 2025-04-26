import { html } from "lit-html";

export default async function initConcernsPage() {
  loadDOM();

  const action = sessionStorage.getItem(SELECTED_BTN_STATUS) ?? DEFAULT_ACTION;
  highlightBtnAndSaveToSession(action);
}

interface Concern {
  id: number;
  message: string;
  concern_owner_username: string;
  concern_owner_email: string;
  // by/from admin:
  status: "rejected" | "acknowledged" | "in_progress" | "resolved";
  response: string;
}

const STATUS_BUTTONS = [
  { action: "default", label: "Default" },
  { action: "rejected", label: "Reject" },
  { action: "acknowledged", label: "Acknowledge" },
  { action: "in_progress", label: "Process" },
  { action: "resolved", label: "Resolve" },
] as const;

const container = document.getElementById("data-container") as HTMLElement;

// DOM

function renderConcernItem(c: Concern): string {
  const imgUrl = `assets/img/${
    c.id % 2 ? "default-profile1.png" : "default-profile2.png"
  }`;

  return `
    <li class="concern p-1 mb-3 br-10">
      <div class="concern-controls mb-1 dp-f ai-c jc-fe gp-10">
        ${STATUS_BUTTONS.map(
          ({ action, label }) => `
          <button
            data-action="${action}"
            class="btn-outlined-dark-accent br-20 p-1 status-btn"
          >${label}</button>
        `,
        ).join("")}
      </div>

      <div class="user-info mb-1 dp-f ai-c gp-10">
        <img
          class="profile-pic"
          style="width:30px;border-radius:50%;"
          src="${imgUrl}"
          alt="@${c.concern_owner_username}"
        />
        <h4>@${c.concern_owner_username}</h4>
      </div>

      <p style="white-space:normal;" class="msg ellipsis">
        ${c.message}
      </p>
    </li>
  `;
}

async function loadDOM(): Promise<void> {
  const concerns: Concern[] = await getAllConcerns();
  const itemsHtml = concerns.map(renderConcernItem).join("");

  container.innerHTML = `
    <div class="p-1 concerns-container container dp-f ai-c fd-c jc-c gp-60 mt-4">
      <div class="p-1 border-subtle-effect br-20 concerns-manager">
        <ul class="lst-n p-1 pt-2 pb-2 concerns-list">
          ${itemsHtml}
        </ul>
      </div>

      <aside id="concerns-aside-box" class="concerns-aside-box">
        <div class="br-20 border-subtle-effect aside concerns-box">
          <!-- aside markup remains unchanged -->
        </div>
      </aside>
    </div>
  `;
}

// Events

const DEFAULT_ACTION = "default";
const SELECTED_BTN_STATUS = "selectedBtn";

const statusBtns = document.querySelectorAll<HTMLButtonElement>(".status-btn");

function highlightBtnAndSaveToSession(action: string) {
  statusBtns.forEach((b) => {
    b.classList.toggle("selected", b.dataset.action === action);
  });
  sessionStorage.setItem(SELECTED_BTN_STATUS, action);
}

function initEvents() {
  statusBtns.forEach((b) => {
    const status = b.dataset.action;
    b.addEventListener("click", () => {
      updateConcernStatus();
    });
  });
}

// document.querySelector();

// Fetches

async function getAllConcerns(): Promise<Concern[]> {
  const res = await fetch("/api/v1/concerns", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

async function submitConcern(): Promise<void> {
  const res = await fetch("/api/v1/concerns", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  // return await res.json();
}

async function updateConcernStatus(): Promise<void> {
  const res = await fetch("/api/v1/concerns/:id", {
    method: "PUT",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
}
