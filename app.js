const express = require('express');
const app = express();

// app.use(express.json());
app.use('/api/test', (req, res) => {
  res.send(`Hello from the Tukdrive app...`);
});

// Routes
app.use('/api/drivers', driverRouter);
app.use('/api/users', userRouter);

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fial',
    message: `can't find ${req.originalUrl} on this server !`,
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`TukRide is running on port ${PORT}...`);
});
