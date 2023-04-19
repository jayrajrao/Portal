const mongoose =require('mongoose')

const connectDB =()=>{
  return mongoose.connect('mongodb://127.0.0.1:27017/Admission_portal')
  .then(()=>{
    console.log('connection havs  succesfully')
  })
  .catch((err)=>{
  console.log(err)
  })
}
mongoose.set('strictQuery', false);
module.exports=connectDB