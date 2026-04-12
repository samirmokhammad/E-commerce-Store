import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePassword } from '../fn';
import '../css/profile.css';

export default function Profile() {
  const [userData, setUserData] = useState({
    id: 'null',
    username: 'null',
    email: 'null',
  });
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [updateMode, setUpdateMode] = useState(false);
  const [updatePasswordMode, setUpdatePasswordMode] = useState(false);
  const [warningText, setWarningText] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          setWarningText('Failed to fetch user data');
          return;
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.log(err);
        // navigate('/login');
      }
    };

    checkAuthAndFetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            email: email,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setWarningText(data.message);
        return;
      }
      setUserData(data);
      setUpdateMode(false);
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    validatePassword(password, setWarningText, setIsPasswordValid);
  }, [password]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (isPasswordValid == false) {
      setWarningText('Provide proper password!');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/password`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: password,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setWarningText(data.message);
        return;
      }
      setUpdatePasswordMode(false);
    } catch (err) {
      // console.log(err);
    }
  };

  if (updateMode) {
    return (
      <div className="profile">
        <h1 className="visually-hidden">Profile</h1>
        <h2 className="acc-h2">Edit Profile</h2>
        <div className="profile-block">
          <h3>Username</h3>
          <input
            type="text"
            name="username"
            autoComplete="on"
            required={true}
            className="acc-input"
            value={username}
            placeholder={userData.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <h3>Email</h3>
          <input
            type="text"
            name="email"
            autoComplete="on"
            required={true}
            className="acc-input"
            value={email}
            placeholder={userData.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="profile-btns-block">
            <button className="profile-btns" onClick={handleUpdateProfile}>
              Update Profile
            </button>
            <button
              className="profile-btns"
              onClick={() => setUpdateMode(false)}
            >
              Back
            </button>
          </div>
          <p className="warning-text">{warningText}</p>
        </div>
      </div>
    );
  }

  if (updatePasswordMode) {
    return (
      <div className="profile">
        <h1 className="visually-hidden">Profile</h1>
        <h2 className="acc-h2">Edit Password</h2>
        <div className="profile-block">
          <h3>Your current password</h3>
          <input
            type="password"
            name="currentPassword"
            autoComplete="on"
            required={true}
            className="acc-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <h3>New Password</h3>
          <input
            type="password"
            name="newPassword"
            autoComplete="on"
            required={true}
            className="acc-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="profile-btns-block">
            <button className="profile-btns" onClick={handleUpdatePassword}>
              Update Password
            </button>
            <button
              className="profile-btns"
              onClick={() => setUpdatePasswordMode(false)}
            >
              Back
            </button>
          </div>
          <p className="warning-text">{warningText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <h1 className="visually-hidden">Profile</h1>
      <h2 className="acc-h2">Your Profile</h2>
      <div className="profile-block">
        <h3>Username</h3>
        <p>{userData.username}</p>
        <h3>Email</h3>
        <p>{userData.email}</p>
        <div className="profile-btns-block">
          <button className="profile-btns" onClick={() => setUpdateMode(true)}>
            Edit Profile
          </button>
          <button
            className="profile-btns"
            onClick={() => setUpdatePasswordMode(true)}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
