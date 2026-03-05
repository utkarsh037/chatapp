const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  verified:{
    type:Boolean,
    default:false
  }
},{timestamps:true})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign(
        {
            _id:this._id,
            email:this.email
        },
        process.env.JWTPRIVATEKEY,
        {expiresIn:"7d"}
    )
    return token
}

const User = mongoose.model("User",userSchema)

module.exports = User