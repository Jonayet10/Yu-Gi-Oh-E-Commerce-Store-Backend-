(function() {
    "use strict";
    
    const BASE_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?';

    async function init() {
        // Get form UI element from HTML
        const form = document.getElementById('filter-form');
        // Add event listener to form to handle submit event
        form.addEventListener('submit', async (event) => {
            // Prevent default form submission behavior
            event.preventDefault();
            // Holds the search parameters, extracting values from the form fields
            const params = {
                name: form.elements['name'].value,
                type: form.elements['type'].value,
                race: form.elements['race'].value,
                attribute: form.elements['attribute'].value,
                archetype: form.elements['archetype'].value
            };
            // Call fetchCards with the paramaters from the form user fills out
            await fetchCards(params);
        });
    }
    
    async function fetchCards(params) {
        // Builds query by filtering out undefined, null, or empty parameters, and appends params
        // to base URL
        let query = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        const url = `${BASE_URL}${query}`;
        console.log(`Fetching URL: ${url}`);
       
        // Performs API request with response handling (checkStatus)
        fetch(url, {
            method: "GET",
        })
        .then(checkStatus)
        .then(response => response.json())
        .then(response => {
            // Obtain elements for displaying cards and no cards message from HTML
            const cardElement = document.getElementById('card-details');
            const noCardsMessage = document.getElementById('no-cards-message');

            // Checks if the response has any cards
            if (response.data && response.data.length > 0) {
                // Shuffle the array of cards to randomize every time query is made
                const shuffledCards = shuffleArray(response.data);
                // Select first 8 cards for the store
                const cards = shuffledCards.slice(0, 8);
                // Display new card details
                displayCardDetails(cards);
                // Hide the no cards message
                noCardsMessage.classList.add('hidden');
                noCardsMessage.classList.remove('visible');
            } else {
                // Clear previous card details
                cardElement.innerHTML = '';
                // Show no cards message
                noCardsMessage.classList.add('visible');
                noCardsMessage.classList.remove('hidden');
            }
        })
        .catch(error => {
            handleError(error);
            const cardElement = document.getElementById('card-details');
            const noCardsMessage = document.getElementById('no-cards-message');
            // Clear any previous card details
            cardElement.innerHTML = '';
            // Show no cards message when error
            noCardsMessage.classList.add('visible');
            noCardsMessage.classList.remove('hidden');
        });
    }
    
    function displayCardDetails(cards) {
        const cardElement = document.getElementById('card-details');
        cardElement.innerHTML = ''; 

        cards.forEach(card => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';

            const nameElement = document.createElement('h2');
            nameElement.textContent = card.name;

            const imageElement = document.createElement('img');
            imageElement.src = card.card_images[0].image_url;
            imageElement.alt = card.name;

            const typeElement = document.createElement('p');
            typeElement.textContent = 'Type: ' + card.type;

            const archetypeElement = document.createElement('p');
            archetypeElement.textContent = 'Archetype: ' + (card.archetype || 'N/A');

            cardContainer.appendChild(nameElement);
            cardContainer.appendChild(imageElement);
            cardContainer.appendChild(typeElement);
            cardContainer.appendChild(archetypeElement);

            cardElement.appendChild(cardContainer);
        });
    }

    function checkStatus(response) {
        if (!response.ok) {
            throw Error(`Error in request: ${response.statusText}`);
        }
        return response;
    }

    function handleError(errMsg) {
        console.error(errMsg);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    init();
})();
