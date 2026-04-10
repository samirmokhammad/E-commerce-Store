import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validatePassword } from '../fn';
import '../css/login.css';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [warningText, setWarningText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    validatePassword(password, setWarningText, setIsPasswordValid);
  }, [password]);

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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        },
      );
      if (!response.ok) {
        setWarningText(data?.message || 'Server error');
        return;
      }
      navigate(`/shop`);
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="login">
      <h1 className="visually-hidden">Log In Page</h1>
      <div className="login-block">
        <h2>Log In</h2>
        <form onSubmit={handleLogIn}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="on"
            required={true}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            autoComplete="on"
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
          <div className="password-label-block">
            <label htmlFor="password">Password</label>
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
          />
          <button type="submit">Log In</button>
          <p className="warning-text">{warningText}</p>
        </form>
        <p>
          Want to create an account?{' '}
          <Link to="/signup">
            <span className="highlighted-link">Sign up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
