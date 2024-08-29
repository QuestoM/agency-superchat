require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sendMessage } = require('./controllers/chatController');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', sendMessage);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));