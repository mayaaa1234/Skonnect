import signupValidation, { SignupData } from "./signupValidation.ts";
import autoFillForm from "../../utils/scripts/autoFillForm.ts";
// import type { SignupData } from "./signupValidation.ts";

import { showLoading } from "@components/loadingSpinner.ts";
const submitBtn = document.querySelector(
  ".submit-signup-btn",
) as HTMLButtonElement;

document.addEventListener("DOMContentLoaded", () => {
  //WARN: this is for quick testing only and should be removed on prod
  if (process.env.NODE_ENV !== "production") {
    // autoFillForm();
  }

  const form = document.getElementById("signup-form") as HTMLFormElement | null;
  if (!form) return;

  // Helper function to show error
  function showError(input: HTMLInputElement, message: string) {
    const errorDiv = document.querySelector(
      `.signup-error-msg[data-error-for="${input.name}"]`,
    ) as HTMLElement | null;

    if (errorDiv) {
      errorDiv.textContent = message;
    }
    input.classList.add("invalid");
  }

  // Helper function to clear error
  function clearError(input: HTMLInputElement) {
    const errorDiv = document.querySelector(
      `.signup-error-msg[data-error-for="${input.name}"]`,
    ) as HTMLElement | null;

    if (errorDiv) {
      errorDiv.textContent = "";
    }
    input.classList.remove("invalid");
  }

  function validateField(field: HTMLInputElement) {
    const value = field.value.trim();
    const { name } = field;
    field.value = value; // update the value with the trimmed one

    const passwordField = form?.elements.namedItem(
      "password",
    ) as HTMLInputElement | null;

    switch (name) {
      case "username":
        if (!value) {
          showError(field, "field can't be empty.");
        } else if (value.length < 4) {
          showError(field, "username must be at least 4 characters long.");
        } else {
          clearError(field);
        }
        break;

      case "email":
        if (!value) {
          showError(field, "field can't be empty.");
        } else if (!field.validity.valid) {
          showError(field, "email is not valid.");
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

      case "confirmPassword":
        if (!value) {
          showError(field, "field can't be empty.");
        } else if (
          passwordField &&
          passwordField.value &&
          value !== passwordField.value.trim()
        ) {
          showError(field, "passwords do not match.");
        } else {
          clearError(field);
        }
        break;

      default:
        break;
    }
  }

  // Attach validation handlers (live validation on input activities)
  for (const field of Array.from(form.elements)) {
    if (field instanceof HTMLInputElement) {
      field.addEventListener("input", () => validateField(field));
    }
  }

  // Form submission handler
  form.addEventListener("submit", async (e: SubmitEvent) => {
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
    ) as unknown as SignupData;

    // save this temporarily for otp functionality
    // after successful validation
    const { email } = jsonData;
    sessionStorage.setItem("email", email);

    //console.log({ jsonData });
    //form.reset();

    submitBtn.disabled = true;
    const originalContent = submitBtn.innerHTML;
    showLoading(submitBtn, "small");
    await signupValidation(jsonData);
    submitBtn.innerHTML = originalContent;
    submitBtn.disabled = false;
  });
});
