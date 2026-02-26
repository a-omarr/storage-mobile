import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import arEG from 'antd/locale/ar_EG';
import AppLayout from './components/Layout/AppLayout';
import Home from './pages/Home/Home';
import SectionPage from './pages/SectionPage';
import AddProductPage from './pages/AddProductPage/AddProductPage';
import EditProductPage from './pages/EditProductPage/EditProductPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import AllProductsPage from './pages/AllProductsPage/AllProductsPage';

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
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="/section/:section"
            element={
              <AppLayout>
                <SectionPage />
              </AppLayout>
            }
          />
          <Route
            path="/add"
            element={
              <AppLayout>
                <AddProductPage />
              </AppLayout>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <AppLayout>
                <EditProductPage />
              </AppLayout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <AppLayout>
                <ProductDetailPage />
              </AppLayout>
            }
          />
          <Route
            path="/search"
            element={
              <AppLayout>
                <SearchResultsPage />
              </AppLayout>
            }
          />
          <Route
            path="/all-products"
            element={
              <AppLayout>
                <AllProductsPage />
              </AppLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
