const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const UserModel =require("../model/UserModel")
// const mongoose =require('mongoose')
//  const UserModel = require("../db/connectdb");
// Require the Cloudinary library
// const cloudinary = require('cloudinary').v2
//const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: "dzdnamaqf",
//   api_key: "453969946325322",
//   api_secret: "I0XGUftEgyZR_H2FC7MeD8gTSoM",
// });
class FrontController {
  static dashboard = async (req, res) => {
    //res.send("register")
    res.render("dashboard");
  };
  static register = async (req, res) => {
    //res.send("register")
    res.render("register");
  };
  static about = async (req, res) => {
    //res.send("register")
    res.render("about");
  };
  static contact = async (req, res) => {
    //res.send("register")
    res.render("contact");
  };
  static logout = async (req, res) => {
    //res.send("register")
    try {
      res.clearCookie('token')
      res.redirect('/login');
    } catch (err) {
      console.log(err)
    }
  };


}

module.exports = FrontController;
