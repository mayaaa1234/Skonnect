import {
  BudgetAllocation,
  getAllBudgetAllocationRow,
} from "../profile/budgetAllocation/initBudgetAllocation.ts";
import { html } from "lit-html";

async function initBudgetAllocationDOM() {
  const year = new Date().getFullYear();

  const h1 = document.querySelector("header h1") as HTMLElement;
  h1.innerText = `Annual Budget Youth Invesment Plan ${year} Itemization`;

  const container = document.querySelector(".table-container")!;

  try {
    const budgetAllocations: BudgetAllocation[] =
      await getAllBudgetAllocationRow();

    const total = budgetAllocations.reduce((sum, a) => sum + a.amount, 0);
    container.innerHTML = `
          <table class="" border="1" cellspacing="0">
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
            <td>${alloc.category}</td>
            <td class="amount-cell">${alloc.amount.toLocaleString("en-US")}</td>
            <td>${alloc.items}
</td>
          </tr>

          `;
                })
                .join("")}

              <tr>
                <td><h4 class="text-tip">Total</h4></td>
                <td>
                  <h4 class="text-tip" id="totalAllocation">
                    ${total.toLocaleString("en-US")}
                  </h4>
                </td>
                <td><h4 class="text-tip">SK Budget For CY ${year}</h4></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
`;
  } catch (error) {
    console.error(error);
  }
}

initBudgetAllocationDOM();
