const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs');
const { findOne } = require('./task');
const Task = require('./task')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                 throw new Error('Email is wrong');
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 7,
        validate(value){
            if(validator.contains(value,"password",{ignoreCase:true})){
                throw new Error('Password should not contain text Password')
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('age can not be negative');
            }
        }
    },
    avatar:{
        type:Buffer
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],},
    {
        timestamps:true
    }
);

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject =  user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;   
    return userObject;
}
userSchema.methods.generateAuthToken =  async function(){
    const user = this;
   
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});
    
    await user.save();
    
    return token;

}
userSchema.statics.findByCredentials = async (email,password)=>{
    
    const user = await User.findOne({email});
    
    if(!user){
       throw new Error('no user with email')
    }
    
    const isMatch = await bcryptjs.compare(user.password,password);
    
    if(isMatch){
        throw new Error('password is incorrect')
    }

    return user;
}
userSchema.pre('save',async function(next){
    const user = this;
    
    if(user.isModified('password')){
        user.password = await bcryptjs.hash(user.password,8);
    }

    next();
})

userSchema.pre('remove',async function(next){
    const user = this;
    
    await Task.deleteMany({owner:user._id});

    next();
})
const User = mongoose.model('User',userSchema);
module.exports = User