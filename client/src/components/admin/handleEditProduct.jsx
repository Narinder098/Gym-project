// EditProductModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import axios from "axios";

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: ""
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image,
        description: product.description
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `https://gym-project-server.onrender.com/product/updateProduct/${product._id}`,
        form,
        { withCredentials: true }
      );
      toast.success("Product updated successfully");
      onProductUpdated(res.data.product);
      onClose();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 bg-black/30">
        <DialogPanel className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
          <DialogTitle className="text-lg font-bold">Edit Product</DialogTitle>

          {["name", "price", "category", "stock", "image", "description"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={`Enter ${field}`}
              value={form[field]}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
            />
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditProductModal;
