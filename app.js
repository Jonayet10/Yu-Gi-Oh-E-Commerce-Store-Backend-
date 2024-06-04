const express = require('express');
// Cite: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS 
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory

app.use(express.static(path.join(__dirname, 'public')));

// Serve the main index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Function to read cards data from cards.json file
const readCardsFromFile = async () => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'cards.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading cards data:', err);
        return [];
    }
};

// Get all cards
app.get('/api/cards', async (req, res) => {
    let cards = await readCardsFromFile();
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

    res.setHeader('Content-Type', 'application/json');
    res.json(filteredCards);
});

// Get card by ID
app.get('/api/cards/:id', async (req, res) => {
    const cards = await readCardsFromFile();
    const card = cards.find(c => c.id === parseInt(req.params.id));
    if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
    }
    res.json(card);
});

// Create a new card
app.post('/api/cards', async (req, res) => {
    const cards = await readCardsFromFile();
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
    await fs.writeFile(path.join(__dirname, 'cards.json'), JSON.stringify(cards, null, 2));
    res.status(201).json(card);
});

// Update a card
app.put('/api/cards/:id', async (req, res) => {
    const cards = await readCardsFromFile();
    const card = cards.find(c => c.id === parseInt(req.params.id));
    if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
    }

    card.name = req.body.name;
    card.type = req.body.type;
    card.level = req.body.level;
    card.attribute = req.body.attribute;
    card.archetype = req.body.archetype;
    card.price = req.body.price;
    card.image_url = req.body.image_url;

    await fs.writeFile(path.join(__dirname, 'cards.json'), JSON.stringify(cards, null, 2));
    res.json(card);
});

// Delete a card
app.delete('/api/cards/:id', async (req, res) => {
    let cards = await readCardsFromFile();
    const card = cards.find(c => c.id === parseInt(req.params.id));
    if (!card) {
        res.status(404).json({ error: 'Card not found' });
        return;
    }

    cards = cards.filter(c => c.id !== parseInt(req.params.id));
    await fs.writeFile(path.join(__dirname, 'cards.json'), JSON.stringify(cards, null, 2));
    res.json(card);
});

// Create a new feedback
app.post('/api/feedback', async (req, res) => {
    const feedback = {
        id: Date.now(),
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    };

    let feedbacks = [];
    try {
        const data = await fs.readFile(path.join(__dirname, 'feedback.json'), 'utf8');
        feedbacks = JSON.parse(data);
    } catch (err) {
        console.error('Error reading feedback data:', err);
    }

    feedbacks.push(feedback);
    await fs.writeFile(path.join(__dirname, 'feedback.json'), JSON.stringify(feedbacks, null, 2));
    res.status(201).json(feedback);
});

// Serve the FAQ page
app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

// Read FAQ data from faq.json file
const readFAQFromFile = async () => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'faq.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading FAQ data:', err);
        return [];
    }
};

// Get all FAQs
app.get('/api/faq', async (req, res) => {
    const faqs = await readFAQFromFile();
    res.json(faqs);
});

// Get promo cards
app.get('/api/promos', async (req, res) => {
    const cards = await readCardsFromFile();
    const promoCards = cards.filter(card => card.sale_price !== null);
    res.json(promoCards);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
