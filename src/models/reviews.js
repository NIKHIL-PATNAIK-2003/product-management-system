import mongoose,{Schema} from "mongoose";
const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    status: { type: String, default: 'pending' },
    authorId: { type: Number, default: '1' },// later change it to requied : true
    adminId: { type: Number, default: '1' },// later change accoring to login authentication
  },
    {
        timestamps:true,
    }
);
  
  const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

  export default Review;