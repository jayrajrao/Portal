

// controller/AdminController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const UserModel = require('../model/UserModel');
const ApplicationModel = require('../model/ApplicationModel');
const CourseModel = require('../model/CourseModel');

class AdminController {
  // GET admin login page
  static loginPage = async (req, res) => {
    res.render('admin/login', { error: req.flash('error'), message: req.flash('success') });
  };

  // POST verify admin login
  static verifyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        req.flash('error', 'All fields required');
        return res.redirect('/admin/login');
      }

      const user = await UserModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/admin/login');
      }

      // ensure role is admin
      if (user.role !== 'admin') {
        req.flash('error', 'Not authorized as admin');
        return res.redirect('/admin/login');
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/admin/login');
      }

      // generate token (same secret as user login)
      const token = jwt.sign({ id: user._id }, 'jayrajrao8269');

      // set cookie and redirect to admin dashboard
      res.cookie('token', token, { httpOnly: true }); // add secure: true in prod (https)
      return res.redirect('/admin/dashboard');
    } catch (err) {
      console.error('Admin verifyLogin error:', err);
      req.flash('error', 'Server error');
      return res.redirect('/admin/login');
    }
  };

  // GET admin dashboard (protected by admin_auth)
  static dashboard = async (req, res) => {
    try {
      // fetch quick stats
      const totalApps = await ApplicationModel.countDocuments();
      const pending = await ApplicationModel.countDocuments({ status: 'pending' });
      const approved = await ApplicationModel.countDocuments({ status: 'approved' });
      const rejected = await ApplicationModel.countDocuments({ status: 'rejected' });

      // optionally fetch recent applications
      const recent = await ApplicationModel.find()
        .populate('user', 'name email')
        .populate('course', 'name college branch')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      res.render('admin/dashboard', {
        admin: req.user,
        stats: { totalApps, pending, approved, rejected },
        recent,
      });
    } catch (err) {
      console.error('Admin dashboard error:', err);
      res.status(500).send('Server error');
    }
  };


  // Show courses management page
static listCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find().sort({ createdAt: -1 }).lean();
    res.render('admin/courses', { admin: req.user, courses });
  } catch (err) {
    console.error('Admin listCourses error:', err);
    res.status(500).send('Server error');
  }
};

// Show form to add course (or render on same page)
static addCoursePost = async (req, res) => {
  try {
    const { name, branch, college, duration, seats } = req.body;
    if (!name || !branch || !college) {
      req.flash('error', 'Name, branch and college are required');
      return res.redirect('/admin/courses');
    }
    await CourseModel.create({
      name: name.trim(),
      branch: branch.trim(),
      college: college.trim(),
      duration: duration ? duration.trim() : '3 Years',
      seats: seats ? Number(seats) : 60,
      active: true,
    });
    req.flash('success', 'Course added');
    res.redirect('/admin/courses');
  } catch (err) {
    console.error('addCoursePost error:', err);
    req.flash('error', 'Failed to add course');
    res.redirect('/admin/courses');
  }
};

// Delete a course
static deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;
    await CourseModel.findByIdAndDelete(id);
    req.flash('success', 'Course deleted');
    res.redirect('/admin/courses');
  } catch (err) {
    console.error('deleteCourse error:', err);
    req.flash('error', 'Failed to delete course');
    res.redirect('/admin/courses');
  }
};

// Toggle active/inactive for course
static toggleCourseActive = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await CourseModel.findById(id);
    if (!course) return res.redirect('/admin/courses');
    course.active = !course.active;
    await course.save();
    req.flash('success', 'Course updated');
    res.redirect('/admin/courses');
  } catch (err) {
    console.error('toggleCourseActive error:', err);
    req.flash('error', 'Failed to update');
    res.redirect('/admin/courses');
  }
};

// List all users
static listUsers = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 }).lean();
    res.render('admin/users', { admin: req.user, users });
  } catch (err) {
    console.error('Admin listUsers error:', err);
    res.status(500).send('Server error');
  }
};

// Delete user (careful: this will remove user; you may want soft-delete)
static deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await UserModel.findByIdAndDelete(id);
    // optionally also remove their applications: await ApplicationModel.deleteMany({ user: id });
    req.flash('success', 'User deleted');
    res.redirect('/admin/users');
  } catch (err) {
    console.error('deleteUser error:', err);
    req.flash('error', 'Failed to delete user');
    res.redirect('/admin/users');
  }
};
  // GET list of all applications (admin)
  static listApplications = async (req, res) => {
    try {
      const apps = await ApplicationModel.find()
        .populate('user', 'name email')
        .populate('course', 'name college branch')
        .sort({ createdAt: -1 })
        .lean();

      res.render('admin/applications', { admin: req.user, applications: apps });
    } catch (err) {
      console.error('Admin listApplications error:', err);
      res.status(500).send('Server error');
    }
  };

  // POST change application status (approve/reject)
  static changeStatus = async (req, res) => {
    try {
      const id = req.params.id;
      const { status, comment } = req.body;
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        req.flash('error', 'Invalid status');
        return res.redirect('back');
      }
      const app = await ApplicationModel.findById(id);
      if (!app) {
        req.flash('error', 'Application not found');
        return res.redirect('back');
      }
      app.status = status;
      if (comment) app.comment = comment;
      await app.save();

      req.flash('success', 'Application updated');
      return res.redirect('/admin/applications');
    } catch (err) {
      console.error('Admin changeStatus error:', err);
      req.flash('error', 'Failed to update');
      return res.redirect('back');
    }
  };

  // admin logout
  static logout = async (req, res) => {
    try {
      res.clearCookie('token');
      res.redirect('/admin/login');
    } catch (err) {
      console.error('Admin logout error:', err);
      res.redirect('/admin/login');
    }
  };
}

module.exports = AdminController;
