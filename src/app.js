//npm i dotenv --save
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require("helmet");
const compression = require("compression");
const app = express()

// console.log(`Process::`, process.env)
// init middlewares
//Log: npm i morgan --save
app.use(morgan("dev"))
//Security: npm i helmet --save-dev
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//development
app.use(morgan("dev"))
//production
app.use(morgan("combined"))
//apache standard
app.use(morgan("common"))
app.use(morgan("short"))
app.use(morgan("tiny"))


// init db
require('./dbs/init.mongodb')
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()
//init router
app.use('', require('./routes'))

// handle errors after router

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use( (error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'

    })
})


module.exports = app