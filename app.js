const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let cards = [
    {
        id: 1,
        name: "Blue-Eyes White Dragon",
        type: "Normal Monster",
        level: 8,
        attribute: "LIGHT",
        archetype: "Blue-Eyes",
        price: 20.00,
        image_url: "https://images.ygoprodeck.com/images/cards/89631140.jpg"
    },
    {
        id: 2,
        name: "Dark Magician",
        type: "Normal Monster",
        level: 7,
        attribute: "DARK",
        archetype: "Dark Magician",
        price: 15.00,
        image_url: "https://images.ygoprodeck.com/images/cards/46986414.jpg"
    },
    {
        id: 3,
        name: "Red-Eyes Black Dragon",
        type: "Normal Monster",
        level: 7,
        attribute: "DARK",
        archetype: "Red-Eyes",
        price: 10.00,
        image_url: "https://images.ygoprodeck.com/images/cards/74677422.jpg"
    },
    {
        id: 4,
        name: "Stardust Dragon",
        type: "Synchro Monster",
        level: 8,
        attribute: "WIND",
        archetype: "Stardust",
        price: 30.00,
        image_url: "https://images.ygoprodeck.com/images/cards/44508094.jpg"
    }
];

// Get all cards
app.get('/api/cards', (req, res) => {
    let filteredCards = cards;

    // Filter by query parameters
    if (req.query.name) {
        filteredCards = filteredCards.filter(card => card.name.toLowerCase().includes(req.query.name.toLowerCase()));
    }
    if (req.query.type) {
        filteredCards = filteredCards.filter(card => card.type === req.query.type);
    }
    if (req.query.level) {
        filteredCards = filteredCards.filter(card => card.level == req.query.level);
    }
    if (req.query.attribute) {
        filteredCards = filteredCards.filter(card => card.attribute.toLowerCase() === req.query.attribute.toLowerCase());
    }
    if (req.query.archetype) {
        filteredCards = filteredCards.filter(card => card.archetype.toLowerCase().includes(req.query.archetype.toLowerCase()));
    }

    res.json(filteredCards);
});

// Get card by ID
app.get('/api/cards/:id', (req, res) => {
    const card = cards.find(c => c.id === parseInt(req.params.id));
    if (!card) return res.status(404).send('Card not found');
    res.json(card);
});

// Create a new card
app.post('/api/cards', (req, res) => {
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
    res.status(201).json(card);
});

// Update a card
app.put('/api/cards/:id', (req, res) => {
    const card = cards.find(c => c.id === parseInt(req.params.id));
    if (!card) return res.status(404).send('Card not found');

    card.name = req.body.name;
    card.type = req.body.type;
    card.level = req.body.level;
    card.attribute = req.body.attribute;
    card.archetype = req.body.archetype;
    card.price = req.body.price;
    card.image_url = req.body.image_url;

    res.json(card);
});

// Delete a card
app.delete('/api/cards/:id', (req, res) => {
    const card = cards.find(c => c.id === parseInt(req.params.id));
    if (!card) return res.status(404).send('Card not found');

    const index = cards.indexOf(card);
    cards.splice(index, 1);
    res.json(card);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
