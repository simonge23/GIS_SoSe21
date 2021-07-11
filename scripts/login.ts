let loginButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById("submit");

loginButton.addEventListener("click", () => {
    saveCredentials();
    window.location.pathname = "GIS_SoSe21/sites/home.html";
});

function saveCredentials(): void {
    let emailInput: HTMLInputElement = <HTMLInputElement>document.getElementById("email");
    let passwordInput: HTMLInputElement = <HTMLInputElement>document.getElementById("password");

    localStorage.setItem("email", emailInput.value.trim());
    localStorage.setItem("password", passwordInput.value.trim());
}


