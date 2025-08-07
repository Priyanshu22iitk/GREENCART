import {v2 as cloudinary} from "cloudinary";
import Product from "../models/product.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files;
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, 
                    { resource_type: 'image' });
                return result.secure_url;
            })
        );
        await Product.create({ ...productData, image: imagesUrl });
        res.status(201).json({ success: true, message: 'Product added successfully' });
    } catch (error) {
        console.error('Add Product Error:', error);
        res.status(500).json({ success: false, message: 'Failed to add product' });
    }
}

// Get Product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error('Product List Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.params; // Changed from req.body to req.params
        if (!id) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }
        
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error('Product By ID Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch product' });
    }
}

// Change Product stock status : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body; // Fixed parameter name (was 'instock')
        
        if (!id) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { inStock }, 
            { new: true } // Returns the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ 
            success: true, 
            message: "Stock status updated",
            product: updatedProduct // Return the updated product
        });
    } catch (error) {
        console.error('Change Stock Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update stock status' });
    }
}