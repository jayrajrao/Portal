const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Contact = require("../model/Contact");
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
// static dashboard = async (req, res) => {
//   console.log("Logged in user:", req.user);
//   res.render("dashboard" ,{ user: req.user });
// };
 static dashboard = async (req, res) => {
    try {
      const courses = [
        {
          _id: "btech",
          name: "B.Tech",
          branch: "CSE",
          college: "MITS",
          description: "B.Tech is a professional undergraduate engineering degree",
          image: "/assets/images/card_image1.jpg",
        },
        {
          _id: "bca",
          name: "BCA",
          branch: "Computer Applications",
          college: "MITS",
          description: "BCA is a three-year Bachelor's Degree in Computer Application",
          image: "/assets/images/card_image2.jpg",
        },
        {
          _id: "mca",
          name: "MCA",
          branch: "Computer Science",
          college: "MITS",
          description: "MCA is a professional post-graduation degree in computer science",
          image: "/assets/images/card_image3.jpg",
        },
      ];

      res.render("dashboard", {
        user: req.user,
        courses, // ✅ yahan se EJS ko milega
      });
    } catch (err) {
      console.log(err);
      res.send("Something went wrong");
    }
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
    // POST → form submit / data insert
 static submitContact = async (req, res) => {
    try {
      const { name, email, phone, type, message } = req.body;

      await Contact.create({
        name,
        email,
        phone,
        type,
        message,
      });

      res.render("contact-success", { name });

    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to submit contact form");
    }
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
