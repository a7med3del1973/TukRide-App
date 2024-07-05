const express = require("express");
const app = express();

// app.use(express.json());
app.use("/api/test", (req, res) => {
  res.send(`Hello from the Tukdrive app...`);
});
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`TukRide is running on port ${PORT}...`);
});
