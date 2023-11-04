require('./database/db')();
const express = require('express');
const app = express();
const cors = require('cors');

const corsOptions = {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": true,
      "optionsSuccessStatus": 204
}
    
app.use(cors(corsOptions))
app.use(express.json());

app.get('/', async (req, res) => {
      res.status(200).send('Hello World!');
});

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(5000, async (err) => {
      if(!err) {
            console.log("Server is ONNNNN!");
      } else {
            console.log("Server is OFFF!!");
      }
});
