const express = require('express');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
//router
const authRouter = require('./src/routes/auth');
const userRouter = require('./src/routes/user');
const movieRouter = require('./src/routes/movie');
const listRouter = require('./src/routes/list');

require('dotenv').config();

mongoose
    .connect(process.env.MONGO_URL,{})
    .then(() => console.log('Mongodb connected'))
    .catch((error) => console.log(error));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/movie", movieRouter);
app.use("/api/list", listRouter);

app.listen(8000, ()=>{
    console.log('Server running ...')
});