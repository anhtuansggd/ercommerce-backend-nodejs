const express = require('express')
const morgan = require('morgan')
const helmet = require("helmet");
const compression = require("compression");
const app = express()


// init middlewares
//Log: npm i morgan --save
app.use(morgan("dev"))
//Security: npm i helmet --save-dev
app.use(helmet())
app.use(compression())

//development
app.use(morgan("dev"))
//production
app.use(morgan("combined"))
//apache standard
app.use(morgan("common"))
app.use(morgan("short"))
app.use(morgan("tiny"))


// init db

//init router
app.get('/', (req, res, next) =>{
    return res.status(200).json({
        message: "Hallo",
    })
})

// handle errors


module.exports = app