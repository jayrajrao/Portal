const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class UserController {
 
  static dashboard = async (req, res) => {
    //res.send("register")
    res.render("dashboard");
  };
  static registeruser = async (req, res) => {
    res.render("register", { message: req.flash("error") });
  };
  static register = async (req, res) => {
    try {
      //console.log(req.body)

      const { name, email, password, cpassword } = req.body;
      const user = await UserModel.findOne({ email: email });
      // console.log(user)
      if (user) {
        req.flash("error", "email allready exists");
        res.redirect("/registeruser");
      } else {
        if (name && email && password && cpassword) {
          if (password == cpassword) {
            try {
              const hashpassword = await bcrypt.hash(password, 10);
              const result = new UserModel({
                name: name,
                email: email,
                password: hashpassword,
              });
              await result.save();
              req.flash(
                "congratulation",
                "Registered sucessfully",
                "Please login ahead"
              );
              res.redirect("/login");
            } catch (err) {
              console.log(err);
            }
          } else {
            req.flash("error", "Password and confirm password doesnot match");
            res.redirect("/registeruser");
          }
        } else {
          req.flash("error", "All Field are required");
          res.redirect("/registeruser");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  static login = (req, res) => {
    //res.send("register")
    res.render("login", { message: req.flash("success") });
  };
  static verifylogin = async (req, res) => {
    try {
      //console.log(req.body)
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const ismatched = await bcrypt.compare(password, user.password);
          if (user.email == email && ismatched) {
           //webtoken Generate 
            const token = jwt.sign({ id: user._id }, 'jayrajrao8269');
            //console.log(token)
            res.cookie('token', token)
            res.redirect("dashboard");
          } else {
            req.flash("error", "email or password not match");
            res.redirect("/login");
          }
        } else {
          req.flash("error", "You are not registerd user");
          res.redirect("/login");
        }
      } else {
        req.flash("error", "All Field are required");
        res.redirect("/login");
      }
    } catch (error) {}
  };



 
 // static logout = async (req, res) => {
  //   //res.send("register")
  //   try {
  //     res.clearCookie('token')
  //     res.redirect('/login');
  //   } catch (err) {
  //     console.log(err)
  //   }
  // };
}



module.exports = UserController;




// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDk4ODM0ZDBiOTk2ZWI0YTE3MTFiNyIsImlhdCI6MTY3ODM1Njg4Nn0.Z57ssYffDLzuSQcMThCJMd6mLQNNIFum5PpSTqnBe70