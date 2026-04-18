import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import '../css/cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          credentials: 'include',
        },
      );

      if (response.status === 401) {
        alert('Please log in to view your cart.');
        navigate('/login');
        return;
      }

      const data = await response.json();
      setCartItems(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ productId }),
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cart">
      <h1 className="visually-hidden">Cart Page</h1>
      <h2 style={{ marginBlockEnd: '20px' }}>Your Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={`../img/products/${item.image_name}`}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-description">
                <h3 className="cart-name">{item.name}</h3>
                <p className="product-description">{item.description}</p>
                <p className="product-price" style={{ marginBlockEnd: '10px' }}>
                  ${item.price}$
                </p>
                <div className="cart-item-quantity">
                  <img
                    src="../img/minus-icon.svg"
                    alt="decrease quantity by 1"
                    className="quantity-icons"
                    title="decrease quantity by 1"
                  />
                  <input
                    type="text"
                    name="quantity"
                    id="quantity"
                    placeholder={item.quantity}
                    className="quantity-input"
                    onBlur={}
                  />
                  <img
                    src="../img/plus-icon.svg"
                    alt="increase quantity by 1"
                    className="quantity-icons"
                    title="increase quantity by 1"
                  />
                  <img
                    src="../img/delete-icon.svg"
                    alt="delete button"
                    className="quantity-icons"
                    title="Delete item"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
