import ProductModel from '../models/product.js';

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, image, stock, description } = req.body;
    if (!name || !price || !category || !image || !stock || !description) {
      return res.status(400).json({
        message: 'All product details are required',
        error: true,
        success: false,
      });
    }

    const existingProduct = await ProductModel.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        message: 'Product already exists, please update the product',
        error: true,
        success: false,
      });
    }

    const productModel = new ProductModel({
      name,
      price,
      image,
      stock,
      category,
      description,
    });
    await productModel.save();

    return res.status(201).json({
      message: 'Product created successfully',
      error: false,
      success: true,
      data: productModel,
    });
  } catch (error) {
    console.error('Create product error:', error.message);
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json({
      message: 'All products fetched successfully',
      error: false,
      success: true,
      products,
    });
  } catch (error) {
    console.error('Get all products error:', error.message);
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: 'Product name is required',
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({ name });
    if (!products || products.length === 0) {
      return res.status(404).json({
        message: 'No product found',
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: 'Product fetched successfully',
      error: false,
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get product error:', error.message);
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid product ID',
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Product found successfully',
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product by ID error:', error.message);
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid product ID',
        error: true,
        success: false,
      });
    }

    const { name, price, stock, description, image, category } = req.body;
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (price) updatedFields.price = price;
    if (stock) updatedFields.stock = stock;
    if (description) updatedFields.description = description;
    if (image) updatedFields.image = image;
    if (category) updatedFields.category = category;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        message: 'No fields provided for update',
        error: true,
        success: false,
      });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product not found',
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Product updated successfully',
      error: false,
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error.message);
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid product ID',
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        error: true,
        success: false,
      });
    }

    await ProductModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Product deleted successfully',
      error: false,
      success: true,
    });
  } catch (error) {
    console.error('Delete product error:', error.message);
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};