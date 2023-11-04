const mongoose = require('mongoose');
require('dotenv').config();

const databaseConnection = () => {
      mongoose.connect(process.env.MONGO_CONNECTION_URL).then((err) => {
            console.log("Database Connected");
      }).catch((err) => {
            console.log("Connection Failed");
      });
};

module.exports = databaseConnection;