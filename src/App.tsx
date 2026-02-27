import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import arEG from 'antd/locale/ar_EG';
import { antdTheme } from './constants/antdTheme';
import AppLayout from './components/Layout/AppLayout';
import Home from './pages/Home/Home';
import SectionPage from './pages/SectionPage/SectionPage';
import AddProductPage from './pages/AddProductPage/AddProductPage';
import EditProductPage from './pages/EditProductPage/EditProductPage';
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import AllProductsPage from './pages/AllProductsPage/AllProductsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { AuthProvider } from './firebase/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import AutoLogout from './components/Auth/AutoLogout';

const App: React.FC = () => {
  return (
    <ConfigProvider direction="rtl" locale={arEG} theme={antdTheme}>
      <AuthProvider>
        <BrowserRouter>
          <AutoLogout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={
                <ProtectedRoute>
                  <AppLayout><Outlet /></AppLayout>
                </ProtectedRoute>
              }>
                <Route path="/" element={<Home />} />
                <Route path="/section/:section" element={<SectionPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/all-products" element={<AllProductsPage />} />
              </Route>

              <Route element={
                <AdminRoute>
                  <AppLayout><Outlet /></AppLayout>
                </AdminRoute>
              }>
                <Route path="/add" element={<AddProductPage />} />
                <Route path="/edit/:id" element={<EditProductPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AutoLogout>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;