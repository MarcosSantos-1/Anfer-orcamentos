// src/pages/QuotationDetails.tsx
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { FiEdit, FiPrinter, FiDownload, FiArrowLeft } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import QuotationPDF from '../components/quotation/QuotationPDF';
import { useQuotation } from '../context/QuotationContext';
import { generatePDF } from '../services/pdf';

const QuotationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuotation } = useQuotation();
  
  const quotation = id ? getQuotation(id) : undefined;
  
  if (!quotation) {
    return <Navigate to="/quotations" />;
  }
  
  const handlePrint = () => {
    generatePDF(quotation, true);
  };
  
  const handleDownload = () => {
    generatePDF(quotation, false);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              onClick={() => navigate('/quotations')}
              variant="outline"
              leftIcon={<FiArrowLeft />}
              className="mr-4"
            >
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Orçamento #{quotation.number}</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => navigate(`/quotations/edit/${quotation.id}`)}
              leftIcon={<FiEdit />}
            >
              Editar
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              leftIcon={<FiPrinter />}
            >
              Imprimir
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              leftIcon={<FiDownload />}
            >
              Download PDF
            </Button>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <QuotationPDF quotation={quotation} />
        </div>
      </div>
    </Layout>
  );
};

export default QuotationDetails;