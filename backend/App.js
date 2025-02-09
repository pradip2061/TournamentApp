const express = require('express')
const app =express()
const dotenv = require("dotenv")
const cors = require('cors')
const AuthenticateRouter = require('./router/AuthenticateRouter')
const CreateRouter = require('./router/CreateRouter')
const connectToDatabase = require('./database/index')
connectToDatabase()
app.use(express.json())
require('dotenv').config()
app.use('/khelmela',AuthenticateRouter,CreateRouter)
app.use(cors())



app.listen(3000, '0.0.0.0',()=>{
    console.log('the project is running at 3000')
})

// {
//     origin:'http://localhost:8081'
// }