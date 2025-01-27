'use strict'
const ProductService = require("../services/product.service.xxx")
const {CREATED, SuccessResponse} = require("../core/success.response");
const {product} = require("../models/product.model");
class AccessController{
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async( req, res, next ) => {
        new SuccessResponse({
            message: 'publishProductByShop success!',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    /**
     * @desc Get all drafts for shop
     * @param {Number } limit
     * @param {Number } skip
     * @returns {JSON}
     */
    // QUERY //
    getAllDraftsForShop = async( req, res, next ) => {
        new SuccessResponse({
            message: 'Get draft list success',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async( req, res, next) => {
        new SuccessResponse({
            message: 'Get list getAllPublishForShop success',
            metadata: await ProductService.findAllPublicForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    // END QUERY //

}


module.exports = new AccessController()
