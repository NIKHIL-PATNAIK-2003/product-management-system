import mongoose from 'mongoose';

// Replace with your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

// Check if the Mongoose connection is already established
if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Define Product Schema and Model
const productSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  authorId: { type: String, required: true },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Define Review Schema and Model
const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  status: { type: String, default: 'pending' },
  authorId: { type: String, required: true },
  adminId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { imageUrl, productName, productDescription, price } = req.body;

  if (!imageUrl || !productName || !productDescription || !price) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a new product document
    const product = new Product({
      imageUrl,
      productName,
      productDescription,
      price,
      authorId: '12345', // Replace with the correct logic for author ID
    });

    // Save the product to the database
    const savedProduct = await product.save();

    // Create a new review document for admin approval
    const review = new Review({
      productId: savedProduct._id,
      status: 'pending',
      authorId: '12345', // Replace with the correct logic for author ID
    });

    // Save the review to the database
    await review.save();

    res.status(200).json({
      message: 'Product saved and review request submitted successfully.',
    });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
