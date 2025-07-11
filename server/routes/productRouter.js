import express from 'express';
import { createProduct, deleteProduct, getAllProduct, getProduct, getProductById, updateProduct } from '../controllers/productController.js';
import ProductModel from '../models/product.js';

const router = express.Router();

router.post('/createProduct', createProduct);
router.get('/getAllProduct', getAllProduct);
router.get('/getProduct', getProduct); // Renamed from getProudct
router.get('/getProduct/:id', getProductById);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct); // Changed to DELETE

router.post('/bulk-add-products', async (req, res) => {
  try {
    const products = req.body.products;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No products to add',
      });
    }
    await ProductModel.insertMany(products);
    return res.status(201).json({
      success: true,
      message: `${products.length} products added successfully`,
    });
  } catch (err) {
    console.error('Bulk add error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

export default router;