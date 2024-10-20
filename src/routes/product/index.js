'use strict'

const express = require('express')
const  router = express.Router()
const productController = require('../../controllers/product.controller')
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler")

//Update to v2
router.use(authentication)
router.post('', asyncHandler(productController.createProduct))

module.exports = router
