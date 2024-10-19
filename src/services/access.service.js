"use strict";

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const RoleShop ={
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
const KeyTokenService = require("./keyToken.service")
const {createTokenPair} = require("../auth/authUtils");
const { getInfoData } = require("../utils")
const {BadRequestError, AuthFailureError} = require("../core/error.response");
const {findByEmail} = require("./shop.service");

class AccessService {
    /*
        1. Check email in db
        2. match password
        3. create access token and refresh token and save
        4. generate tokens
        5. get data and return login
     */
    static login = async ({email, password, refreshToken = null}) => {
        //1.
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Shop not registered')

        //2.
        const match = bcrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Authentication error')

        //3. create private and public key
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        //4. generate token
        const { _id: userId } = foundShop._id
        const tokens = await createTokenPair({userId, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        })
        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }


    static signUp = async ({name, email, password}) => {
        // try {
            // Step 1: check email existence
            // lean return pure javascript object
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop){
               throw new BadRequestError('Error: Shop already registered')
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                 name, email , password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop){
                //Simplified version in compared with using crypto.generatedKeyPairSync
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')


                console.log({privateKey, publicKey}) // save

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore){
                    return {
                        code: '',
                        message: 'keyStore error'
                    }
                }

                //created token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }
        // } catch (error){
        //     console.error(error)
        //     return {
        //         code: '',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService