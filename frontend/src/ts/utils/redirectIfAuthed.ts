//import { jwtDecode } from "jwt-decode";
//
//async function redirectIfAuthenticated() {
//  const page = document.body.dataset.page;
//  if (page !== "login" && page !== "signup") return;
//
//  const res = await fetch("api/v1/auth/status", {
//    method: "GET",
//    credentials: "include",
//  });
//
//  const data = await res.json();
//  console.log({ data });
//}
//redirectIfAuthenticated();
