import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart, placeOrder, getUserOrders, getAllOrders } from '../controllers/cartController.js';
import auth, { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Cart routes
router.get('/', getCart); // Get user's cart
router.post('/add',auth, addToCart); // Add item to cart
router.post('/remove', removeFromCart); // Remove item from cart
router.post('/clear', clearCart); // Clear cart

// Order routes
router.post('/place', auth, placeOrder); // Place order
router.get('/user', auth, getUserOrders); // Get user's orders
router.get('/admin', auth, isAdmin, getAllOrders); // Get all orders (admin)

export default router;