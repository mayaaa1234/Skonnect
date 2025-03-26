function generateRandomString(length: number): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export default function autofillForm(): void {
  const username = `user_${generateRandomString(5)}`;
  const email = `random-${generateRandomString(5)}@example.com`;

  const usernameInput = document.getElementById(
    "username",
  ) as HTMLInputElement | null;
  const emailInput = document.getElementById(
    "email",
  ) as HTMLInputElement | null;
  const passwordInput = document.getElementById(
    "password",
  ) as HTMLInputElement | null;
  const confirmPasswordInput = document.getElementById(
    "confirmPassword",
  ) as HTMLInputElement | null;

  // for login
  const userIdentifierInput = document.getElementById(
    "user-identifier",
  ) as HTMLInputElement | null;

  if (userIdentifierInput && passwordInput) {
    userIdentifierInput.value = "maya";
    passwordInput.value = "randomPassword";
    return;
  }

  // for signup
  if (usernameInput) usernameInput.value = username;
  //if (emailInput) emailInput.value = email;
  if (emailInput) emailInput.value = "maya123@gmail.com";
  if (passwordInput) passwordInput.value = "asdfasdf";
  if (confirmPasswordInput) confirmPasswordInput.value = "asdfasdf";
}
