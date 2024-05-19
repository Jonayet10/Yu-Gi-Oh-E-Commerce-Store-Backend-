(function() {
    "use strict";
    
    const BASE_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

    async function init() {
        await fetchCardByName('Blue-Eyes White Dragon'); // Fetch by card name
    }
    
    async function fetchCardByName(cardName) {
        const endpoint = new URL(BASE_URL);
        // Use the 'name' parameter to search by card name
        endpoint.searchParams.append('name', cardName);
        // searchParams.append quatomatically manages the query string formatting, which includes
        // adding the '?' character before the query parameters
    
        try {
            const resp = await fetch(endpoint);
            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.statusText}`);
            }
            const data = await resp.json();
            // Looking at API documentation, we see that the json is in the form with data as a key
            if (data.data && data.data.length > 0) {
                console.log('Card details:', data.data[0]);
                displayCardDetails(data.data[0]);
                return data.data[0]; // Return details of the first card found
            } else {
                console.log('No card found with the name:', cardName);
            }
        } catch (err) {
            console.error('Failed to fetch card details:', err);
        }
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
    
    init();
    
})();