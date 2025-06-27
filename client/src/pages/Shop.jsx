import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import ProductSkeleton from '../components/OrderSkeleton';

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://gym-project-server.onrender.com/products/getAllProduct');
        const productsData = res.data.products || res.data;
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (error) {
    return <div className="text-center text-red-600 py-16">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Shop Fitness Essentials</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find quality equipment and supplements to support your fitness journey.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2 text-sm rounded-full font-medium transition ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : filteredProducts.length ? (
          filteredProducts.map((product, index) => (
            <div
              key={product._id || index}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-red-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found for the selected category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
