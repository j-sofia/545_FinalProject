const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the homepage (admin panel)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route for form submission
app.get('/form', (req, res) => {
    const style = req.query.style || 'Professional';
    const pages = req.query.pages || 1;
    const guid = req.query.guid || 'bad-config';
    res.render('form', { style, pages, guid});
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
