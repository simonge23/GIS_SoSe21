"use strict";
generateRezept();
async function generateRezept() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    let reponse = await fetch(`https://gissose2020simon.herokuapp.com/GIS_SoSe21/rezept?id=${id}`);
    let rezept = await reponse.json();
    let titel = document.getElementById("titel");
    titel.innerHTML = rezept.titel;
    let author = document.getElementById("author");
    author.innerHTML = rezept.author;
    let img = document.getElementById("img");
    img.src = rezept.imageUrl;
    img.alt = rezept.titel;
    let zutatenContainer = document.getElementById("zutatenContainer");
    rezept.zutatenliste.forEach((element) => {
        let zutat = document.createElement("p");
        zutat.innerText = `${element.menge} ${element.zutat}`;
        zutatenContainer.append(zutat);
    });
    let schritteContainer = document.getElementById("schritteContainer");
    rezept.schritte.forEach((element, index) => {
        let schrittNummer = document.createElement("h4");
        schrittNummer.innerText = "No. " + (index + 1).toString();
        let schritt = document.createElement("p");
        schritt.innerText = element;
        schritteContainer.append(schrittNummer);
        schritteContainer.append(schritt);
    });
}
//# sourceMappingURL=rezept.js.map