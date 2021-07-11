generateRezept();

async function generateRezept(): Promise<void> {
    let urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    let id: string = urlParams.get("id");
    let reponse: Response = await fetch(`https://gissose2020simon.herokuapp.com/rezept?id=${id}`);
    let rezept: Rezept = await reponse.json();
    
    let titel: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("titel");
    titel.innerHTML = rezept.titel;

    let author: HTMLSpanElement = <HTMLSpanElement>document.getElementById("author");
    author.innerHTML = rezept.author; 

    let img: HTMLImageElement = <HTMLImageElement>document.getElementById("img");
    img.src = rezept.imageUrl;
    img.alt = rezept.titel;

    let zutatenContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("zutatenContainer");
    rezept.zutatenliste.forEach((element: Menge) => {
        let zutat: HTMLParagraphElement = document.createElement("p");
        zutat.innerText = `${element.menge} ${element.zutat}`;
        zutatenContainer.append(zutat);
    });

    let schritteContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("schritteContainer");
    rezept.schritte.forEach((element: string, index: number) => {
        let schrittNummer: HTMLHeadingElement = document.createElement("h4");
        schrittNummer.innerText = "No. " + (index + 1).toString();
        let schritt: HTMLParagraphElement = document.createElement("p");
        schritt.innerText = element;
        schritteContainer.append(schrittNummer);
        schritteContainer.append(schritt);
    });
}