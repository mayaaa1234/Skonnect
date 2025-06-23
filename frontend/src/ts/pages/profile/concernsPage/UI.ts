import html from "@utils/htmlTemp.ts";
import { Concern, fetchAllConcerns, filterConcerns } from "./api.ts";
import { DEFAULT_CONCERN_STATUS, STATUSES } from "./constants.ts";
import session from "express-session";
import { parse } from "path";
import { formatStatus, renderCurrentStatus } from "./utils.ts";

const container = document.getElementById("data-container") as HTMLElement;

const detailsPopup = (): string => {
  return html`
    <div class="status-details-popup-overlay dp-n ">
      <!-- POPUP -->
      <div class="status-details-popup border-thin gp-25 br-10 dp-f fd-c">
        <div class="border-bottom-thin popup-header container dp-f ai-c jc-sb">
          <h4 class="text-dark-accent fs-2-xs">Concern Details</h4>
          <button class="btn-no-hover close-status-popup-btn">
            <span class="fs-3-xs">&#10005;</span>
          </button>
        </div>

        <div class="popup-body container dp-f fd-c gp-20">
          <div class="mb-2 set-status-container">
            <h3 class="mb-1">Status</h3>

            <div
              class="status-btn-control-container border-thin br-10 p-1 dp-f gp-25 jc-c ai-c"
            >
              <button
                data-action="default"
                class="status-btn selected btn btn-no-hover br-20 p-1"
              >
                <span class="default bgc-gray concern-popup-circle"></span>
                Default
              </button>

              <button
                data-action="rejected"
                class="status-btn btn btn-no-hover br-20 p-1"
              >
                <span class="rejected bgc-mac-red concern-popup-circle"></span>
                Rejected
              </button>

              <button
                data-action="acknowledged"
                class="status-btn btn btn-no-hover br-20 p-1"
              >
                <span
                  class="acknowledged bgc-mac-blue concern-popup-circle"
                ></span>
                Acknowledged
              </button>

              <button
                data-action="in_progress"
                class="status-btn btn btn-no-hover br-20 p-1"
              >
                <span
                  class="in-progress bgc-progress concern-popup-circle"
                ></span>
                In Progress
              </button>

              <button
                data-action="resolved"
                class="status-btn btn btn-no-hover br-20 p-1"
              >
                <span
                  class="resolved bgc-mac-green concern-popup-circle"
                ></span>
                <span>Resolved</span>
              </button>
            </div>
          </div>

          <div class="">
            <h3 class="mb-1">
              Response <span class="muted-2 fs-n1-xs">(optional)</span>
            </h3>
            <textarea
              style="width: 100%;"
              class="br-10 border-thin concern-response-textarea"
              w-100
              rows="9"
              name=""
              id=""
            >
            </textarea>
          </div>

          <div class="dp-f jc-e gp-10">
            <button
              class="cancel-status-popup-btn br-20 p-1 btn btn-outlined-dark-accent"
            >
              Cancel
            </button>
            <button
              class="save-status-popup-btn br-20 p-1 btn btn-dark-accent w-80px"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderPreConcernStatusRender = (c: Concern) => {
  return html`
    <div
      data-status="${c.status}"
      data-status-id="${c.id}"
      class="pre-ctrl border-bottom-thin dp-f jc-sb ai-c p-1"
    >
      <p class="">
        <span style="padding-right: 5px" class="">Current Status:</span>
        <span class="concern-item-header">
          ${renderCurrentStatus(c.status)} ${formatStatus(c.status)}</span
        >
      </p>

      <div class="more-wrapper">
        <button
          class="
btn btn-no-hover more-btn"
        >
          ⋮
        </button>
        <div class="dp-n more-popup br-10 border-thin">
          <ul class="p-1 dp-f fd-c gp-5  h-auto w-200px">
            <li data-status-id="${c.id}" class="open-details-popup">Details</li>
            <li data-status-id="${c.id}" class="del-concern text-error del">
              Delete
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;
};

// function renderConcernStatusBtn(c: Concern): string {
//   return ` <div
//     class="concern-controls p-1  dp-n ai-c jc-fe gp-10"
//     data-current-status="${c.status}"
//     data-status-id="${c.id}"
//   >
//     ${STATUSES.map(
//       ({ action, label }) => `
//       <button
//         data-action="${action}"
//         style="${action === "delete" ? "border: 1px solid red !important" : ""}"
//         class="btn-outlined-dark-accent br-20 p-1 mb-1 status-btn"
//       >${label}</button>
//     `,
//     ).join("")}
//   </div>`;
// }

function renderConcernItem(c: Concern): string {
  const imgUrl = `assets/img/${
    c.id % 2 ? "default-profile1.png" : "default-profile2.png"
  }`;

  return `
    <div 
style="border-bottom: initial !important"
class="concern p-1 pb-0 mb-1">

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
    </div>
  `;
}

