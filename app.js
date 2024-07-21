const express = require('express');
const morgan = require('morgan');
const userRoute = require('./routes/userRoutes');
const driverRoute = require('./routes/driverRoutes');
const AppError = require('./utils/appError');
const glopalErrorHandler = require('./controllers/errorController');
const app = express();
app.use(express.json());

// app.use('/', (req, res) => {
//   res.send('Hello World !');
// });
// ROUTES
app.use('/user', userRoute);
app.use('/driver', driverRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server !`));
});
app.use(glopalErrorHandler);

const PORT = 8080;
app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}..`);
});
