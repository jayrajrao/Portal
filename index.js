const express = require("express");
const app = express();
const path = require("path");
const port = 3003;

const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const flash = require("connect-flash");

// ====== MIDDLEWARE: body parsers (simple rakho) ======
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// ya chaho to sirf:
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// ====== Static files ======
// yahan se `/assets/...` wale URL serve honge
app.use(express.static(path.join(__dirname, "public")));

// ====== Cookies ======
app.use(cookieParser());

// ====== File upload (agar docs/image use karoge) ======
app.use(fileupload({ useTempFiles: true }));

// ====== Session + Flash ======
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // 60,000 ms = 1 min, bohot kam hai
      // isse thoda badha lo, jaise 1 ghanta:
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(flash());

// ====== View engine ======
app.set("view engine", "ejs");
app.use(express.static("public"));
// ====== Auth middleware ======
const users_auth = require("./midellware/auth");
const adminAuth = require('./midellware/admin_auth');
// ====== DB connect ======
const connectDB = require("./db/connectdb");
connectDB();




// ====== Controllers ======
const AdminController = require("./controller/AdminController")
const FrontController = require("./controller/FrontController");
const UserController = require("./controller/UserController");
const CourseController = require("./controller/CourseController");







// Admin login (public)
app.get('/admin/login', AdminController.loginPage);
app.post('/admin/verify_login', AdminController.verifyLogin);

// Protected admin pages (users_auth must set req.user)
app.get('/admin/dashboard', users_auth, adminAuth, AdminController.dashboard);
app.get('/admin/applications', users_auth, adminAuth, AdminController.listApplications);

// Change status route
app.post('/admin/application/:id/status', users_auth, adminAuth, AdminController.changeStatus);

// Admin logout
app.get('/admin/logout', users_auth, adminAuth, AdminController.logout);
app.get('/admin/courses', users_auth, adminAuth, AdminController.listCourses);
app.post('/admin/courses/add', users_auth, adminAuth, AdminController.addCoursePost);
app.post('/admin/courses/:id/delete', users_auth, adminAuth, AdminController.deleteCourse);
app.post('/admin/courses/:id/toggle', users_auth, adminAuth, AdminController.toggleCourseActive);

// Users management
app.get('/admin/users', users_auth, adminAuth, AdminController.listUsers);
app.post('/admin/users/:id/delete', users_auth, adminAuth, AdminController.deleteUser);
// ================= FRONT PAGES (protected) =================
app.get("/dashboard", users_auth, FrontController.dashboard);
app.get("/about", users_auth, FrontController.about);
app.get("/contact", users_auth, FrontController.contact);
app.post("/contact", FrontController.submitContact);
app.get("/logout", users_auth, FrontController.logout);
app.get("/register", FrontController.register);
// FORGOT PASSWORD (static controller methods)
app.get("/forgot-password", UserController.forgotPage);
app.post("/forgot-password", UserController.forgotPassword);

// ================= AUTH ROUTES =================
app.get("/", UserController.login);
app.get("/login", UserController.login);
app.post("/verify_login", UserController.verifylogin);
app.get("/registeruser", UserController.registeruser);
app.post("/register", UserController.register);

// ================= COURSE ROUTES =================
// yahan user logged-in hona chahiye:
app.get("/coursebtech", users_auth, CourseController.coursebtech);
app.get("/coursemca", users_auth, CourseController.coursemca);
app.get("/coursebca", users_auth, CourseController.coursebca);

// form submit:
app.post("/register/btech", users_auth, CourseController.registerbtech);
app.post("/register/mca", users_auth, CourseController.registermca);
app.post("/register/bca", users_auth, CourseController.registerbca);

// applications display (my applications type)
app.get("/display", users_auth, CourseController.Btechdisplay);

app.get("/viewcourse/:id", users_auth, CourseController.viewCourse);
app.get("/editcourse/:id", users_auth, CourseController.editCourseForm);
app.post("/editcourse/:id", users_auth, CourseController.editCoursePost);
// ================= START SERVER =================
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});