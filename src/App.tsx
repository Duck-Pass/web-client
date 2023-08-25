import './App.css'
import { Routes, Route, HashRouter, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register'
import Header from './components/ui/header';

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
