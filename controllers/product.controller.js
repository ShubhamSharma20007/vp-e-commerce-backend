import ProductModel from "../models/product.model.js";
import path from "path"
import CartModel from "../models/cart.model.js";
import { fileURLToPath } from 'url';
import fs from "fs"
const __dirname = fileURLToPath(
    import.meta.url)
// POST /add-product
const createProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        category,
        image,
    } = req.body;


    try {
        //  not allowed  more then file size 1mb
        let file;
        if (req.file) {
            const { size, filename } = req.file;
            if (size > 1 * 1024 * 1024) {
                return res.status(400).json({ message: "file size is too large" })
            }
            file = filename;
        }
        const product = await ProductModel.create({
            name,
            price,
            description,
            category,
            image: file,

        })
        return res.status(200).json({ product, success: true, message: 'Product created successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })

    }
}


//  GET /products-list
const productsList = async (req, res) => {
    const { page, limit } = req.query;
    const pageNumber = +page;
    try {

        const products = await ProductModel.find().limit(limit).skip((pageNumber - 1) * limit);
        return res.status(200).json({ products, success: true, message: 'All products fetched successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

const totalProductCount = async (req, res) => {
    try {
        const productCount = await ProductModel.countDocuments();
        return res.status(200).json({ productCount, success: true, message: 'Total product count fetched successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false })
    }
}





// GEt /products group wiser
const allProductsGroupWise = async (req, res) => {
    try {
        const groupedProducts = await ProductModel.aggregate([{
            $group: {
                _id: "$category",
                products: {
                    $push: "$$ROOT"
                }
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                products: {
                    $slice: ["$products", 10]
                }

            }
        },
        {
            $sort: {
                category: 1
            }
        }

        ]);


        return res.status(200).json({
            data: groupedProducts,
            success: true,
            message: 'All products grouped by category fetched successfully'
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}


//  GET /product/:id

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false })
        }
        return res.status(200).json({
            data: product,
            success: true,
            message: 'Product fetched successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}


// PATCH /product/:id

// const updateProductStocks = async (req, res) => {
//     const { id } = req.params;
//     const { stock } = req.body;
//     try {
//         const product = await ProductModel.findByIdAndUpdate(id, {
//             $set: {
//                 stockes: stock
//             }
//         }, { new: true })
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found', success: false })
//         }
//         return res.status(200).json({ product, success: true, message: 'Product updated successfully' });
//     } catch (error) {
//         return res.status(500).json({ message: error.message, success: false })

//     }

// }


// PUT /product/:id

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, stock, category } = req.body;

    try {
        let newImageFile;
        if (req.file) {
            const { size, filename } = req.file;
            if (size > 1 * 1024 * 1024) {
                return res.status(400).json({ message: "File size is too large" });
            }
            newImageFile = filename;
        }

        // Find the existing product
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        // If the product has an existing image, delete it
        if (product.image && newImageFile) {
            const oldImagePath = path.join(__dirname, "../../public/uploads/", product.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.stockes = stock || product.stockes;
        if (newImageFile) {
            product.image = newImageFile;
        }

        const updatedProduct = await product.save();

        return res.status(200).json({
            product: updatedProduct,
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};




//  DELETE /product/:id
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false })
        }
        if (product.image && product) {
            const imagePath = path.join(__dirname, "../../public/uploads/", product.image);
            fs.unlinkSync(imagePath)
            await ProductModel.findByIdAndDelete(id);
        }
        // remove the item from cart which is deleting
        const findcart = await CartModel.findOne({ userId: req.user._id });
        if (!findcart) {
            return res.status(404).json({ message: 'Cart not found', success: false })
        }
        const removeFromcart = await CartModel.findOneAndUpdate({ userId: req.user._id }, { $pull: { products: { productId: id } } }, { new: true })
        return res.status(200).json({ removeFromcart, message: 'Product deleted successfully', success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}


//  GET /category-product/:category
const getProductCategoryWise = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await ProductModel.find({ category: category });
        return res.status(200).json({ products, success: true });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message, success: false })

    }
}

const fetchCategories = async (req, res) => {
    try {
        let categories = await ProductModel.distinct('category');
        if (!categories) {
            return res.status(404).json({ message: 'No categories found', success: false });
        }
        // const categories = distinctItems.map((category) => ({ label: category, checked: false }));
        return res.status(200).json({ categories, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })

    }
}

//  filter product

// const filterProducts = async (req, res) => {
//     let { category, price, search, sort } = req.query;

//     try {
//         let query = {};
//         if (search && typeof search === 'string') {
//             query.name = { $regex: search, $options: 'i' }
//         }

//         if (category) {
//             query.category = { $in: Array.isArray(category) ? category : [category] };
//         }
//         if (price) {
//             query.price = { $lte: parseInt(price) }
//         }
//         const searchProducts = await ProductModel.find(query).sort({
//             price: sort === "asc" ? 1 : -1
//         });

//         if (!searchProducts || searchProducts.length === 0) {
//             return res.status(404).json({ message: 'No products found', success: false });
//         }

//         return res.status(200).json({ searchProducts, success: true });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: err.message, success: false });
//     }
// };


export {
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
}