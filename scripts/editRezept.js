"use strict";
fillRezeptIn();
document.getElementById("submit").addEventListener("click", async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    let rezeptJSON = JSON.stringify(bundleRezept());
    let response = await fetch(`https://gissose2020simon.herokuapp.com/GIS_SoSe21/rezept/update?id=${id}`, {
        method: "POST",
        body: rezeptJSON // body data type must match "Content-Type" header
    });
    let responseJSON = await response.json();
    if (responseJSON.successful_updated === true) {
        window.location.pathname = "GIS_SoSe21/sites/meineRezepte.html";
    }
    else {
        alert("Update didnt work");
    }
});
async function fillRezeptIn() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    let response = await fetch(`https://gissose2020simon.herokuapp.com/GIS_SoSe21/rezept?id=${id}`);
    let rezept = await response.json();
    let titelInput = document.getElementById("titel");
    titelInput.value = rezept.titel;
    let bildUrlInput = document.getElementById("imageLink");
    bildUrlInput.value = rezept.imageUrl;
    let zutatenlisteContainer = document.getElementById("zutatenliste");
    rezept.zutatenliste.forEach((zutat) => {
        let container = document.createElement("div");
        container.className = "schrittlisteItem";
        container.innerHTML = `<input type="text" name="menge" class="menge">
                               <input type="text" name="zutat" class="zutat">`;
        container.getElementsByTagName("input")[0].value = zutat.menge;
        container.getElementsByTagName("input")[1].value = zutat.zutat;
        zutatenlisteContainer.append(container);
    });
    let schrittlisteContainer = document.getElementById("schrittliste");
    rezept.schritte.forEach((schritt, index) => {
        let container = document.createElement("div");
        container.className = "schrittlisteItem";
        container.innerHTML = `<label for="schritt">Schritt ${index + 1}</label>
                                      <input type="text" name="schritt" class="schritt">`;
        schrittlisteContainer.append(container);
        container.getElementsByTagName("input")[0].value = schritt;
    });
}
//# sourceMappingURL=editRezept.js.map