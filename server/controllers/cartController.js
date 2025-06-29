import mongoose from 'mongoose';
import CartModel from '../models/cart.js';
import OrderModel from '../models/orderModel.js';
import ProductModel from '../models/product.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Get cart error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new CartModel({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    const populatedCart = await CartModel.findOne({ userId }).populate('items.productId');
    return res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error('addToCart - Error:', error);
    return res.status(500).json({ success: false, message: 'Error adding to cart', error: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    const populatedCart = await CartModel.findOne({ userId }).populate('items.productId');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error('Remove from cart error:', error.message);
    res.status(500).json({ success: false, message: 'Remove from cart failed', error: error.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error.message);
    res.status(500).json({ success: false, message: 'Clear cart failed', error: error.message });
  }
};

// Place order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Placing order for user:', userId); // Debug
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required and must be a non-empty array' });
    }
    if (!shippingAddress || typeof shippingAddress !== 'object' || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
      return res.status(400).json({ success: false, message: 'Valid shipping address is required with street, city, state, and zip' });
    }

    let totalPrice = 0;
    for (const item of items) {
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ success: false, message: `Invalid product ID: ${item.product}` });
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: `Invalid quantity for product: ${item.product}` });
      }
      const product = await ProductModel.findById(item.product);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.product}` });
      }
      totalPrice += product.price * item.quantity;
    }

    const order = new OrderModel({
      user: userId,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
      })),
      shippingAddress,
      totalPrice,
      status: 'Pending',
    });

    await order.save();

    await CartModel.findOneAndDelete({ userId }).catch(err => {
      console.warn('Cart deletion failed:', err.message);
    });

    return res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Order placement failed:', err.message);
    return res.status(500).json({ success: false, message: 'Error placing order', error: err.message });
  }
};

// Get current user's orders
export const getUserOrders = async (req, res) => {
  try {
    console.log('getUserOrders - req.user:', req.user);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: true, message: 'Unauthorized: No user ID' });
    }
    const orders = await OrderModel.find({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price image',
      })
      .sort({ createdAt: -1 });
    console.log('getUserOrders - Orders found:', orders.length);
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('getUserOrders - Error:', error.message, error.stack);
    return res.status(500).json({ success: false, error: true, message: 'Error fetching orders', error: error.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate('user items.product');
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('Get all orders error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching orders', error: err.message });
  }
};