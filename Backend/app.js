const cors = require('cors');
const { join } = require('path');
const morgan = require('morgan');
const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const imageRouter = require('./routes/imageRouter');
const app = express();


app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "POST,OPTIONS",
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api', imageRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;