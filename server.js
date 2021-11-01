// const express =require("express")
// const mongoose = require("mongoose")
// const bodyParser=require("body-parser")
// const cors= require("cors");

import express from 'express';
import  mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/posts.js';
import Category from './routes/category.js';
import users from './routes/users.js'
import dbconfig from './config/key.js';
// import passport from 'passport';
// import users from './routes/users.js';
// import router from './routes/posts.js';
// import db from './config/key.js';
// const items = require("./routes/api/items")
const app= express();
// const routes=require('./routes/posts');
app.use(bodyParser.json());



//DB config
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
// const db=require('./config/key').mongoURI;

//routing to different urls
app.use('/posts', routes);
app.use("/api/users", users);
app.use("/category",Category);
// app.use("/register", routes);
const PORT= process.env.PORT || 3500;
//connnect to mongo
const db =dbconfig.mongoURI;
mongoose
    .connect(db)
    .then(()=>app.listen(PORT, ()=>console.log(`server running on port: ${PORT}`)))
    .catch((error) =>console.log(error.message));
    // mongoose.set('useFindAndModify', false);
//Use routes
// app.use('/api/items', items);
// app.use(passport.initialize());
// // Passport config
// // require("./config/passport")(passport);
// import pp from './config/passport.js';
// pp(passport);
// // Routes
// app.use("/api/users", users);

