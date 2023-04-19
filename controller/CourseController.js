const CourseModel = require("../model/CourseModel")
class CourseController{
static coursebtech = async (req, res) => {
    //res.send("register")
   const result=await CourseModel.find() 
   res.render("coursebtech",);
  }
  static registerbtech = async (req, res)=>{
    try {
        const result = new CourseModel({
            name: req.body.name,
            email:req.body.email,
            number: req.body.number,
            gender:req.body.gender,
            dob:req.body.dob,
            address:req.body.address,
            college:req.body.college,
            course:req.body.course,
            branch:req.body.branch,
        })
        await result.save()
        res.redirect("/display", )
    } catch (error) {
        console.log(error)
    //  console.log(req.body)
  }
}
  static coursebca = async (req, res) => {
    //res.send("register")
    const result=await CourseModel.find() 
    res.render("coursebca",);
    // console.log (req.body)
  }
  static registerbca = async (req, res)=>{
    try {
        const result = new CourseModel({
            name: req.body.name,
            
            
        })
        await result.save()
        res.redirect("/register/userview",  )
          // console.log(req.body)
    } catch (error) {
        console.log(error)
   
   }
}
  static coursemca = async (req, res) => {
    try {
      const result = await CourseModel.find()
      res.render('userview',)
      // console.log(req.body)
    } catch (error) {
      console.log(error)
      
    }
    // res.render("coursemca");
}
static registermca = async (req, res)=>{
  try { 
      const result = new CourseModel({
          name: req.body.name,
          email:req.body.email,
          number: req.body.number,
          gender:req.body.gender,
          dob:req.body.dob,
          address:req.body.address,
          college:req.body.college,
          course:req.body.course,
          branch:req.body.branch,
      })
      await result.save()
      res.redirect('/register/userview' )
  } catch (error) {
      console.log(error)
   
  }
}
static Btechdisplay = async (req, res)=>{
  try {
    const {name,_id,email}=req.body
    const display = await CourseModel.findById(req.params.id)
    res.render('display')
  } catch (error) {
    console.log(error)
    
  }
}
// static registerview = async (req,res) =>{
//   try {
//     // const result = await (req,res)=>{
//         console.log(req.body)
//       } catch (error) {
        
//       }
//     }
    // const{name,email}=req.user
    // const result= { name: req.body.name,
    //   email:req.body.email,
    //   number: req.body.number,
    //   gender:req.body.gender,}
    //  console.log(result)
    // res.render("userview", {result} )
  // } catch (error) {
  //   console.log(error)
  // }
  
//}
} 
module.exports= CourseController