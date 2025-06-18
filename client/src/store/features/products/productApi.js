import axios from 'axios';

const API_URL = 'https://gym-project-server.onrender.com/product/getAllProducts';

export const fetchProducts = async() => {
    const response = await axios.get(API_URL);
    return response.data ;
}