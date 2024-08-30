const app = require('./app');
const mongoose = require('mongoose');

const dbURL =
  'mongodb+srv://a7med3del1973:nodejs123@cluster0.pnzxm.mongodb.net/TukRide';

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful !'))
  .catch((err) => console.log('DB connection error : ', err));

const PORT = 8080;
app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT} .`);
});
