import express from "express";
import {
    createProduct,
    // updateProductStocks,
    updateProduct,
    deleteProduct,
    productsList,
    allProductsGroupWise,
    getProductById,
    getProductCategoryWise,
    totalProductCount,
    fetchCategories,
    // filterProducts
} from "../controllers/product.controller.js";
import { body } from "express-validator";
import auth from "../middlewares/auth.middleware.js";
import upload from "../lib/multer.js";
const productRouter = express.Router();

productRouter.post('/add-product', auth, upload.single('image'), createProduct)
productRouter.get('/product-list', auth, productsList)
productRouter.get('/product-group-wise', auth, allProductsGroupWise)
// productRouter.patch('/update-product-stock/:id', auth, updateProductStocks)
productRouter.put('/update-product/:id', auth, upload.single('image'), updateProduct)
productRouter.get('/get-product/:id', auth, getProductById)
productRouter.delete('/delete-product/:id', auth, deleteProduct)
productRouter.get('/get-category-product/:category', auth, getProductCategoryWise)
productRouter.get('/categories', auth, fetchCategories)
productRouter.get('/total-product-count', auth, totalProductCount)
// productRouter.get('/filter-product', auth, filterProducts) //  values should be comes into query




export default productRouter;