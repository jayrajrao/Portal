const ApplicationModel = require("../model/ApplicationModel");
const CourseModel = require("../model/CourseModel");


// then Application create karna
async function createApplicationFromRequest(req, res, redirectPath) {
  const {
    name,
    email,
    number,
    gender,
    dob,
    address,
    college,
    course,  // yahan form se course name aayega (e.g. "B.Tech")
    branch,
  } = req.body;

  if (!req.user) {
    // Safety: middleware ne user set nahi kiya ho
    return res.redirect("/login");
  }

  // Course master find / create (normalize data)
  const courseDoc = await CourseModel.findOneAndUpdate(
    {
      name: course,  // "B.Tech", "BCA", "MCA" etc.
      branch,
      college,
    },
    {
      name: course,
      branch,
      college,
    },
    {
      new: true,
      upsert: true, // agar nahi mila to create kar dega
    }
  );

  // Application create
  await ApplicationModel.create({
    user: req.user._id,
    course: courseDoc._id,
    name,
    email,
    number,
    gender,
    dob,      // Mongoose string ko Date me cast karega (agar format sahi ho)
    address,
    college,
    branch,
    status: "pending",
    comment: "Wait",
  });

  return res.redirect(redirectPath);
}

class CourseController {
  // ====================== B.Tech ======================
  static coursebtech = async (req, res) => {
    try {
      // Agar chahe to yahan bhi B.Tech course fetch karke view ko bhej sakte ho
      const course = await CourseModel.findOne({ name: "B.Tech", active: true });
      res.render("coursebtech", {
        user: req.user,
        course, // optional: form me hidden field ke liye use kar sakte ho
      });
    } catch (error) {
      console.log(error);
      res.send("Error loading B.Tech form");
    }
  };

  static registerbtech = async (req, res) => {
    try {
      await createApplicationFromRequest(req, res, "/display");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while submitting B.Tech form");
    }
  };

  // ====================== BCA ======================
  static coursebca = async (req, res) => {
    try {
      const course = await CourseModel.findOne({ name: "BCA", active: true });
      res.render("coursebca", {
        user: req.user,
        course,
      });
    } catch (error) {
      console.log(error);
      res.send("Error loading BCA form");
    }
  };

  static registerbca = async (req, res) => {
    try {
      await createApplicationFromRequest(req, res, "/display");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while submitting BCA form");
    }
  };

  // ====================== MCA ======================
  static coursemca = async (req, res) => {
    try {
      const course = await CourseModel.findOne({ name: "MCA", active: true });
      res.render("coursemca", {
        user: req.user,
        course,
      });
    } catch (error) {
      console.log(error);
      res.send("Error loading MCA form");
    }
  };

  static registermca = async (req, res) => {
    try {
      await createApplicationFromRequest(req, res, "/display");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while submitting MCA form");
    }
  };

  // ====================== Display (My Applications type) ======================
  // static Btechdisplay = async (req, res) => {
  //   try {
  //     if (!req.user) {
  //       return res.redirect("/login");
  //     }

  //     // Current user ke saare applications
  //     const applications = await ApplicationModel.find({ user: req.user._id })
  //       .populate("course")
  //       .sort({ createdAt: -1 });

  //     res.render("display", {
  //       user: req.user,
  //       applications,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.send("Error loading applications");
  //   }
  // };
// Display user's applications (replace existing Btechdisplay)
static Btechdisplay = async (req, res) => {
  try {
    if (!req.user) return res.redirect('/login');

    const applications = await ApplicationModel.find({ user: req.user._id })
      .populate({ path: 'course', select: 'name college branch' }) // populate name only
      .sort({ createdAt: -1 })
      .lean(); // return plain objects

    // quick debug log (remove/comment in production)
    // console.log('Applications fetched for user:', req.user._id, applications.length);

    res.render('display', {
      user: req.user,
      applications,
    });
  } catch (error) {
    console.error('Btechdisplay error:', error);
    res.status(500).send('Error loading applications');
  }
};

   // ================= VIEW APPLICATION =================
  static viewCourse = async (req, res) => {
    try {
      const appDoc = await ApplicationModel
        .findById(req.params.id)
        .populate("course");

      if (!appDoc) {
        return res.status(404).send("Application not found");
      }

      // optional security: sirf apna hi form dekh paaye
      if (String(appDoc.user) !== String(req.user._id)) {
        return res.status(403).send("Not allowed to view this application");
      }

      res.render("view_course", {
        user: req.user,
        app: appDoc,
      });
    } catch (error) {
      console.log("VIEW COURSE ERROR:", error);
      res.status(500).send("Server error while viewing application");
    }
  };

  // ================= EDIT APPLICATION (GET) =================
  static editCourseForm = async (req, res) => {
    try {
      const appDoc = await ApplicationModel
        .findById(req.params.id)
        .populate("course");

      if (!appDoc) {
        return res.status(404).send("Application not found");
      }

      if (String(appDoc.user) !== String(req.user._id)) {
        return res.status(403).send("Not allowed to edit this application");
      }

      if (appDoc.status !== "pending") {
        return res.send("You cannot edit this application once it is " + appDoc.status);
      }

      res.render("edit_course", {
        user: req.user,
        app: appDoc,
      });
    } catch (error) {
      console.log("EDIT COURSE FORM ERROR:", error);
      res.status(500).send("Server error while loading edit form");
    }
  };

  // ================= EDIT APPLICATION (POST / UPDATE) =================
  static editCoursePost = async (req, res) => {
    try {
      const appDoc = await ApplicationModel.findById(req.params.id);

      if (!appDoc) {
        return res.status(404).send("Application not found");
      }

      if (String(appDoc.user) !== String(req.user._id)) {
        return res.status(403).send("Not allowed to edit this application");
      }

      if (appDoc.status !== "pending") {
        return res.send("You cannot edit this application once it is " + appDoc.status);
      }

      const {
        name,
        email,
        number,
        gender,
        dob,
        address,
        college,
        branch,
      } = req.body;

      appDoc.name = name;
      appDoc.email = email;
      appDoc.number = number;
      appDoc.gender = gender;
      appDoc.dob = dob; // if needed: new Date(dob)
      appDoc.address = address;
      appDoc.college = college;
      appDoc.branch = branch;

      await appDoc.save();

      res.redirect("/display");
    } catch (error) {
      console.log("EDIT COURSE POST ERROR:", error);
      res.status(500).send("Server error while updating application");
    }
  };
}


module.exports = CourseController;
