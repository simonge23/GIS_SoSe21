"use strict";
generatePersonalRezepte();
async function generatePersonalRezepte() {
    let response = await fetch(`https://gissose2020simon.herokuapp.com/rezepte?author=${localStorage.getItem("email")}`);
    let rezepte = await response.json();
    rezepte.forEach((rezept, index) => {
        let rezepteContainer = document.getElementById("alleRezepte");
        let rezeptContainer = document.createElement("div");
        rezeptContainer.className = "rezept";
        rezeptContainer.innerHTML = `<div>
                                        <img src="${rezept.imageUrl}" alt="Waffel">
                                    </div>
                                    <div class="info">
                                        <h1>${rezept.titel}</h1>
                                        <p>von ${rezept.author}</p>  
                                        <button class="delete">Delete</button>
                                        <a href="./sitses/editRezept.html?id=${rezept._id}"><button>Edit</button></a>
                                    </div>`;
        rezepteContainer.append(rezeptContainer);
        let button = rezepteContainer.getElementsByClassName("delete")[index];
        console.log(button);
        button.addEventListener("click", async () => {
            console.log("deine Mutter");
            await fetch(`https://gissose2020simon.herokuapp.com/rezept/delete?id=${rezept._id}`);
            window.location.reload();
        });
    });
}
//# sourceMappingURL=meineRezepte.js.map