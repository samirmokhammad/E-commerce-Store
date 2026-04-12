import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './components/App';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Store from './components/Store';
import Profile from './components/Profile';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LogIn />} />\
        <Route path="store" element={<Store />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
