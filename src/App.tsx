import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
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
import ErrorBoundary from './components/Common/ErrorBoundary';
import AppInit from './components/Common/AppInit.tsx';

const App: React.FC = () => (
  <ConfigProvider direction="rtl" locale={arEG} theme={antdTheme}>
    <AntdApp>
      <ErrorBoundary>
        <AppInit>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/section/:section" element={<SectionPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/all-products" element={<AllProductsPage />} />
                <Route path="/add" element={<AddProductPage />} />
                <Route path="/edit/:id" element={<EditProductPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </AppInit>
      </ErrorBoundary>
    </AntdApp>
  </ConfigProvider>
);

export default App;
