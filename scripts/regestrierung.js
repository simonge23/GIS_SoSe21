"use strict";
let regestrierButton = document.getElementById("regestrieren");
regestrierButton.addEventListener("click", () => {
    regestrieren();
});
async function regestrieren() {
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let data = {
        name: emailInput.value.trim(),
        password: passwordInput.value.trim()
    };
    let credentials = JSON.stringify(data);
    let response = await fetch("https://gissose2020simon.herokuapp.com/GIS_SoSe21/regestrierung", {
        method: "POST",
        body: credentials // body data type must match "Content-Type" header
    });
    let responseJson = await response.json();
    console.log(responseJson.registered);
    if (responseJson.registered) {
        document.getElementById("success").setAttribute("style", "visibility: visible;");
        await new Promise(resolve => setTimeout(resolve, 2000));
        window.location.pathname = "GIS_SoSe21/sites/login.html";
    }
    else {
        alert("Diese Email existiert bereits");
    }
}
//# sourceMappingURL=regestrierung.js.map