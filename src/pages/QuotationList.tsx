// src/pages/QuotationList.tsx
import React from 'react';
import Layout from '../components/layout/Layout';
import QuotationList from '../components/quotation/QuotationList';

const QuotationListPage: React.FC = () => {
  return (
    <Layout>
      <QuotationList />
    </Layout>
  );
};

export default QuotationListPage;