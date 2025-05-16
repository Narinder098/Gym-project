import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    description: ''
  });

  // Fetch all products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/product/getAllProduct');
      console.log("Fetched products:", res.data);
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error('Failed to fetch products');
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/product/createProduct', newProduct);
      toast.success('Product added successfully');
      setNewProduct({ name: '', price: '', category: '', stock: '', image: '', description: '' });
      fetchProducts();
    } catch (err) {
      toast.error('Failed to add product');
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
  
    try {
      await axios.get(`http://localhost:8000/product/deleteProduct/${id}`);
      setProducts(products.filter(product => product._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };
  

  return (
    <div className="space-y-6">
      <form id="addProductForm" onSubmit={handleAddProduct} className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="px-4 py-2 border rounded-lg" required />
          <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="px-4 py-2 border rounded-lg" required />
          <input type="text" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="px-4 py-2 border rounded-lg" required />
          <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="px-4 py-2 border rounded-lg" required />
          <input type="url" placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="px-4 py-2 border rounded-lg md:col-span-2" required />
          <input type="description" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="px-4 py-2 border rounded-lg md:col-span-2" required />
        </div>
        <button type="submit" className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">Add Product</button>
      </form>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button onClick={() => document.getElementById('addProductForm').scrollIntoView({ behavior: 'smooth' })} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center">
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">${parseFloat(product.price).toFixed(2)}</p>
              <p className="text-gray-600">Stock: {product.stock}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-600">
                  <FaTrash />
                </button>
                <button className="text-blue-500 hover:text-blue-600">
                  <FaEdit />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsManagement;
