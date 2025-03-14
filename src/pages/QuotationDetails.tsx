// src/pages/QuotationDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { FiEdit, FiDownload, FiArrowLeft } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import QuotationPDF from '../components/quotation/QuotationPDF';
import { useQuotation } from '../context/QuotationContext';
import { generatePDF } from '../services/pdf';

const QuotationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuotation } = useQuotation();
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  
  const quotation = id ? getQuotation(id) : undefined;
  
  if (!quotation) {
    return <Navigate to="/quotations" />;
  }
  
  const handleDownload = async () => {
    setIsDownloadLoading(true);
    try {
      await generatePDF(quotation, false);
    } finally {
      setIsDownloadLoading(false);
    }
  };
  
  const handleBack = async () => {
    setIsBackLoading(true);
    try {
      // Simular uma pequena espera para demonstrar o loading
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/quotations');
    } catch (error) {
      setIsBackLoading(false);
    }
  };
  
  const handleEditQuotation = (id: string) => {
    console.log("Navegando para edição do ID:", id);
    navigate(`/quotations/edit/${id}`);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center">
            <Button
              onClick={() => navigate('/quotations')}
                variant="outline"
              leftIcon={<FiArrowLeft />}
              className="mr-4 hover:bg-gray-200 hover:text-zinc-800 hover:border-zinc-400 transition-all duration-200"
              type="button"
            >
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Orçamento #{quotation.number}</h1>
          </div>
          
          <div className="flex space-x-2 z-10">
            {/* Usando um elemento div que envolve o botão para garantir que não haja sobreposição */}
            <div className="relative">
              <Button
                onClick={() => handleEditQuotation(quotation.id)}
                leftIcon={<FiEdit />}
                className="hover:bg-red-800 hover:shadow-md transition-all duration-200 relative z-20"
                type="button"
              >
                Editar
              </Button>
            </div>

            <div className="relative">
              <Button
                onClick={handleDownload}
                variant="outline"
                leftIcon={<FiDownload />}
                isLoading={isDownloadLoading}
                className="hover:bg-gray-200 hover:text-zinc-800 hover:border-zinc-400 transition-all duration-200 relative z-20"
                type="button"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg relative z-0">
          <QuotationPDF quotation={quotation} />
        </div>
      </div>
    </Layout>
  );
};

export default QuotationDetails;