require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const blogRoutes = require('./routes/blogRoutes');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to database
connectDB();


// Root route
app.get('/', (req, res) => res.send('MERN Analytics Dashboard Backend Running'));



app.use('/api', blogRoutes);
// ...rest unchanged...


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
