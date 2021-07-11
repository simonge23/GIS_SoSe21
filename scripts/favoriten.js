"use strict";
generateRezepte(`https://gissose2020simon.herokuapp.com/rezepte/likedby?user=${localStorage.getItem("email")}`, async (rezept) => {
    let result;
    let clickedButton = event.target;
    if (clickedButton.dataset.liked === "true") {
        result = await fetch(`https://gissose2020simon.herokuapp.com/rezepte/likedby/remove?user=${localStorage.getItem("email")}&id=${rezept._id}`);
        let resultJSON = await result.json();
        if (resultJSON.successful_updated === true) {
            clickedButton.parentElement.parentElement.remove();
        }
    }
});
//# sourceMappingURL=favoriten.js.map