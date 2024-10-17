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

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // Step 1: check email existence
            // lean return pure javascript object
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop){
                return {
                    code: '',
                    message: 'Shop already registered!'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                 name, email , password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop){
                //created privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                });

                console.log({privateKey, publicKey}) // save

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                if(!publicKeyString){
                    return {
                        code: '',
                        message: 'publicKeyString error'
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)
                //created token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyString, privateKey)
                console.log(`Created Token Success::`, tokens)

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
        } catch (error){
            return {
                code: '',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService