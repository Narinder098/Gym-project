import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import router from './routes/authRouter.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import Productrouter from './routes/productRouter.js';
import cartRoutes from './routes/cartRouter.js';
dotenv.config();
import { sendContactEmails } from './config/mailer.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://gym-project-client.onrender.com"
  ],
  credentials: true,
}));

connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log('Contact form submission:', { name, email, message });
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const result = await sendContactEmails({ name, email, message });
    if (result.success) {
      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error('Error processing contact request:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

app.use('/auth', router);
app.use('/products', Productrouter);
app.use('/cart', cartRoutes);
app.use('/orders', cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
