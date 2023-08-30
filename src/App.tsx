import './App.css'
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register'
import Login from './pages/Login'
import Vault from './pages/Vault'
import AccountVerified from './pages/AccountVerified';
import Profile from './pages/Profile'

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account-verified" element={<AccountVerified />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </HashRouter>
    </>
)
}

export default App
