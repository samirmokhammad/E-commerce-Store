import { useState, useEffect } from 'react';
import '../css/confirmation.css';
import { Link, useNavigate } from 'react-router';

export default function Confirmation() {
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  const fetchOrderItems = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/order`,
        {
          credentials: 'include',
        },
      );
      if (response.status === 401) {
        alert('Please log in to view your order confirmation.');
        navigate('/login');
        return;
      }
      const data = await response.json();
      const sortedData = [...data.orderItems].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      console.log(sortedData);
      setOrderItems(sortedData);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  useEffect(() => {
    fetchOrderItems();
  }, []);

  return (
    <div className="confirmation">
      <h1 className="visually-hidden">Order Confirmation</h1>
      <h2 style={{ marginBlockEnd: '20px' }}>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <div className="order-items">
        {orderItems.length === 0 ? (
          <p>No items in your order.</p>
        ) : (
          orderItems.map((item) => (
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
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
