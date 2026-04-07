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
                    `${import.meta.env.BACKEND_URL}/api/user`,
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
                `${import.meta.env.BACKEND_URL}/api/logout`,
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

    return (
        <header>
            {/* <h1 className="visually-hidden">Heading</h1> */}
            <h2>E-Commerce Store</h2>
            <div className="links">
                {isLoggedIn ? (
                    <>
                        <Link to="/cart">Cart</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/logout">Log Out</Link>
                    </>
                ) : (
                    <>
                        <Link to="/signup">Sign Up</Link>
                        <Link to="/login">Log In</Link>
                    </>
                )}
            </div>
        </header>
    );
}
