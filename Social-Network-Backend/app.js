const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const fs = require("fs");
const app = express();
require("dotenv").config();

//Connect to DataBase
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
mongoose.connection.on("error", (err) => console.log(err.message));

// Import required Routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.get("/", (req, res) => {
    fs.readFile("docs/API_Docs.json", (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        }

        const docs = JSON.parse(data);
        res.json(docs);
    });
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({
            error: "Unauthorized !!",
        });
    }
});

const port = process.env.PORT || 8080;
app.listen(port);
