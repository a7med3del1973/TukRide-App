const express = require('express');
const app = express();

const userRoute = require('./routes/userRoutes');
const driverRoute = require('./routes/driverRoutes');
// const driverRoute = require('./routes/driverRoutes');

app.use(express.json());

// app.use('/', (req, res) => {
//   res.send('Hello World !');
// });
// ROUTES
app.use('/user', userRoute);
app.use('/driver', driverRoute);
const PORT = 8080;
app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}..`);
});
