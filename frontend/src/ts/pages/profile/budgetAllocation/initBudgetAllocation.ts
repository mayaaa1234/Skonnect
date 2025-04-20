export default async function initBudgetAllocationPage() {
  await getAllBudgetAllocation();
  await initBudgetAllocationDOM();

  const saveBtn = document.querySelector(".btn-save")!;
  initTableEventListener();

  // remove comma when editing
  document
    .querySelectorAll<HTMLInputElement>(".amount-input")
    .forEach(attachNumberFormatting);
}
import { html } from "lit-html";

const container = document.getElementById("data-container") as HTMLElement;

interface BudgetAllocation {
  category: string;
  amount: number;
  items: string;
}

// <th style="width=">Category</th>
// <th class="" style="width: 20%">Amount (₱)</th>
// <th style="width=">Description / Details</th>
async function initBudgetAllocationDOM() {
  try {
    const budgetAllocations = await getAllBudgetAllocation();
    const budgetAllocationDOM = `
      <div class="dp-f jc-c ai-c fd-c container">
        <h1 class="mt-2 fs-2-xs fs-3-lg ta-c container gradient-text">
          Annual Budget Youth Invesment Plan 2025 Itemization
        </h1>

        <div class="table-wrapper dp-f fd-c ai-c">
          <div class="w-100 dp-f ai-c jc-c mt-4 gp-15 table-controls">
            <p class="mr-auto muted-2">
              Click the cells to edit value then click save after making changes
            </p>

<div class="dp-f gp-10">
            <button class="p-1 w-100px br-40 btn-dark-accent">Add Row</button>
            <button class="p-1 w-100px br-40 btn-save btn-save-dark-5-no-hover">
              Save
            </button>
</div>
          </div>

          <table class="mt-2" border="1" cellspacing="0">
            <thead>
              <tr>
                <th style="width: auto; text-align: center;">
                  <input type="text" value="Category" />
                </th>
                <th style="width: 20%; text-align: center;">
                  <input type="text" value="Allocation (₱)" />
                </th>
                <th style="width: auto; text-align: center;">
                  <input type="text" value="Description" />
<svg class='del-icon' height="24px" viewBox="0 -960 960 960" width="24px" fill="#D16D6A"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </th>
              </tr>
            </thead>
            <tbody>
              ${budgetAllocations
                .map((alloc) => {
                  return `
          <tr>
            <td><input dataset-original-value="${alloc.category}" maxlength="55" type="text" value="${alloc.category}"></td>
            <td><input dataset-original-value="${alloc.amount}" class="amount-input" max="1000000" inputmode="numeric" type="text" value="${alloc.amount.toLocaleString(
              "en-US",
            )}"></td>
            <td><input dataset-original-value="${alloc.items}" maxlength="155" type="text" value="${alloc.items}">

<svg class='del-icon' height="24px" viewBox="0 -960 960 960" width="24px" fill="#D16D6A"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>

</td>

          </tr>

          `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
    // const budgetAllocationDOM = budgetAllocations.map(
    //   (alloc: BudgetAllocation) => {},
    // );

    container.innerHTML = budgetAllocationDOM;
  } catch (e) {
    console.error(e);
  }
}

// Validation | Formatting

function formatNumber(value: string): string {
  const n = parseFloat(value.replace(/,/g, ""));
  return isNaN(n) ? "" : n.toLocaleString("en-US");
}

function unformatNumber(value: string): string {
  return value.replace(/,/g, "");
}

function attachNumberFormatting(input: HTMLInputElement) {
  input.addEventListener("focus", () => {
    input.value = unformatNumber(input.value);
  });
  input.addEventListener("blur", () => {
    input.value = formatNumber(input.value);
  });
}

// Events

function initTableEventListener() {
  const table = document.querySelector("table") as HTMLElement;
  const saveBtn = document.querySelector(".btn-save") as HTMLElement;

  table.addEventListener("focusin", (e) => {
    const inp = e.target as HTMLInputElement;
    if (inp.matches(".amount-input")) {
      inp.value = unformatNumber(inp.value);
    }
  });

  table.addEventListener("focusout", (e) => {
    const inp = e.target as HTMLInputElement;
    if (inp.matches(".amount-input")) {
      inp.value = formatNumber(inp.value);
    }
    handleRevert(inp);
  });

  table.addEventListener("input", (e) => {
    const inp = e.target as HTMLInputElement;
    if (inp.matches("input")) {
      handleRevert(inp);
    }
  });

  const handleRevert = (inp: HTMLInputElement) => {
    const raw = inp.matches(".amount-input")
      ? unformatNumber(inp.value)
      : inp.value;
    const orig = inp.dataset.original!;

    // Toggle save button state
    const anyChanged = Array.from(
      table.querySelectorAll<HTMLInputElement>("input"),
    ).some((i) => unformatNumber(i.value) !== i.dataset.original);
    document
      .querySelector(".btn-save")!
      .classList.toggle("btn-save-dark-5-no-hover", !anyChanged);
  };
}

// const rows = Array.from(document.querySelectorAll("tbody tr"));
// const payload = rows.map((tr) => {
//   const [catEl, amtEl, itemsEl] = Array.from(tr.querySelectorAll("input")) as [
//     HTMLInputElement,
//     HTMLInputElement,
//     HTMLInputElement,
//   ];
//   return {
//     category: catEl.value,
//     // remove commas before parsing to number
//     amount: Number(amtEl.value.replace(/,/g, "")),
//     items: itemsEl.value,
//   };
// });
// await updateBudgetAllocations(payload);

// Fetches

async function getAllBudgetAllocation(): Promise<BudgetAllocation[]> {
  const res = await fetch("/api/v1/budgetAllocation/", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

async function updateBudgetAllocations(
  id: number,
  category: string,
  amount: number,
  items: string,
) {
  const res = await fetch(`/api/v1/budgetAllocation/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category,
      amount,
      items,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
}