function renderConcernList(
  concerns: Concern[],
  status?: Concern["status"],
  adjustEmptyListPos: boolean = false,
): string {
  const list = status ? filterConcerns(concerns, status) : concerns;

  if (list.length === 0) {
    return `
      <div 
          style="
                position: absolute;
                top: ${adjustEmptyListPos ? "75%" : "50%"};
                left: 50%;
                transform: translate(-50%, -50%);
          "
          class="muted-2 empty-concern-list-container">
                  <p class="empty-concern-list">Empty list...</p>
      </div>
    `;
  }

  return list.map(renderConcernItem).join("");
}

function renderAsideList(
  concerns: Concern[],
  status?: Concern["status"],
  adjustEmptyListPos: boolean = false,
): string {
  const list = status ? filterConcerns(concerns, status) : concerns;

  if (list.length === 0) {
    return `
      <div 
          style="
                position: absolute;
                top: ${adjustEmptyListPos ? "75%" : "50%"};
                left: 50%;
                transform: translate(-50%, -50%);
          "
          class="muted-2 empty-concern-list-container">
                  <p class="empty-concern-list">Empty list...</p>
      </div>
    `;
  }

  return list.map(renderAsideItem).join("");
}

function renderAsideItem(c: Concern): string {
  const imgUrl = `assets/img/${
    c.id % 2 ? "default-profile1.png" : "default-profile2.png"
  }`;

  return html`
    <div
      style="min-height: 100px;
       overflow-y: scroll;"
      class="dp-f fd-c concern aside-concern-item p-1 mb-2 border-thin br-10"
      data-status-id="${c.id}"
    >
      <div class="user-info mb-1 dp-f ai-c gp-10">
        <img
          class="profile-pic"
          style="width:30px;border-radius:50%;"
          src="${imgUrl}"
          alt="@${c.concern_owner_username}"
        />
        <h4>@${c.concern_owner_username}</h4>
      </div>

      <p style="white-space:normal;" class="msg">${c.message}</p>

      <div class="border-top-thin mt-1 pt-1 dp-f fd-c ai-e response-wrapper">
        ${c.response
          ? html`<button class="btn-no-hover underline toggle-response-btn">
              View response
            </button>`
          : html`<p>No response</p>`}

        <div
          style="
            white-space: normal;
            overflow-wrap: break-word;
            word-break: break-word;"
          class="w-100 response-content dp-f jc-c"
        >
          <p>${c.response ? c.response.trim() + "." : ""}</p>
        </div>
      </div>
    </div>
  `;
}

async function loadDOM(): Promise<void> {
  const concerns: Concern[] = await fetchAllConcerns();
  sessionStorage.setItem("concerns", JSON.stringify(concerns));

  const listHtml = concerns.length
    ? concerns
        .map(
          (c) => html`
            <li
              style="min-height: 100px; overflow-y: scroll;"
              class="concern-item border-thin mb-2 br-10"
            >
              ${renderPreConcernStatusRender(c)} ${renderConcernItem(c)}
            </li>
          `,
        )
        .join("")
    : `
      <li class="">
        <p
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
          class="empty-concern-list muted-2"
        >
          Empty List…
        </p>
      </li>
    `;

  container.innerHTML = `
    ${detailsPopup()}

<div class=" p-1 concerns-container container dp-f ai-c fd-c jc-c mt-4">
  <div 
          style="position: relative;"
    class="p-1 border-subtle-effect br-20 concerns-manager">
    <ul class=" lst-n p-1 pt-2 pb-2 concerns-list">
          ${listHtml}
    </ul>
  </div>

  <aside id="concerns-aside-box" class="container concerns-aside-box">
      <div class="br-20 border-subtle-effect aside concerns-box">
            <div class="dp-f concern-view-controls">
              <div data-status="rejected" class="ta-c concern-status selected">
                <span class="rejected bgc-mac-red concern-popup-circle"></span>
                <p>Rejected</p>
              </div>

              <div data-status="acknowledged" class="ta-c concern-status ">
                <span class="acknowledged bgc-mac-blue concern-popup-circle"></span>
                <p>Acknowlegded</p>
              </div>

              <div data-status="in_progress" class="ta-c concern-status">
                <span class="in-progress bgc-progress concern-popup-circle"></span>
                <p>In Progress</p>
              </div>

              <div data-status="resolved" class="ta-c concern-status">
                <span class="resolved bgc-mac-green concern-popup-circle"></span>
                <p>Resolved</p>
              </div>
            </div>


            <div style="height: 542px;
            padding-top: 30px; padding-bottom: 30px;"
            class="aside-concern-view-status overflow-y-scroll concern-popup-body p-2">
                ${renderAsideList(concerns, "rejected")}
            </div>
      </div>
  </aside>
</div>
`;
}

export {
  loadDOM,
  renderConcernItem,
  renderConcernList,
  renderAsideList,
  renderAsideItem,
};
