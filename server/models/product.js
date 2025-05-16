import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    image: {type : String , default:""},
    category: {type : String , default:""},
    stock: { type: Number, default: null },
    discount: { type: Number, default: null },
    more_details: { type: Object, default: {} },
    published: { type: Boolean, default: true }
},)

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;