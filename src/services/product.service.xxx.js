"use strict";

const {product, clothing, electronic, furniture} = require('../models/product.model')
const {BadRequestError} = require("../core/error.response");
const {findAllDraftsForShop, publishProductByShop, findAllPublishForShop} = require("../models/repositories/product.repo");

// define factory (pattern) class to create product
class ProductFactory {
    /**
     *
     * type: 'Clothing'
     * payload
     */
    static productRegistry = { } //key - class

    static registerProductType( type, classRef ){
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct( type, payload ){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type: ${type}`)

        return new productClass(payload).createProduct()
    }

    static async publishProductByShop({product_shop, product_id}){
        console.log('Product id:::', product_id)
        return await publishProductByShop({product_shop, product_id})
    }

    static async findAllDraftsForShop( {product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublicForShop( {product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }
}

// define base product class
class Product{
    constructor({
        product_name, product_thumb, product_description, product_price,
            product_quantity, product_type, product_shop, product_attributes
    }){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct ( product_id ){
        return await product.create({...this, _id: product_id})
    }
}

// define subclass for different product types - clothing
class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing){
            throw new BadRequestError('Create new clothing error')
        }
        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct){
            throw new BadRequestError('Create new Product error')
        }
        return newProduct;
    }
}

class Electronics extends Product {
    async createProduct(){
        const newElectronic = await electronic.create({
                ...this.product_attributes,
                product_shop: this.product_shop
            })
        if(!newElectronic){
            throw new BadRequestError('Create new electronic error')
        }

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct){
            throw new BadRequestError('Create new Product error')
        }

        return newProduct;
    }
}

//Fix value inside
class Furniture extends Product {
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture){
            throw new BadRequestError('Create new furniture error')
        }

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct){
            throw new BadRequestError('Create new Product error')
        }

        return newProduct;
    }
}

// register product types
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Furniture', Furniture)


module.exports = ProductFactory