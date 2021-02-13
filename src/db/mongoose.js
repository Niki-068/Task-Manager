const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})



// const me  = new User({
//     name:"Parul",
//     email:"parul@gmail.com",
//     password:"       nhjgj   ",
//     age:16
// })

// me.save().then((result)=>{
//     console.log(me);
// }).catch((err)=>{
//     console.log(err);
// })





// const firstT = new Task({
//     description:"Complete contests        ",
// })

// firstT.save().then((result)=>{
//     console.log(result);
// }).catch((err)=>{
//     console.log(err);
// })

