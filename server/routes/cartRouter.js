import express from 'express';
import { getCart, addToCart,removeFromCart,clearCart, placeOrder, getUserOrders, getAllOrders, order,} from '../controllers/cartController.js';
import auth from '../middlewares/auth.js';
// import { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/clear', clearCart);

router.post("/cart/add", addToCart);
router.post("/", order)
router.post("/place", placeOrder);
router.get("/user", getUserOrders);
router.get("/admin", getAllOrders);


export default router;
