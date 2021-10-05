const express = require('express');
const cors = require('cors');
const request = require('request');

// starting express
const app = express();
app.use(express.json());
app.use(cors());

// routers
const posts = require('./routes/api/posts')
app.use('/api/posts', posts)


// starting server
const port = process.env.PORT || 5000;
app.listen(port , () => console.log(`Server started on port : ${port}`));




