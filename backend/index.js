const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()
const PORT = 4000;

app.use(cors({ origin: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

// app.use('/api', proxy(process.env.API_ENDPOINT || 'http://localhost:3000', {
//   limit: '10mb'
// ));

app.use("/basic",require("./routes/basic"));
app.use("/nurse", require("./routes/basic/nurse"));
app.use("/patient", require("./routes/basic/patient"));
app.use("/level", require("./routes/basic/level"));
app.use("/rota", require("./routes/rota"));
app.use("/leave", require("./routes/leave"));

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});