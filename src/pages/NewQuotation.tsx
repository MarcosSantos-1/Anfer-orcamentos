// src/pages/NewQuotation.tsx
import React from 'react';
import Layout from '../components/layout/Layout';
import QuotationForm from '../components/quotation/QuotationForm';

const NewQuotation: React.FC = () => {
  return (
    <Layout>
      <QuotationForm />
    </Layout>
  );
};

export default NewQuotation;