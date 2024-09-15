"use client";
import { useEffect, useState } from "react";
import "./page.css"; // Import the CSS file

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Product Dashboard</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="product-image"
            />
            <h2>{product.productName}</h2>
            <p>{product.productDescription}</p>
            <p>Price: ${product.price}</p>
            <p>Status: {product.status || "pending"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
