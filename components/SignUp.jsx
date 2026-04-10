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
      console.log(error);
    }
  };

  return (
    <div className="signup">
      <h1 className="visually-hidden">Sign Up Page</h1>
      <div className="signup-block">
        <h2>Create your account</h2>
        <form onSubmit={handleSignUp}>
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
          <button type="submit">Sign Up</button>
          <p className="warning-text">{warningText}</p>
        </form>
        <p>
          Already have an account?{' '}
          <Link to="/login">
            <span className="highlighted-link">Log in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
