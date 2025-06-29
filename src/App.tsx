import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
