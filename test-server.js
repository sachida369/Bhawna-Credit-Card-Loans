const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

// Serve static files from the root directory
app.use(express.static('.'));

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Static site server running at http://localhost:${port}`);
    console.log('HTML/CSS/JS version ready for GitHub Pages deployment!');
});