// index.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlRoutes = require('./routes/sql');
const storageRoutes = require('./routes/storage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', sqlRoutes);
app.use('/api', storageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
