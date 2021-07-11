"use strict";
isLoggedIn();
document.getElementById("logout").addEventListener("click", () => {
    logout();
});
async function isLoggedIn() {
    let data = {
        name: localStorage.getItem("email"),
        password: localStorage.getItem("password")
    };
    let credentials = JSON.stringify(data);
    let response = await fetch("https://gissose2020simon.herokuapp.com/login", {
        method: "POST",
        body: credentials // body data type must match "Content-Type" header
    });
    let responseJson = await response.json();
    console.log(responseJson.loggedIn);
    if (!responseJson.loggedIn) {
        alert("Your credentails dont match.");
        window.location.pathname = "GIS_SoSe21/sites/login.html";
    }
}
function logout() {
    localStorage.clear();
    window.location.pathname = "GIS_SoSe21/sites/login.html";
}
function bundleRezept() {
    let titelInput = document.getElementById("titel");
    let bildUrlInput = document.getElementById("imageLink");
    let zutatenliste = createMenge();
    let schrittliste = createSchritte();
    let rezept = {
        titel: titelInput.value,
        imageUrl: bildUrlInput.value,
        zutatenliste: zutatenliste,
        schritte: schrittliste,
        author: localStorage.getItem("email")
    };
    return rezept;
}
function createMenge() {
    let zutatenliste = [];
    let zutatenlisteContainer = document.getElementById("zutatenliste");
    for (let i = 0; i < zutatenlisteContainer.children.length; i++) {
        let menge;
        let mengeInput = zutatenlisteContainer.children[i].children[0];
        let zutatInput = zutatenlisteContainer.children[i].children[1];
        if (!(mengeInput.value.length === 0 && zutatInput.value.length === 0)) {
            menge = {
                menge: mengeInput.value,
                zutat: zutatInput.value
            };
            zutatenliste.push(menge);
        }
    }
    return zutatenliste;
}
function createSchritte() {
    let schrittliste = [];
    let schrittlisteContainer = document.getElementById("schrittliste");
    for (let i = 0; i < schrittlisteContainer.children.length; i++) {
        let schritt = "";
        let schrittInput = schrittlisteContainer.getElementsByTagName("input")[i];
        if (!(schrittInput.value.length === 0)) {
            schritt = schrittInput.value;
            schrittliste.push(schritt);
        }
    }
    return schrittliste;
}
async function generateRezepte(url, onClick) {
    let response = await fetch(url);
    let rezepte = await response.json();
    rezepte.forEach((rezept, index) => {
        console.log(rezept);
        let rezepteContainer = document.getElementById("alleRezepte");
        let rezeptContainer = document.createElement("div");
        rezeptContainer.className = "rezept";
        rezeptContainer.innerHTML = `<div>
                                        <img src="${rezept.imageUrl}">
                                    </div>
                                    <div class="info">
                                        <h1>${rezept.titel}</h1>
                                        <p>von ${rezept.author}</p>
                                        <a href="rezept.html?id=${rezept._id}">Hier zum Rezept</a>
                                        <button class="fav" data-liked="${rezept.likedBy.includes(localStorage.getItem("email"))}">${rezept.likedBy.includes(localStorage.getItem("email")) ? "♥" : "♡"}</button>
                                    </div>`;
        rezepteContainer.append(rezeptContainer);
        let button = rezepteContainer.getElementsByClassName("fav")[index];
        button.addEventListener("click", async () => {
            onClick(rezept);
        });
    });
}
//# sourceMappingURL=main.js.map