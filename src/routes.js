import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products';
import NewProduct from './pages/NewProduct';
import EditProduct from './pages/EditProduct';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/produtos/novo" element={<NewProduct />} />
            <Route path="/produtos/:id/editar" element={<EditProduct />} />
        </Routes>
    </Router>
);

export default AppRoutes;
