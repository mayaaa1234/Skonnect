document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(
    ".visib-pass-btn",
  ) as HTMLButtonElement;
  const passwordInputs = document.querySelectorAll(
    'input[type="password"]',
  ) as NodeListOf<HTMLInputElement>;

  if (!toggleBtn || !passwordInputs) return;

  toggleBtn.onclick = function () {
    toggleBtn.classList.toggle("active");
    passwordInputs.forEach((input) => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
    });
  };
});
