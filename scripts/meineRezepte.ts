generatePersonalRezepte();
async function generatePersonalRezepte(): Promise<void> {
    let response: Response = await fetch(`https://gissose2020simon.herokuapp.com/rezepte?author=${localStorage.getItem("email")}`);
    let rezepte: Rezept[] = await response.json();
    rezepte.forEach((rezept: Rezept, index: number) => {
        let rezepteContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("alleRezepte");
        let rezeptContainer: HTMLDivElement = <HTMLDivElement>document.createElement("div");
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
        let button: HTMLButtonElement = <HTMLButtonElement>rezepteContainer.getElementsByClassName("delete")[index];
        console.log(button);
        button.addEventListener("click", async () => {
            console.log("deine Mutter");
            await fetch(`https://gissose2020simon.herokuapp.com/rezept/delete?id=${rezept._id}`);
            window.location.reload();
        });
    });
}