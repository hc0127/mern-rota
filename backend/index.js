const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

app.use(cors({ origin: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.NODE_ENV == "development"?process.env.DEVELOPMENT_URL:process.env.PRODUCTION_URL, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use("/basic", require("./routes/basic"));
app.use("/nurse", require("./routes/basic/nurse"));
app.use("/patient", require("./routes/basic/patient"));
app.use("/level", require("./routes/basic/level"));
app.use("/rota", require("./routes/rota"));

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});