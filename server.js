// first require
const express = require("express");
const connectDB = require("./config/db");

// package.json script edits:
// "start": "node server", not for use atm
// "server": "nodemon server" nodemon constantly refreshes

const app = express();

//Connect db function exported from db.js
connectDB();

//middleware init
app.use(express.json({ extended: false }));

//create port variable which will check for a
//local environment port OR default 5000

//get request, response confirming API connected
app.get("/", (req, res) => res.send("API Running"));

// routing init
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
console.log("hello world");
//connect t

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
