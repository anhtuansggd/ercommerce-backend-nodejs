'use strict'

const express = require('express')
const  router = express.Router()
const productController = require('../../controllers/product.controller')
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler")
const async_hooks = require("node:async_hooks");

router.use(authentication)
router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
// QUERY //
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))
module.exports = router
