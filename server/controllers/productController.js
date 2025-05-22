import ProductModel from "../models/product.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price, category, image, stock, description } = req.body;
        if (!name || !price || !category || !image || !stock || !description) {
            throw new Error("product detail required")
        }

        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct) {
            throw new Error("Product already exists, please update the product");
        }

        const productModel = new ProductModel({
            name, price, image, stock, category, description
        })
        await productModel.save();

        return res.status(200).json({
            message: "product created successfully",
            error: false,
            success: true,
            data: productModel
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.status(200).json({
            message: "All product fetched successfully",
            error: false,
            success: true,
            products: products
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export const getProudct = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            throw new Error("provide product name");
        }

        const product = await ProductModel.find({ name });
        if (!product) {
            throw new Error("No product found");
        }

        res.status(200).json({
            message: " Product fetched successfully",
            error: false,
            success: true,
            data: product
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id);
        if (!product) {
            throw new Error("product not found")
        }

        return res.status(200).json({
            message: "product found successfully",
            error: false,
            success: true,
            data: product
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
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
        message: "No fields provided for update",
        error: true,
        success: false,
      });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      error: false,
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
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

        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not exist",
                error: true,
                success: false,
            });
        }

        await ProductModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "product deleted successfully",
            error: false,
            success: true,

        })

    } catch (error) {
        return res.status(404).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}
