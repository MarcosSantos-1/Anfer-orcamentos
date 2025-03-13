// src/Router.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import QuotationListPage from './pages/QuotationList';
import NewQuotation from './pages/NewQuotation';
import EditQuotation from './pages/EditQuotation';
import QuotationDetails from './pages/QuotationDetails';
import CustomerManagement from './pages/CustomerManagement';
import ProductManagement from './pages/ProductManagement';
import Settings from './pages/Settings';

const Router: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<Dashboard />} />
      
      {/* Quotations */}
      <Route path="/quotations" element={<QuotationListPage />} />
      <Route path="/quotations/new" element={<NewQuotation />} />
      <Route path="/quotations/edit/:id" element={<EditQuotation />} />
      <Route path="/quotations/:id" element={<QuotationDetails />} />
      
      {/* Customers */}
      <Route path="/customers" element={<CustomerManagement />} />
      
      {/* Products */}
      <Route path="/products" element={<ProductManagement />} />
      
      {/* Settings */}
      <Route path="/settings" element={<Settings />} />
      
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;