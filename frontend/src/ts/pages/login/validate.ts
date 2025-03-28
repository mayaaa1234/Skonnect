import autoFillForm from "../../utils/scripts/autoFillForm.ts";
import loginUser from "./loginUser.ts";
import type { LoginData } from "./loginUser.ts";

const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

//const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

document.addEventListener("DOMContentLoaded", () => {
  //WARN: this is for quick testing only and should be removed on prod
  if (process.env.NODE_ENV !== "production") {
    //autoFillForm();
  }

  const form = document.getElementById("login-form") as HTMLFormElement | null;
  if (!form) return;

  // Helper function to show error
  function showError(input: HTMLInputElement, message: string) {
    const errorDiv = document.querySelector(
      `.error[data-error-for="${input.name}"]`,
    ) as HTMLElement | null;

    if (errorDiv) {
      errorDiv.textContent = message;
    }
    input.classList.add("invalid");
  }

  // Helper function to clear error
  function clearError(input: HTMLInputElement) {
    const errorDiv = document.querySelector(
      `.error[data-error-for="${input.name}"]`,
    ) as HTMLElement | null;

    if (errorDiv) {
      errorDiv.textContent = "";
    }
    input.classList.remove("invalid");
  }

  function validateField(field: HTMLInputElement) {
    const value = field.value.trim();

    //console.log("name: ", field.attributes);
    console.log("name: ", field.name);
    console.log("type: ", field.type);

    switch (field.name) {
      case "user-identifier":
        if (!value) {
          showError(field, "field can't be empty.");
          //} else if (!field.validity.valid) {
          //  //showError(field, "field must be at least 4 characters long.");
        } else {
          clearError(field);
        }
        break;

      case "password":
        if (!value) {
          showError(field, "field can't be empty.");
        } else if (value.length < 8) {
          showError(field, "password must be at least 8 characters long.");
        } else {
          clearError(field);
        }
        break;

      default:
        break;
    }
  }

  // Attach validation handlers (live validation on input activity)
  for (const field of Array.from(form.elements)) {
    if (field instanceof HTMLInputElement) {
      field.addEventListener("input", () => validateField(field));
    }
  }

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all fields
    let hasErrors = false;
    for (const field of Array.from(form.elements)) {
      if (field instanceof HTMLInputElement) {
        validateField(field);
        if (!field.validity.valid || field.classList.contains("invalid")) {
          hasErrors = true;
        }
      }
    }
    if (hasErrors) return;

    const userIdentifier = form.querySelector(
      "#user-identifier",
    ) as HTMLInputElement;
    const value = userIdentifier.value.trim();

    const passwordInput = form.querySelector(
      'input[name="password"]',
    ) as HTMLInputElement;

    const loginData: LoginData = {
      password: passwordInput.value,
    };

    // if the value matches the email regex, add it as an email,
    // otherwise as username.
    if (emailRegex.test(value)) {
      loginData.email = value;
    } else {
      loginData.username = value;
    }

    await loginUser(loginData);
  });
});
