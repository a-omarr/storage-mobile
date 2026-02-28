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
import { useAuth, AuthProvider } from './auth/AuthContext';
import PinSetupPage from './pages/PinSetupPage/PinSetupPage';
import PinEntryPage from './pages/PinEntryPage/PinEntryPage';

const AppContent: React.FC = () => {
  const { isReady, isPinSet, isUnlocked } = useAuth();

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen text-primary text-xl font-bold bg-gray-50" style={{ fontFamily: 'Cairo, sans-serif' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!isPinSet) {
    return <PinSetupPage />;
  }

  if (!isUnlocked) {
    return <PinEntryPage />;
  }

  return (
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
  );
};

const App: React.FC = () => (
  <ConfigProvider direction="rtl" locale={arEG} theme={antdTheme}>
    <AntdApp>
      <ErrorBoundary>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorBoundary>
    </AntdApp>
  </ConfigProvider>
);

export default App;
