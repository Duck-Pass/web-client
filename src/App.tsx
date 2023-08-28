import './App.css'
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register'

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </HashRouter>
    </>
)
}

export default App
