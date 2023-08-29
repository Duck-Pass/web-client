import './App.css'
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register'
import Login from './pages/Login'
import Vault from './pages/Vault'

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vault" element={<Vault />} />
        </Routes>
      </HashRouter>
    </>
)
}

export default App
