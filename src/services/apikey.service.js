"use strict";

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')
const findById = async ( key ) => {
    //0000 is api access success
    const newKey = await apikeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permission: ['0000']})
    console.log(newKey)
    const objKey = await apikeyModel.findOne({key, status: true}).lean()
    return objKey
}

module.exports = {
    findById
}