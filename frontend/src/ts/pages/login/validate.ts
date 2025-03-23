import autoFillForm from "../../utils/scripts/autoFillForm.ts";
import loginUser from "./loginUser.ts";
import type { LoginData } from "./loginUser.ts";

const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

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

    //check if value is email or username
    // and overwrite generic user-identifier name attribute
    // and type of text if email.
    if (field.name === "user-identifier") {
      if (emailRegex.test(value)) {
        field.name = "email";
        field.type = "email";
      } else {
        field.name = "username";
        //field.type = "text"; // already text in html
      }
    }

    console.log("name: ", field.name);
    console.log("type: ", field.type);

    switch (field.name) {
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
