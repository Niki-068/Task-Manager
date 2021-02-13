const User = require('./models/user')
const Task = require('./models/task')
const db = require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
const app = express()

const port = process.env.PORT || 3000

// app.use((req,res,next)=>{
//     res.status(503).send("site under maintainence");
// })
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log("server is running on " + port)
})
