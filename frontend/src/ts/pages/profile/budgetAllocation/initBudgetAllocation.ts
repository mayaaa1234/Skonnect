import { notifySuccess, notifyError } from "@utils/showNotif.ts";

export default async function initBudgetAllocationPage() {
  await getAllBudgetAllocationRow();
  await initBudgetAllocationDOM();

  initTableEventListener();
  initSaveBtnEventListener();
  initAddRowBtnEventListener();
  initDeleteBtnEventListener();

  // remove comma when editing
  document
    .querySelectorAll<HTMLInputElement>(".amount-input")
    .forEach(attachNumberFormatting);
}
import { html } from "lit-html";

interface BudgetAllocation {
  id: number;
  category: string;
  amount: number;
  items: string;
}

// <th style="width=">Category</th>
// <th class="" style="width: 20%">Amount (₱)</th>
// <th style="width=">Description / Details</th>
async function initBudgetAllocationDOM() {
  const container = document.getElementById("data-container") as HTMLElement;

  try {
    const budgetAllocations = await getAllBudgetAllocationRow();
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

            <div class="dp-f">
              <button class="p-1 w-100px br-40 btn-add btn-dark-accent">
                Add Row
              </button>
              <button
                class="p-1 w-100px br-40 btn-save btn-save-dark-5-no-hover"
              >
                Save
              </button>
            </div>
          </div>

          <table class="mt-2" border="1" cellspacing="0">
            <thead>
              <tr>
                <th style="width: auto; text-align: center;">
                  <input
                    data-original-value="Category"
                    type="text"
                    value="Category"
                  />
                </th>
                <th style="width: 20%; text-align: center;">
                  <input
                    data-original-value="Allocation (₱)"
                    type="text"
                    value="Allocation (₱)"
                  />
                </th>
                <th style="width: auto; text-align: center;">
                  <input
                    data-original-value="Description"
                    type="text"
                    value="Description"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              ${budgetAllocations
                .map((alloc) => {
                  return `
          <tr data-row-id="${alloc.id}">
            <td><input data-original-value="${alloc.category}" maxlength="55" type="text" value="${alloc.category}"></td>
            <td><input data-original-value="${alloc.amount}" class="amount-input" max="1000000" inputmode="numeric" type="text" value="${alloc.amount.toLocaleString(
              "en-US",
            )}"></td>
            <td><input data-original-value="${alloc.items}" maxlength="155" type="text" value="${alloc.items}">
<button class="btn-no-hover btn-del">
<svg class='del-icon' height="24px" viewBox="0 -960 960 960" width="24px" fill="#D16D6A"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
</button>
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

// Formatting

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
  const table = document.querySelector("table") as HTMLTableElement;
  const saveBtn = document.querySelector(".btn-save") as HTMLButtonElement;

  const handleRevert = () => {
    const inputs = table.querySelectorAll<HTMLInputElement>("input");

    const anyChanged = Array.from(inputs).some((i) => {
      const orig = i.dataset.originalValue!;
      const current = i.matches(".amount-input")
        ? unformatNumber(i.value)
        : i.value;
      return current !== orig;
    });

    saveBtn.classList.toggle("btn-save-dark-5-no-hover", !anyChanged);
  };

  // prob not needed tbh
  // table.addEventListener("focusout", (e) => {
  //   const inp = e.target as HTMLInputElement;
  //   if (inp.matches(".amount-input")) {
  //     inp.value = formatNumber(inp.value);
  //   }
  //   handleRevert();
  // });

  table.addEventListener("input", (e) => {
    if ((e.target as HTMLInputElement).matches("input")) {
      handleRevert();
    }
  });

  // handleRevert();
}

function initSaveBtnEventListener() {
  const saveBtn = document.querySelector(".btn-save") as HTMLButtonElement;
  if (saveBtn.matches("btn-save-dark-5-no-hover")) return;
  let isSaving = false;

  saveBtn.addEventListener("click", async () => {
    if (isSaving) return;
    isSaving = true;
    saveBtn.disabled = true;

    const changedRows = new Map<HTMLElement, HTMLInputElement[]>();

    // First pass: collect all changed inputs per row
    document.querySelectorAll<HTMLInputElement>("table input").forEach((i) => {
      const val = i.value.trim();
      const origVal = i.dataset.originalValue;
      const currVal = i.matches(".amount-input") ? unformatNumber(val) : val;

      if (origVal !== currVal) {
        const row = i.closest("tr")!;
        changedRows.set(row, [...(changedRows.get(row) || []), i]);
      }
    });

    // Second pass: process each changed row once
    for (const [row, inputs] of changedRows) {
      const rowId = Number(row.dataset.rowId);
      const [categoryEl, amountEl, itemsEl] = Array.from(
        row.querySelectorAll<HTMLInputElement>("input"),
      );

      try {
        if (!rowId) {
          await addBudgetAllocationRow(
            categoryEl.value.trim(),
            Number(unformatNumber(amountEl.value.trim())),
            itemsEl.value.trim(),
          );
        } else {
          await updateBudgetAllocationRow(
            rowId,
            categoryEl.value.trim(),
            Number(unformatNumber(amountEl.value.trim())),
            itemsEl.value.trim(),
          );
        }
        notifySuccess("Updated successfully");
      } catch (error) {
        notifyError("Update failed, please try again");
        console.error({ error });
      }
    }

    saveBtn.classList.add("btn-save-dark-5-no-hover");
    saveBtn.disabled = false;
    isSaving = false;
  });
}

function initAddRowBtnEventListener() {
  const tbody = document.querySelector("table tbody")! as HTMLTableElement;
  const addBtn = document.querySelector(".btn-add") as HTMLButtonElement;
  addBtn.addEventListener("click", () => {
    tbody.insertAdjacentHTML(
      "beforeend",
      `
        <tr data-row-id="">
          <td>
            <input
              data-original-value=""
              maxlength="55"
              type="text"
            />
          </td>
          <td>
            <input
              data-original-value=""
              class="amount-input"
              max="1000000"
              inputmode="numeric"
              type="text"
            />
          </td>
          <td>
            <input
              data-original-value=""
              maxlength="155"
              type="text"
            />
          </td>
        </tr>
      `,
    );
  });
}

function initDeleteBtnEventListener() {
  const table = document.querySelector("table") as HTMLTableElement;
  // const delBtn = document.querySelector(".btn-del") as HTMLButtonElement;

  table.addEventListener("click", (e) => {
    const t = e.target as HTMLButtonElement;
    if (t.matches(".btn-del")) {
      console.log("click");
      const rowId = t.dataset.rowId;
      deleteBudgetAllocationRow(Number(rowId));
      t.remove();
    }
  });
}

// Fetches

async function getAllBudgetAllocationRow(): Promise<BudgetAllocation[]> {
  const res = await fetch("/api/v1/budgetAllocation/", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

async function deleteBudgetAllocationRow(id: number) {
  const res = await fetch(`/api/v1/budgetAllocation/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
}
async function addBudgetAllocationRow(
  category: string,
  amount: number,
  items: string,
) {
  const res = await fetch(`/api/v1/budgetAllocation/`, {
    method: "POST",
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
async function updateBudgetAllocationRow(
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
