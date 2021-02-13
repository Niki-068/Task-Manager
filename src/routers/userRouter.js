const User = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()


const upload = multer({
   // dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("File should be an image!"));
        }

        cb(undefined,true); 
    }
})


router.get('/user/me',auth,async (req,res)=>{

    try{
    //const users = await User.find({});
    //res.status(200).send(users);

    res.status(200).send(req.user);
    }
    catch(e){
        res.status(400).send(e)
    }
    // User.find({}).then((result)=>{
    //     res.status(200).send(result)

    //     }).catch((err)=>{
    //         res.status(400).send(err)
    //     })
})
router.get('/users/:id',async (req,res)=>{
    const _id = req.params.id; 

    try{
        const user = await User.findById({_id});

        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user);
        }
        catch(e){
            res.status(400).send(e)
        }
    // User.findById(_id).then((result)=>{

    //     if(!result){
    //         return res.status(404).send()
    //     }

    //     res.status(200).send(result);
        
    //     }).catch((err)=>{
    //         res.status(400).send(err)
  
    //     })
})

router.post('/user/logout',auth,async (req,res)=>{
    try{
       
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save();

        res.status(200).send()
    }
    catch(e){
        res.send(500).send(e);
    }
})

router.post('/user/logoutAll',auth,async (req,res)=>{
    try{
       
        req.user.tokens = [];
        await req.user.save();

        res.status(200).send()
    }
    catch(e){
        res.send(500).send(e);
    }
})

router.post('/users',async (req,res)=>{
    const user = new User(req.body);

    try{
        await user.save();
        const token = user.generateAuthToken();
        res.status(200).send({user,token});
        }
        catch(e){
            res.status(400).send(e)
        }

    // user.save().then(()=>{
    //     res.status(200).send(user);
    // }).catch((err)=>{
    //    res.status(400).send(err)
    // })
})

router.post('/user/login',async(req,res)=>{
    try{
        
        const user = await User.findByCredentials(req.body.email,req.body.password)
     
        const token = await user.generateAuthToken();
       
        
        res.status(200).send({user,token});
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();

    req.user.avatar = buffer;

    await req.user.save();

    res.status(200).send();

},(error,req,res,next)=>{
    res.status(400).send({error: error.message});
})

router.delete('/users/me/avatar',auth,async (req,res)=>{

    
    req.user.avatar = undefined;

    await req.user.save();

    res.status(200).send();

})

router.get('/users/:id/avatar',async(req,res)=>{

    try{
    const user =  await User.findById({_id:req.params.id});

    if(!user || !user.avatar){
        throw new Error();
    }

    res.set({'Content-Type':'images/png'});
    res.send(user.avatar);
    }
    catch(e){
        res.status(400).send();
    }
})
router.patch('/users/me',auth,async (req,res)=>{
    const validfields = ['name','email','password','age'];
    const updateFields = Object.keys(req.body);

    const invalidFields = updateFields.every((update)=> validfields.includes(update));

    if(!invalidFields){
        return res.status(400).send({error:'Invalid Field Updates!'})
    }
    try{
        // const _id = req.params.id;

        // const user = await User.findById(_id);

        // if(!user){
        //     return res.status(404).send();
        // }
        const user = req.user;
        updateFields.forEach((update)=> user[update] = req.body[update]);

        await user.save();
       //const user =  await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});

       
        res.status(200).send(user);
    }
    catch(e){
        res.status(400).send(e)
    }
})


router.delete('/users/me',auth,async (req,res)=>{
    try{

        // const _id = req.params.id;
        // const user = await User.findByIdAndDelete(_id);
        
        // if(!user){
        //     return res.status(404).send();
        // }

        req.user.remove();

        res.status(200).send(req.user);
    }
    catch(e){
        res.status(400).send(e)
    }
})


module.exports = router