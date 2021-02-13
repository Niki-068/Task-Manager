const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const TaskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
    },
    completed :{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
});


const Task = mongoose.model('Tasks',TaskSchema)

module.exports = Task