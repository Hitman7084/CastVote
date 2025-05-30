const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// env vars
dotenv.config();

// db connection
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// routes for user and poll 
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});