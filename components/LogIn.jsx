import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validatePassword } from '../fn';
import '../css/login.css';

export default function LogIn() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [warningText, setWarningText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    validatePassword(password, setWarningText, setIsPasswordValid);
  }, [password]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/`,
          {
            credentials: 'include',
          },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data?.id) navigate('/store');
      } catch (err) {
        // console.log(err);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogIn = async (e) => {
    e.preventDefault();

    if (isPasswordValid == false) {
      setWarningText('Provide proper password!');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ login, password }),
        },
      );
      if (!response.ok) {
        const data = await response.json();
        setWarningText(data?.message || 'Server error');
        console.log('Login failed:', data?.message || 'Unknown error');
        return;
      }
      navigate(`/store`);
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="login">
      <h1 className="visually-hidden">Log In Page</h1>
      <div className="login-block">
        <h2 className="acc-h2">Log In</h2>
        <form onSubmit={handleLogIn}>
          <label htmlFor="" className="acc-label">
            Username or Email
          </label>
          <input
            type="text"
            id="login"
            name=""
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="on"
            required={true}
            className="acc-input"
          />
          <div className="password-label-block">
            <label htmlFor="password" className="acc-label">
              Password
            </label>
            <img
              src="../img/question.png"
              alt="password help"
              className="password-helper-icon"
              onClick={() =>
                setWarningText(
                  'Must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
                )
              }
            />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            className="acc-input"
          />
          <button type="submit" className="acc-button">
            Log In
          </button>
          <p className="warning-text">{warningText}</p>
        </form>
        <p className="redirect-text">
          Want to create an account?{' '}
          <Link to="/signup">
            <span className="highlighted-link">Sign up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
