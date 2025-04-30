/**
 * Node.js Server for Canvas Rendering Application
 * Serves the application content on port 3002
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop the server`);
});