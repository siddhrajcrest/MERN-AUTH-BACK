// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
// // Load input validation
// const validateRegisterInput = require("../../validation/register");
// const validateLoginInput = require("../../validation/login");
// // Load User model
// var User = require("../../models/User");
// const mongoose=require("mongoose");

import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import keys from '../../config/keys.js';
import keys from '../config/key.js'
// import validateRegisterInput from '../../validation/register.js';
import validateRegisterInput from '../validation/register.js';
// import validateLoginInput from '../../validation/login.js';
import validateLoginInput from '../validation/login.js';
// import User from '../../models/User.js';
import User from '../models/authuser.js';
import mongoose from 'mongoose';
let tokens="";
// const { db } = require("../../models/User");
var transporter=nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'complexapp258@gmail.com',
      pass: 'complex@24'
  }
})
const router=express.Router();
router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(200).json(errors);
    }
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(200).json({ emailalreadyexist: "Email already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
        //   mobile:req.body.mobile,
          password: req.body.password
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
        var mailoptions={
          from :'complexapp258@gmail.com',
          to: `${newUser.email}`,
          subject: 'Welcome to Kart App',
          text: 'Welcome to kart app',
        }
        transporter.sendMail(mailoptions, function(error,info){
          if(error){
            console.log(error);
          }
          else{
            console.log('Email sent' + info.response);
          }
        })
      }
    });
  });

  router.post("/login", (req, res) => {
    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(200).json(errors);
    }
  const email = req.body.email;
    const password = req.body.password;
  // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(200).json({ emailnotfound: "Email not found" });
      }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // console.log(email);
          // var query_name=user.findOne({email},{"name":1})
          // console.log(query_name);
          // console.log(name);
          // User matched
          // Create JWT Payload
          const payload = {
            email: user.email,
            id: user.id,
            name: user.name
          };
  // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({success: true,  token: "Bearer " + token, }); //Sending Success Response
              // console.log(token);
              // localStorage.setItem('token',token);
            }
          );
        } else {
          return res
            .status(200)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

  router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
      if(err){
        console.log(err);
      }
      else{
        const token=buffer.toString("hex");
        User.findOne({email: req.body.email})
        .then(user=>{
          if(!user){
            return res.status(200).json({error: 'Email does not exist'});
          }
          user.resetToken=token
          user.expireToken=Date.now() + 3600000 //Token valid for 1 hour
          user.save().then((result)=>{
            transporter.sendMail({
              to: user.email,
              from:'complexapp258@gmail.com',
              subject: 'Password ResetLink',
              html: `
              <p>You requested for Password Reset</p>
              <h5>Click on this <a href="http://localhost:3000/reset/${token}>link to reset the password </h5>
              `
            })
            res.json({message: 'Reset Link email sent Successfully'});
          })
        })
    
      }
    })
  })

  router.post("/updatepassword",(req,res)=>{
    const newPassword=req.body.password;
    const sentToken=req.body.token;
    User.findOne({resetToken: sentToken, expireToken: {$gt: Date.now()}})
    .then(user=>{
      if(!user){
        return res.status(200).json({error: 'Try Again, Session Expired'})
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPassword, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.resetToken=undefined;
          user.expireToken=undefined;
          user
            .save()
            .then(user => res.json({message: `Password Changed for User ${user.name}`}))
            .catch(err => console.log(err));
        });
      });
    })
  })

  router.post('/changepassword', (req,res)=>{
    const newpassword=req.body.password;
    const id=req.body.id;
    User.findById(id)
    .then(user=>{
      if(!user){
        return res.status(200).json({error: 'USer id Does not match'})
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newpassword, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash,
          user
            .save()
            .then(user => res.json({message: `Password Changed for User ${user.name}`}))
            .catch(err => console.log(err));
        });
      });

    })
  })
export default router;