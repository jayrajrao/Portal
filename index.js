const express = require("express");
const index = express();
var session = require("express-session");
const port = 3003;
var bodyParser = require("body-parser");
index.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
index.use(bodyParser.json());

// create application/json parser
var jsonParser = bodyParser.json()

// parse various different custom JSON types as JSON
index.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
index.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
index.use(bodyParser.text({ type: 'text/html' }))
// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// index.use(express.urlencoded({ extended: false }));
// index.use(express.json());
index.use(express.urlencoded({ extended: true }));


const users_auth = require("./midellware/auth");

const cookieParser = require("cookie-parser");
index.use(cookieParser());

const fileupload = require("express-fileupload");
index.use(fileupload({ useTempFiles: true }));

const cloudinary = require("cloudinary");

const flash = require("connect-flash");

index.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

index.use(flash());

const FrontController = require("./controller/FrontController");
const UserController = require("./controller/UserController");
const CourseController = require("./controller/CourseController");
// mongo db connection
const connectDB = require("./db/connectdb");
const user_auth = require("./midellware/auth");
connectDB();
//setup ejs
index.set("view engine", "ejs");
index.use(express.static("public"));

//frontend controllers
index.get("/dashboard", users_auth, FrontController.dashboard);
index.get("/about", users_auth, FrontController.about);
index.get("/contact", users_auth, FrontController.contact);
index.get("/logout", users_auth, FrontController.logout);
index.get("/register", FrontController.register);



//login register panel
index.get("/login", UserController.login);
index.post("/verify_login", UserController.verifylogin);
index.get("/registeruser", UserController.registeruser);
index.post("/register", UserController.register);

//coursecontrollers
index.get("/coursebtech", CourseController.coursebtech);
index.get("/coursemca", CourseController.coursemca);
index.get("/coursebca", CourseController.coursebca);
index.post("/register/btech", CourseController.registerbtech);
index.post("/register/mca", CourseController.registermca);
index.post("/register/bca", CourseController.registerbca);
// index.get("/register/userview", CourseController.registerview);
index.get("/display", CourseController.Btechdisplay)






index.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
