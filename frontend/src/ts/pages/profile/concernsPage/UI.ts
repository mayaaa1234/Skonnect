import { Concern, fetchAllConcerns, filterConcerns } from "./api.ts";
import { DEFAULT_CONCERN_STATUS, STATUS_BUTTONS } from "./constants.ts";

const container = document.getElementById("data-container") as HTMLElement;

function renderConcernStatusBtn(c: Concern): string {
  return `
  <div class="concern-controls mb-1 dp-f ai-c jc-fe gp-10"
       data-current-status="${c.status}"
       data-status-id="${c.id}">
    ${STATUS_BUTTONS.map(
    ({ action, label }) => `
      <button
        data-action="${action}"
        style="${action === "delete" ? "border: 1px solid red !important" : ""}"
        class="btn-outlined-dark-accent br-20 p-1 mb-1 status-btn"
      >${label}</button>
    `,
  ).join("")}
  </div>`;
}

function renderConcernItem(c: Concern): string {
  const imgUrl = `assets/img/${c.id % 2 ? "default-profile1.png" : "default-profile2.png"
    }`;

  return `
    <div 
style="border-bottom: 1px solid var(--foreground-soft);"
class="concern p-1 mb-1">

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
  adjustEmptyListPos: boolean = false
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

async function loadDOM(): Promise<void> {
  const concerns: Concern[] = await fetchAllConcerns();

  const listHtml = concerns.length
    ? concerns
      .map(c => `
          <li>
            ${renderConcernStatusBtn(c)}
            ${renderConcernItem(c)}
          </li>
        `)
      .join("")
    : `<li 
class="">
         <p 
          style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
          "
class="empty-concern-list muted-2">Empty List…</p>
       </li>`;

  container.innerHTML = `
<div class=" p-1 concerns-container container dp-f ai-c fd-c jc-c mt-4">
  <div 

          style="position: relative;"
    class="p-1 border-subtle-effect br-20 concerns-manager">
    <ul class="lst-n p-1 pt-2 pb-2 concerns-list">
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


            <div class="aside-concern-view-status concern-popup-body pt-1 pb-1">
                ${renderConcernList(concerns, "rejected")}
            </div>
      </div>
  </aside>
</div>
`;
}

export { loadDOM, renderConcernItem, renderConcernList };
