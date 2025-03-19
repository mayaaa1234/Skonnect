import autoFillForm from "../scripts/autoFillForm.ts";
import loginUser from "./loginUser.ts";
import type { LoginData } from "./loginUser.ts";

document.addEventListener("DOMContentLoaded", () => {
  //WARN: this is for quick testing only and should be removed on prod
  autoFillForm();

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
    let { name } = field;

    //check if value is email or username
    if (field.name === "user-identifier") {
      if (value.includes("@")) {
        name = "email";
        field.type = "email";
      } else {
        name = "username";
        field.type = "text";
      }
    }

    console.log("name: ", name);
    console.log("type: ", field.type);

    switch (name) {
      case "username":
        if (!value) {
          showError(field, "field can't be empty.");
        } else if (!field.validity.valid) {
          //showError(field, "field must be at least 4 characters long.");
        } else {
          clearError(field);
        }
        break;

      case "email":
        if (!value) {
          showError(field, "field can't be empty.");
        } else if (!field.validity.valid) {
          showError(field, "not a valid email.");
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

    const formData = new FormData(form);
    //console.log({ formData });
    const jsonData = Object.fromEntries(
      formData as unknown as Iterable<[string, FormDataEntryValue]>,
    ) as unknown as LoginData;

    await loginUser(jsonData);
    form.reset();
  });
});
