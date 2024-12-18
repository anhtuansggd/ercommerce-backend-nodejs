"use strict";
const JWT = require('jsonwebtoken')
const {asyncHandler} = require("../helpers/asyncHandler");
const {AuthFailureError, NotFoundError} = require("../core/error.response")
const { findByUserId } = require("../services/keyToken.service")
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-id'
}

const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try {
        //accessToken
        const accessToken = await JWT.sign( payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign( payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify( accessToken, publicKey, (err, decode) => {
            if(err){
                console.error(`error verify::`, err)
            }else{
                console.log(`decode verify::`, decode)
            }
        })

        return {accessToken, refreshToken}
    } catch (error) {
        console.log("Error in creating token pair" + error);
        return null;
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
    * 1. Check missed userId
    * 2. Get accessToken
    * 3. Verify token
    * 4. Check user in DB
    * 5. Check keyStore with this userId
    * 6. OK all => return next
    * */

    // 1.
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    // 2.
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    // 3.
    if(req.headers[HEADER.REFRESH_TOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
            const decoderUser = JWT.verify(refreshToken, keyStore.privateKey)
            if(userId !== decoderUser.userId) throw new AuthFailureError('Invalid Userid')
            req.keyStore = keyStore
            req.user = decoderUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey )
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid Userid')
        req.keyStore = keyStore
        return next()
    } catch (error){
        throw error
    }



})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify( token, keySecret )
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}