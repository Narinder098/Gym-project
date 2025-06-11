import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'equipment', name: 'Gym Equipment' },
  { id: 'protein', name: 'Protein' },
  { id: 'creatine', name: 'Creatine' },
  { id: 'shaker', name: 'Shakers' }
];

const Shop = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products/getAllProduct');
        console.log('Fetch products response:', response.data); // Debug
        const productsData = response.data.products || response.data;
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          setError('Invalid response format');
          console.error('API response is not an array:', response.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err.response?.data || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    : [];

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product); // Debug
    addToCart(product);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12 transform translate-y-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
        <h1 className="text-4xl font-bold mb-4">Fitness Equipment Shop</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find everything you need for your fitness journey, from premium equipment to supplements
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-primary transition-colors duration-300"
          />
          <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-full capitalize transition-all duration-300 hover:scale-105 ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-primary hover:text-white'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              key={product._id || index}
              className="bg-white rounded-lg shadow-md overflow-hidden transform translate-y-4 opacity-0 hover:-translate-y-2 transition-all duration-300"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 h-20 overflow-hidden">
                  {product.description}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 mt-8">
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;