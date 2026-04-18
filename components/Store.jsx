import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import '../css/store.css';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');

  const categories = ['all', 'electronics', 'clothing', 'home', 'fitness'];

  const fetchProducts = async (category = 'all') => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?category=${category}`,
        {
          credentials: 'include',
        },
      );
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchProducts(category);
  }, []);

  const handleAddToCart = (productId) => {
    try {
      const response = fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      }).then((res) => {
        if (res.status === 401) {
          alert('Please log in to add items to your cart.');
          return;
        }
      });
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className="store">
      <h1 className="visually-hidden">Store Page</h1>
      <h2 style={{ marginBlockEnd: '20px' }}>Our Products</h2>
      <div className="categories">
        {categories.map((cat) => {
          return (
            <button
              key={cat}
              className={`${cat === category ? 'category-btn-active' : ''} category-button`}
              onClick={() => {
                setCategory(cat);
                fetchProducts(cat);
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          );
        })}
      </div>
      <div className="products">
        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product">
              <img
                src={`../img/products/${product.image_name}`}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
