const express = require('express');
const fs = require('fs/promises');
const app = express();
const PORT = 3000;

const SERVER_ERROR = 'Could not read data file. Please try again later.';
const CARD_ERROR = 'Card not found.';

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Get all cards
app.get('/api/cards', async (req, res) => {
    const cards = await readFromFile('cards.json');

    if (cards) {
        let filteredCards = cards;

        if (req.query.name) {
            filteredCards = filteredCards.filter(card =>
                card.name.toLowerCase().includes(req.query.name.toLowerCase()));
        }
        if (req.query.type) {
            filteredCards = filteredCards.filter(card => card.type === req.query.type);
        }
        if (req.query.level) {
            filteredCards = filteredCards.filter(card => card.level == req.query.level);
        }
        if (req.query.attribute) {
            filteredCards = filteredCards.filter(card => card.attribute.toLowerCase() ===
                req.query.attribute.toLowerCase());
        }
        if (req.query.archetype) {
            filteredCards = filteredCards.filter(card => card.archetype &&
                card.archetype.toLowerCase().includes(req.query.archetype.toLowerCase()));
        }

        res.json(filteredCards);
    }
});

// Get card by ID
app.get('/api/cards/:id', async (req, res) => {
    const cards = await readFromFile('cards.json');

    if (cards) {
        const card = cards.find(c => c.id === parseInt(req.params.id));
        if (!card) {
            res.status(404).send(CARD_ERROR);
            return;
        }
        res.json(card);
    }
});

// Create a new card
app.post('/api/cards', async (req, res) => {
    const cards = await readFromFile('cards.json');

    if (cards) {
        const card = {
            id: cards.length + 1,
            name: req.body.name,
            type: req.body.type,
            level: req.body.level,
            attribute: req.body.attribute,
            archetype: req.body.archetype,
            price: req.body.price,
            image_url: req.body.image_url
        };

        cards.push(card);

        // Converts object to JSON string that includes all properties and indentations of 2 spaces
        await fs.writeFile('cards.json', JSON.stringify(cards, null, 2));
        res.status(201).json(card);
    }
});

// Update a card
app.put('/api/cards/:id', async (req, res) => {
    const cards = await readFromFile('cards.json');

    if (cards) {
        const card = cards.find(c => c.id === parseInt(req.params.id));
        if (!card) {
            res.status(404).send(CARD_ERROR);
            return;
        }

        card.name = req.body.name;
        card.type = req.body.type;
        card.level = req.body.level;
        card.attribute = req.body.attribute;
        card.archetype = req.body.archetype;
        card.price = req.body.price;
        card.image_url = req.body.image_url;

        // Converts object to JSON string that includes all properties and indentations of 2 spaces
        await fs.writeFile('cards.json', JSON.stringify(cards, null, 2));
        res.json(card);
    }
});

// Delete a card
app.delete('/api/cards/:id', async (req, res) => {
    const cards = await readFromFile('cards.json');

    if (cards) {
        const card = cards.find(c => c.id === parseInt(req.params.id));
        if (!card) {
            res.status(404).send(CARD_ERROR);
            return;
        }

        cards = cards.filter(c => c.id !== parseInt(req.params.id));

        // Converts object to JSON string that includes all properties and indentations of 2 spaces
        await fs.writeFile('cards.json', JSON.stringify(cards, null, 2));
        res.json(card);
    }
});

// Create a new feedback
app.post('/api/feedback', async (req, res) => {
    let feedbacks = await readFromFile('feedback.json');

    if (feedbacks) {
        const feedback = {
            id: Date.now(),
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        };

        feedbacks.push(feedback);

        // Converts object to JSON string that includes all properties and indentations of 2 spaces
        await fs.writeFile('feedback.json', JSON.stringify(feedbacks, null, 2));
        res.status(201).json(feedback);
    }
});

// Get all FAQs
app.get('/api/faq', async (req, res) => {
    const faqs = await readFromFile('faq.json');
    if (faqs) {
        res.json(faqs);
    }
});

// Get promo cards
app.get('/api/promos', async (req, res) => {
    const cards = await readFromFile('cards.json');
    if (cards) {
        const promoCards = cards.filter(card => card.sale_price !== null);
        res.json(promoCards);
    }
});

app.listen(PORT);

/**
 * Reads JSON data from a given file and returns a JSON object representing that data. Sends a
 * 500 error code and returns null if the given file cannot be read from.
 * @param {string} file - File name
 * @returns {JSON} JSON object representing file data
 */
async function readFromFile(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } 
    catch (err) {
        handleFileError(err);
        return null;
    }
}

/**
 * Sends a 500 error code.
 * @returns {void} 
 */
function handleFileError(err) {
    res.status(500).send(SERVER_ERROR);
}
