# 🏋️‍♂️ Gym Project (MERN Stack)

A full-featured Gym Management Web Application built with the **MERN stack** (MongoDB, Express, React, Node.js), supporting custom authentication, admin dashboard, user dashboard, subscriptions, product orders, cart system, and more.

---

## 🔧 Technologies Used

- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, Cookies
- **Payments:** Razorpay (Not Integrated now)
- **State Management:** React Context, Redux Toolkit (for cart)
- **Deployment:** https://gym-project-client.onrender.com/

---

## 📁 Folder Structure

Gym-project/
├── client/ # React frontend
│ └── src/
│ └── components/
│ └── pages/
│ └── context/
│ └── store/
├── server/ # Node.js backend
│ └── controllers/
│ └── routes/
│ └── models/
│ └── middlewares/
└── README.md

---

## ⚙️ Features

### 👥 Authentication
- User SignUp/Login with JWT
- Secure session using cookies
- Role-based access (User/Admin)

### 📦 Admin Features
- Admin Dashboard
- Manage Users
- Manage Products (Supplements, Equipments, etc.)
- View & Manage Orders
- Manage Subscriptions

### 🛒 User Features
- Browse & Add products to cart
- Place orders via Razorpay (Not implemeted)
- View order history
- Subscription plans
- Workout planner
- Progress tracking

---

## 🚀 Getting Started (Development)

### 1. Clone the repository

```bash
git clone https://github.com/Narinder098/Gym-project.git
cd Gym-project

2. Setup Backend
cd server
npm install
npm run dev

3. Setup Frontend
cd ../client
npm install
npm run dev

Environment Variables
Create .env in server/:
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key



