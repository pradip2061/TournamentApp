const express = require('express')
const app =express()
const dotenv = require("dotenv")
const cors = require('cors')
const AuthenticateRouter = require('./router/AuthenticateRouter')
const connectToDatabase = require('./database/index')
connectToDatabase()
app.use(express.json())
require('dotenv').config()
app.use('/khelmela',AuthenticateRouter)
app.use(cors({
    origin:'http://localhost:8081'
}))



app.listen(3000,()=>{
    console.log('the project is running at 3000')
})