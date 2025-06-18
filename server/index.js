import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import router from './routes/authRouter.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import Productrouter from './routes/productRouter.js';
import cartRoutes from './routes/cartRouter.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  // origin: "http://localhost:5173", 
  origin:"https://gym-project-client.onrender.com",
  credentials: true,               
}));

connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/auth', router);
app.use('/products', Productrouter);
app.use('/cart', cartRoutes);
app.use('/orders', cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
