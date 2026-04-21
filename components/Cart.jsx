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
      const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setCartItems(sortedData);
    } catch (err) {
      // console.log(err);
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

      if (!response.ok) {
        const error = await response.json();
        console.error('Delete failed:', error);
        return;
      }

      fetchCartItems();
    } catch (err) {
      // console.error('Error removing from cart:', err);
    }
  };

  const handleCartItemChange = async (number, method, productId) => {
    const numberParsed = Number(number);
    const cartItem = cartItems.filter((item) => item.productid == productId);

    if (cartItem[0].quantity == 0 && method == 'decrement ') {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ numberParsed, method, productId }),
        },
      );
      if (!response.ok) {
        const error = await response.json();
        console.error('Quantity change failed:', error);
        return;
      }
      fetchCartItems();
    } catch (err) {
      console.error('Error changing quantity:', err);
    }
  };

  const handleOrderItem = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add items before placing an order.');
      return;
    }

    const totalAmount = cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item.productid,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(orderData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        alert(`Order failed: ${error.message || 'Please try again.'}`);
        console.error('Order creation failed:', error);
        return;
      }
      setCartItems([]);
    } catch (err) {
      alert('An error occurred while placing your order.');
      console.error('Order error:', err);
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
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="cart-item-quantity">
                  <img
                    src="../img/minus-icon.svg"
                    alt="decrease quantity by 1"
                    className="quantity-icons"
                    title="decrease quantity by 1"
                    onClick={() =>
                      handleCartItemChange(1, 'decrement', item.id)
                    }
                  />
                  <input
                    type="text"
                    // min={0}
                    name="quantity"
                    placeholder={item.quantity}
                    className="quantity-input"
                    onBlur={(e) =>
                      handleCartItemChange(e.target.value, 'set', item.id)
                    }
                  />
                  <img
                    src="../img/plus-icon.svg"
                    alt="increase quantity by 1"
                    className="quantity-icons"
                    title="increase quantity by 1"
                    onClick={() =>
                      handleCartItemChange(1, 'increment', item.id)
                    }
                  />
                  <img
                    src="../img/delete-icon.svg"
                    alt="delete button"
                    className="quantity-icons"
                    title="Delete item"
                    onClick={() => handleRemoveFromCart(item.id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="submit-order">
        <h2 style={{ marginBlockEnd: '20px' }}>
          Your total is:{'  '}
          <span className="product-price">
            $
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </span>
        </h2>
        <button style={{ marginInlineEnd: '10px' }}>
          <Link to="/store" style={{ color: 'inherit' }}>
            Return to store
          </Link>
        </button>
        <button onClick={() => handleOrderItem()}>
          <Link to="/confirmation" style={{ color: 'inherit' }}>
            Submit order
          </Link>
        </button>
      </div>
    </div>
  );
}
