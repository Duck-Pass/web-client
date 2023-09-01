import './App.css'
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register'
import Login from './pages/Login'
import Vault from './pages/Vault'
import AccountVerified from './pages/AccountVerified';
import Profile from './pages/Profile';
import { AuthContextProvider } from './components/context/AuthContextProvider';
import Login2FA from './pages/Login2FA';
import Page404 from './pages/Page404';

function App() {

  return (
    <>
      <HashRouter>
        <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account-verified" element={<AccountVerified />} />
          <Route path="/2fa-login" element={<Login2FA />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
        </AuthContextProvider>
      </HashRouter>
    </>
)
}

export default App
