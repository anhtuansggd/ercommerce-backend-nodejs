'use strict'
const ProductService = require("../services/product.service.xxx")
const {CREATED, SuccessResponse} = require("../core/success.response");
const {product} = require("../models/product.model");
class AccessController{
    createProduct = async (req, res, next) => {
        console.log(req.user)
        new SuccessResponse({
            message: 'Create new Product success',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

}


module.exports = new AccessController()
