import { notifyError, notifySuccess } from "@utils/showNotif.ts";
import openProfileData from "./openProfile.ts";
import { z } from "zod";
import html from "@utils/htmlTemp.ts";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function initEvents() {
  const upperContainer = document.querySelector(
    ".upper-container",
  ) as HTMLDivElement;

  upperContainer.addEventListener("click", (e: Event) => {
    const t = e.target as HTMLElement;
    // Change password events:

    // open form
    if (t.matches(".change-pw-btn")) {
      openPwChangeForm();
    }

    // close form
    if (t.matches("#cancel-change")) {
      closePwChangeForm();
    }

    // toggle pw visib:
    // the svg is the one getting
    // cliked here so, I'm getting the
    // button that contains it
    const btn = t.closest(".visib-pass-btn") as HTMLButtonElement | null;
    if (btn) {
      togglePassword(btn);
    }
  });

  // Submit form
  upperContainer.addEventListener("submit", (e) => {
    const form = e.target as HTMLFormElement;
    if (form.matches("#change-password-form")) {
      e.preventDefault();
      submitPwChange(form);
    }
  });

  // this is not inside upperContainer
  // so not included in event delegation
  initLogoutEvent();
}

const submitPwChange = async (form: HTMLFormElement) => {
  // clear prev errs
  document.querySelectorAll("[data-error]").forEach((e) => {
    (e as HTMLElement).textContent = "";
  });
  // console.trace("submitPwChange called");

  const formData = new FormData(form);

  const currPw = formData.get("currentPassword");
  const newPw = formData.get("newPassword");
  const confirmPw = formData.get("confirmPassword");

  const result = passwordSchema.safeParse({
    currentPassword: currPw,
    newPassword: newPw,
    confirmPassword: confirmPw,
  });

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const key = issue.path[0];
      const errorEl = form.querySelector<HTMLDivElement>(
        `[data-error="${key}"]`,
      );
      if (errorEl) {
        errorEl.textContent = issue.message;
      }
    });
    return;
  }

  const validatedData = result.data;
  try {
    const response = await fetch("/api/v1/users/change-password", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    const res = await response.json();

    if (!response.ok) {
      if (res.msg) {
        // the only msg being is from BE
        // is for wrong pw case
        const errDiv = document.querySelector("[data-error='currentPassword']");
        if (errDiv) errDiv.textContent = res.msg;
      }
      return;
    }

    // On success

    closePwChangeForm();
    notifySuccess("Changed password successfully");
  } catch (error) {
    console.error("Error during password change", error);
    notifyError("Something went wrong please try again");
  }
};

const openPwChangeForm = () => {
  const upperContainer = document.querySelector(
    ".upper-container",
  ) as HTMLDivElement;

  upperContainer.innerHTML = "";

  upperContainer.insertAdjacentHTML(
    "beforeend",
    `
            <h2 class="text-dark-accent pb-2">Change Account Password</h2>
            <form autocomplete="off" class="dp-f fd-c gp-10" id="change-password-form">

              <div class="input-group">
                <label for="currentPassword">Current Password</label>
                <div class="input-wrapper">
                  <input id="currentPassword" type="password" name="currentPassword" required />
                  ${togglePasswordBtn()}
                </div>
                <div class="dp-f text-error" data-error="currentPassword"></div>
              </div>

              <div class="input-group">
                <label for="newPassword">New Password</label>
                <div class="input-wrapper">
                  <input id="newPassword" type="password" name="newPassword" required />
                  ${togglePasswordBtn()}
                </div>
                <div class="text-error" data-error="newPassword"></div>
              </div>

              <div class="input-group">
                <label for="confirmPassword">Confirm New Password</label>
                <input id="confirmPassword" type="password" name="confirmPassword" required />
                <div class="dp-f text-error" data-error="confirmPassword"></div>
              </div>
              
              <div class="dp-f gp-15 jc-e w-50">
                <button id="cancel-change" class="p-1 btn br-20 border btn-no-hover" type="button">Cancel</button>
                <button class="p-1 btn btn-dark-accent submit-change" type="submit">Confirm</button>
              </div>
            </form>
`,
  );
};

const closePwChangeForm = async () => {
  //  reinitialize state
  // effectively removing the form
  await openProfileData();
  initEvents();
};

const initLogoutEvent = () => {
  const logoutBtn = document.querySelector(".logout");
  if (!logoutBtn) {
    return;
  }

  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        throw new Error("Logout failed");
      }
      // console.log("Logout success");

      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout", error);
    }
  });
};

const togglePassword = (btn: HTMLButtonElement) => {
  const wrapper = btn.closest(".input-wrapper");
  if (!wrapper) return;

  const input = wrapper.querySelector("input");
  if (!input) return;

  const isPassword = input.getAttribute("type") === "password";
  input.setAttribute("type", isPassword ? "text" : "password");

  // if it's the newPassword  input, toggle the
  // confirmPassword input too
  if (input.name === "newPassword") {
    const cp = document.getElementById("confirmPassword");
    if (!cp) return;

    const isPassword = cp.getAttribute("type") === "password";
    cp.setAttribute("type", isPassword ? "text" : "password");
  }

  // toggle's the eye icon
  btn.classList.toggle("active");
};

const togglePasswordBtn = () => {
  return html`
    <button class="btn-no-hover visib-pass-btn" type="button">
      <svg
        class="visib-on"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#e8eaed"
      >
        <path
          d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"
        />
      </svg>
      <svg
        class="visib-off"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#e8eaed"
      >
        <path
          d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"
        />
      </svg>
    </button>
  `;
};

// const attachLiveValidation = (form: HTMLFormElement) => {
//   const inputs = form.querySelectorAll<HTMLInputElement>("input[name]");
//
//   inputs.forEach((input) => {
//     input.addEventListener("input", () => {
//       validateField(input, form);
//     });
//   });
// };

const validateField = (input: HTMLInputElement, form: HTMLFormElement) => {
  const formData = new FormData(form);
  const data = {
    currentPassword: formData.get("currentPassword")?.toString() || "",
    newPassword: formData.get("newPassword")?.toString() || "",
    confirmPassword: formData.get("confirmPassword")?.toString() || "",
  };

  const result = passwordSchema.safeParse(data);
  const field = input.name;
  console.log("result: ", result);
  console.log("field: ", field);

  const errorEl = form.querySelector<HTMLDivElement>(`[data-error="${field}"]`);
  if (!errorEl) return;

  if (result.success) {
    errorEl.textContent = "";
    return;
  }

  const issue = result.error.issues.find((i) => i.path[0] === field);
  console.log("issue: ", issue);
  errorEl.textContent = issue?.message ?? "";
};
