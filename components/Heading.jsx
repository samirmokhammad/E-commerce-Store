import { useLocation, Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import '../css/heading.css';

export default function Heading() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user`,
          {
            credentials: 'include',
          },
        );
        setIsLoggedIn(response.ok);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [location]);

  const logOut = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      if (!response.ok) {
        // console.log('Failed to logout');
        return;
      }
      setIsLoggedIn(false);
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };

  if (
    location.pathname === '/profile' ||
    location.pathname === '/cart' ||
    location.pathname === '/confirmation'
  ) {
    return (
      <header>
        <h1 className="visually-hidden">Heading</h1>
        <Link to="/store">
          <h2>E-Commerce Store</h2>
        </Link>
        <div className="links">
          {isLoggedIn ? (
            <>
              <Link to="/store">Store</Link>
              <Link to="/cart">Cart</Link>
              <Link onClick={logOut}>Log Out</Link>
            </>
          ) : (
            <>
              <Link to="/store">Store</Link>

              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Log In</Link>
            </>
          )}
        </div>
      </header>
    );
  }

  return (
    <header>
      <h1 className="visually-hidden">Heading</h1>
      <Link to="/">
        <h2>E-Commerce Store</h2>
      </Link>
      <div className="links">
        {isLoggedIn ? (
          <>
            <Link to="/store">Store</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/profile">Profile</Link>
            <Link onClick={logOut}>Log Out</Link>
          </>
        ) : (
          <>
            <Link to="/store">Store</Link>

            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </>
        )}
      </div>
    </header>
  );
}
