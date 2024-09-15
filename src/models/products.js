import mongoose,{Schema} from "mongoose";

const productSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    price: { type: Number, required: true },
    //createdAt: { type: Date, default: Date.now },
    authorId: { type: Number, default: '1' },// later change it to requied : true
    },
    {
        timestamps:true,
    }
  );

  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;