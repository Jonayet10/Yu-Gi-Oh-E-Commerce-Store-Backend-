(function() {
    "use strict";
    
    const BASE_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?';

    async function init() {
        await fetchCards('name', 'Blue-Eyes White Dragon', 5);
    }
    
    async function fetchCards(attribute, name, number) {
        const query = encodeURIComponent(name);
        const url = `${BASE_URL}${attribute}=${query}`;

        let resp = await fetch(url, {
            method: "GET",
        })
        .then(checkStatus)
        .then(response => response.json())
        .then(function(response) {
            console.log(response);
        })
        .catch(handleError);

        // console.log(resp);
    }
    
    function displayCardDetails(card) {
        const cardElement = document.getElementById('card-details');
        cardElement.innerHTML = ''; // Clear previous content
    
        const nameElement = document.createElement('h2');
        nameElement.textContent = card.name;
    
        const imageElement = document.createElement('img');
        // We can see from the API documentation that card_images is a key in the dictionary
        // that is the value of data key (outer dictionary), and the value of card_images is also
        // a dictionary with image_url as one of the keys
        imageElement.src = card.card_images[0].image_url;
        imageElement.alt = card.name;
    
        const typeElement = document.createElement('p');
        typeElement.textContent = 'Type: ' + card.type;
    
        const archetypeElement = document.createElement('p');
        archetypeElement.textContent = 'Archetype: ' + (card.archetype || 'N/A');
    
        cardElement.appendChild(nameElement);
        cardElement.appendChild(imageElement);
        cardElement.appendChild(typeElement);
        cardElement.appendChild(archetypeElement);
    }

    // Change as to not copy
    function checkStatus(response) {
        if (!response.ok) { // response.status >= 200 && response.status < 300
            throw Error(`Error in request: ${response.statusText}`);
        } // else, we got a response back with a good status code (e.g. 200)
        return response; // A resolved Response object.
    }

    // Change as to not copy
    function handleError(errMsg) {
        if (typeof errMsg === "string") {
            // qs("#message-area").textContent = errMsg;
            console.log(errMsg);
        } else {
            console.log("Hi");
            // the err object was passed, don't want to show it on the page;
            // instead use generic error message.
            // qs("#message-area").textContent =
            //     "An error ocurred fetching the Spotify data. Please try again later.";
        }
        // qs("#message-area").classList.remove("hidden");
    }
    
    init();
    
})();