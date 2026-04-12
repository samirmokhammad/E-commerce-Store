import { useState, useEffect } from 'react';
import '../css/signup.css';
import { validatePassword } from '../fn';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [warningText, setWarningText] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
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

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (isPasswordValid == false) {
      setWarningText('Provide proper password!');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        console.log('Signup failed:', data?.message || 'Unknown error');
        setWarningText(data?.message || 'Server error');
        return;
      }
      navigate(`/store`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signup">
      <h1 className="visually-hidden">Sign Up Page</h1>
      <div className="signup-block">
        <h2 className="acc-h2">Create your account</h2>
        <form onSubmit={handleSignUp}>
          <label htmlFor="username" className="acc-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="on"
            required={true}
            className="acc-input"
          />
          <label htmlFor="email" className="acc-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            autoComplete="on"
            onChange={(e) => setEmail(e.target.value)}
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
            Sign Up
          </button>
          <p className="warning-text">{warningText}</p>
        </form>
        <p className="redirect-text">
          Already have an account?{' '}
          <Link to="/login">
            <span className="highlighted-link">Log in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
