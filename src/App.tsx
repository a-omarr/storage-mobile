import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import arEG from 'antd/locale/ar_EG';
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
    <ConfigProvider
      direction="rtl"
      locale={arEG}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 10,
          fontFamily: "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: 14,
        },
        components: {
          Button: {
            borderRadius: 10,
          },
          Card: {
            borderRadius: 12,
          },
          Input: {
            borderRadius: 10,
          },
          Select: {
            borderRadius: 10,
          },
        },
      }}
    >
      <AuthProvider>
        <AutoLogout>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Home />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/section/:section"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SectionPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <AdminRoute>
                    <AppLayout>
                      <AddProductPage />
                    </AppLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <AdminRoute>
                    <AppLayout>
                      <EditProductPage />
                    </AppLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProductDetailPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SearchResultsPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/all-products"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AllProductsPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AutoLogout>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
