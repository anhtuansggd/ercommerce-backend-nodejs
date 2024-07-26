'use strict'

const mongoose = require('mongoose')
const { db: {host, name, port} } = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`
const {countConnect}  = require('../helpers/check.connect')


//Singleton pattern
class Database {
    constructor(){
        this.connect()
    }

    connect(type = 'mongodb') {
        if(1 === 1){
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }

        mongoose.connect(connectString, {
            maxPoolSize: 100
        }).then(_ => {
            console.log(connectString)
            console.log(`Connected database MongoDB`, countConnect())
        })
            .catch(err => console.log(`Error connect!`))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDB = Database.getInstance()
module.exports = instanceMongoDB