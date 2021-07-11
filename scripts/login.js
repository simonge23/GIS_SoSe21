"use strict";
let loginButton = document.getElementById("submit");
loginButton.addEventListener("click", () => {
    saveCredentials();
    window.location.pathname = "GIS_SoSe21/sites/home.html";
});
function saveCredentials() {
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    localStorage.setItem("email", emailInput.value.trim());
    localStorage.setItem("password", passwordInput.value.trim());
}
//# sourceMappingURL=login.js.map