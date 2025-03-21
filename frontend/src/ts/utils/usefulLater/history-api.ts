//<button id="openRegister">Open Register</button>
//<div id="registerModal" style="display: none;">
//  <button id="closeModal">Close</button>
//  <h2>Register Here</h2>
//</div>

//document.getElementById("openRegister").addEventListener("click", function () {
//  document.getElementById("registerModal").style.display = "block";
//  history.pushState({ popup: "register" }, "", "/home/register");
//});
//
//document.getElementById("closeModal").addEventListener("click", function () {
//  document.getElementById("registerModal").style.display = "none";
//  history.pushState(null, "", "/home");
//});
//
//window.addEventListener("popstate", function (event) {
//  if (event.state?.popup === "register") {
//    document.getElementById("registerModal").style.display = "block";
//  } else {
//    document.getElementById("registerModal").style.display = "none";
