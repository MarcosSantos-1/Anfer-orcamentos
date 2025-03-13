

// src/pages/EditQuotation.tsx
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import QuotationForm from '../components/quotation/QuotationForm';
import { useQuotation } from '../context/QuotationContext';

const EditQuotation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getQuotation } = useQuotation();
  
  if (!id || !getQuotation(id)) {
    return <Navigate to="/quotations" />;
  }
  
  return (
    <Layout>
      <QuotationForm />
    </Layout>
  );
};

export default EditQuotation;