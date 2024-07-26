'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

//count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections::${numConnection}`)
}

//check overload
const checkOverload = () => {
    setInterval( () => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        // Example max number of connections is number of cores
        const maxConnections = numCores * 5
        console.log(`Active connections:${numConnection}`)
        //GB to MB
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)

        if(numConnection > maxConnections){
            console.log(`Connection overload detected!`)
        }
    }, _SECONDS) // Monitor each 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}