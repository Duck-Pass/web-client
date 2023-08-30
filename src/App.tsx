import './App.css'
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register'
import Login from './pages/Login'
import Vault from './pages/Vault'
import Profile from './pages/Profile'
import PasswordReset from './pages/PasswordReset';
import Login2FA from './pages/Login2FA';
import Page404 from './pages/Page404'

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/2fa-login" element={<Login2FA />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </HashRouter>
    </>
)
}

export default App
