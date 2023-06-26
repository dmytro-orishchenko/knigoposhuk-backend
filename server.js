const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const bookRoute = require("./routes/book");
const authorRoute = require("./routes/author");
const commentRoute = require("./routes/comment");


dotenv.config();
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    origin: 'http://localhost:3000'
}))

mongoose?.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);
app.use("/api/author", authorRoute);
app.use("/api/comment", commentRoute);

app.use((err, req, res, next) => {
    console.log(err)
    res
        ?.status(err?.status || 500)
        ?.send({
            error: err?.message || 'Unknown Error',
            code: err?.status || 500
        });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend is running on port: ${PORT}`);
});