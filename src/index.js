const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple health endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Express CI/CD pipeline!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;