import CartModel from '../models/cart.js';
import OrderModel from "../models/orderModel.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = new CartModel({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await CartModel.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Remove from cart failed", error });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Clear cart failed", error });
  }
};

// Place order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const { items, shippingAddress } = req.body;

    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items are required and must be a non-empty array" });
    }
    if (!shippingAddress || typeof shippingAddress !== 'object' || Object.keys(shippingAddress).length === 0) {
      return res.status(400).json({ success: false, message: "Valid shipping address is required" });
    }

    // Validate product IDs and quantities
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
    }

    // Create and save the order
    const order = new OrderModel({
      user: userId,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
      })),
      shippingAddress,
      status: 'Pending',
    });

    await order.save();

    // Optionally clear the cart
    await CartModel.findOneAndDelete({ user: userId }).catch(err => {
      console.warn("Cart deletion failed:", err.message);
    });

    return res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (err) {
    console.error("Order placement failed:", err);
    return res.status(500).json({ success: false, message: "Error placing order", error: err.message });
  }
};

export const order = async (req, res) => {
  try {
    console.log("Received order data:", req.body); 
    const { items, shippingAddress } = req.body;

    // Ensure valid items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order items' });
    }

    // Check if each item has a valid product and quantity
    for (const item of items) {
      if (!item.product || !item.product.id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Each item must have a valid product and quantity' });
      }
    }

    // Ensure shipping address is provided
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Check if user is authenticated (req.user should be set by authentication middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User is not authenticated' });
    }

    // Create the order
    const order = new OrderModel({
      user: req.user.id,  // The logged-in user's ID
      items,
      shippingAddress,
      status: 'Pending', // Set initial status
    });

    // Save the order to the database
    await order.save();

    // Return success response with order data
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

// Get current user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user orders", error: err.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate("user items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};
