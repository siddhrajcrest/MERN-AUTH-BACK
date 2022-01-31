// const mongoose = require("mongoose");
import mongoose from 'mongoose';

// const Schema = mongoose.Schema;
// Create Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
//   mobile:{
//     type:String,
//     required:true,
//     unique:true,
// },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  expireToken:Date,
  date: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model("users", UserSchema);
export default User;
