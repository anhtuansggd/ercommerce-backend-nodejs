'use strict'

const express = require('express')
const  router = express.Router()
const productController = require('../../controllers/product.controller')
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler")

router.use(authentication)
router.post('', asyncHandler(productController.createProduct))

module.exports = router
