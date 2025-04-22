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

export interface BudgetAllocation {
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
  const year = new Date().getFullYear();

  try {
    const budgetAllocations = await getAllBudgetAllocationRow();

    const budgetAllocationDOM = `
      <div class="dp-f jc-c ai-c fd-c container">
        <h1 class="mt-2 fs-2-xs fs-3-lg ta-c container gradient-text">
          Annual Budget Youth Invesment Plan ${year} Itemization
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
                  <h4 class="text-dark-accent">Budget Item</h4>
                </th>
                <th style="width: 20%; text-align: center;">
                  <h4 class="text-dark-accent">Allocation (₱)</h4>
                </th>
                <th style="width: auto; text-align: center;">
                  <h4 class="text-dark-accent">Description</h4>
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
              <tr>
                <td><h4 class="text-tip">Total</h4></td>
                <td>
                  <h4 class="text-tip" id="totalAllocation">
                    // total here
                  </h4>
                </td>
                <td><h4 class="text-tip">SK Budget For CY ${year}</h4></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    // const budgetAllocationDOM = budgetAllocations.map(
    //   (alloc: BudgetAllocation) => {},
    // );

    container.innerHTML = budgetAllocationDOM;

    const totalEl = document.getElementById("totalAllocation");
    if (totalEl) {
      totalEl.textContent = calculateTotalAllocation().toLocaleString("en-US");
    }
  } catch (e) {
    console.error(e);
  }
}

// Formatting | Utils

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

function calculateTotalAllocation() {
  const inputs = document.querySelectorAll<HTMLInputElement>(".amount-input");
  return Array.from(inputs).reduce((sum, el) => {
    const raw = unformatNumber(el.value);
    const n = parseFloat(raw);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
}

// Events

function initTableEventListener() {
  const table = document.querySelector("table") as HTMLTableElement;
  const saveBtn = document.querySelector(".btn-save") as HTMLButtonElement;
  const totalCell = document.getElementById("totalAllocation")!;

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

  const updateTotal = () => {
    totalCell.textContent = calculateTotalAllocation().toLocaleString("en-US");
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

    if ((e.target as HTMLInputElement).matches(".amount-input")) {
      updateTotal();
    }
  });

  saveBtn.addEventListener("click", () => {
    updateTotal();
  });
}

// function initTotalAllocationListener() {
//   const table = document.querySelector("table")!;
// }

function initSaveBtnEventListener() {
  const saveBtn = document.querySelector(".btn-save") as HTMLButtonElement;
  if (saveBtn.matches("btn-save-dark-5-no-hover")) return;

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const changedRows = new Map<HTMLElement, HTMLInputElement[]>();

    document.querySelectorAll<HTMLInputElement>("table input").forEach((i) => {
      const val = i.value.trim();
      const origVal = i.dataset.originalValue;
      const currVal = i.matches(".amount-input") ? unformatNumber(val) : val;

      if (origVal !== currVal) {
        const row = i.closest("tr")!;
        changedRows.set(row, [...(changedRows.get(row) || []), i]);
      }
    });

    const validateRowInputs = (
      category: string,
      amount: number,
      items: string,
    ) => {
      if (!category) {
        throw new Error("Invalid category row/s");
      }
      if (!amount) {
        throw new Error("Invalid allocation row/s");
      }
      if (!items) {
        throw new Error("Invalid description row/s");
      }
    };

    for (const [row, inputs] of changedRows) {
      const rowId = Number(row.dataset.rowId);
      const [categoryEl, amountEl, itemsEl] = Array.from(
        row.querySelectorAll<HTMLInputElement>("input"),
      );

      const rawAmount = amountEl.value.trim();
      const cleanedAmount = unformatNumber(rawAmount);
      const amount = Number(cleanedAmount);
      console.log({ rawAmount, cleanedAmount, amount }); // DEBUG

      try {
        if (!rowId) {
          validateRowInputs(
            categoryEl.value.trim(),
            amount,
            itemsEl.value.trim(),
          );

          await addBudgetAllocationRow(
            categoryEl.value.trim(),
            amount,
            itemsEl.value.trim(),
          );
        } else {
          validateRowInputs(
            categoryEl.value.trim(),
            amount,
            itemsEl.value.trim(),
          );

          await updateBudgetAllocationRow(
            rowId,
            categoryEl.value.trim(),
            amount,
            itemsEl.value.trim(),
          );
        }

        // notifySuccess("Updated successfully");
      } catch (error: any) {
        notifyError(error.message || "Update failed, please try again");
        console.error("error: ", error);
      }

      saveBtn.classList.add("btn-save-dark-5-no-hover");
    }
  });
}

function initAddRowBtnEventListener() {
  const tbody = document.querySelector("table tbody")!;
  const addBtn = document.querySelector(".btn-add") as HTMLButtonElement;

  addBtn.addEventListener("click", () => {
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-row-id", "");
    newRow.innerHTML = `
      <td>
        <input
          focus()
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
        <button class="btn-no-hover btn-del">
          <svg class='del-icon' height="24px" viewBox="0 -960 960 960" width="24px" fill="#D16D6A">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
          </svg>
        </button>
      </td>
    `;

    const totalRow = tbody.querySelector("tr:last-child");
    tbody.insertBefore(newRow, totalRow);
    newRow.querySelector("input")?.focus();

    const amountInput = newRow.querySelector<HTMLInputElement>(".amount-input");
    if (amountInput) attachNumberFormatting(amountInput);
  });
}

function initDeleteBtnEventListener() {
  const table = document.querySelector("table")!;

  table.addEventListener("click", async (e) => {
    const btn = (e.target as Element).closest(".btn-del");
    if (!btn) return;

    const row = btn.closest("tr")!;
    const rowId = Number(row.dataset.rowId);

    try {
      if (rowId) {
        await deleteBudgetAllocationRow(rowId);
        row.remove();
      } else {
        // for new unsaved rows
        row.remove();
      }
    } catch (error) {
      console.log(error);
      notifyError("Deletion failed, please try again");
    }
  });
}

// Fetches

export async function getAllBudgetAllocationRow(): Promise<BudgetAllocation[]> {
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
