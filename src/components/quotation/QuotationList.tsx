// src/components/quotation/QuotationList.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { SiQuicklook } from "react-icons/si";
import { MdEditDocument } from "react-icons/md";
import { FaDownload, FaPlus, FaTrash } from "react-icons/fa6";

import { useQuotation } from '../../context/QuotationContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { generatePDF } from '../../services/pdf';

const QuotationList: React.FC = () => {
  const navigate = useNavigate();
  const { quotations, deleteQuotation } = useQuotation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<string | null>(null);

  // Filtrar orçamentos
  const filteredQuotations = useMemo(() => {
    return quotations.filter(quotation => {
      const searchLower = searchTerm.toLowerCase();
      return (
        quotation.number.toLowerCase().includes(searchLower) ||
        quotation.customer.name.toLowerCase().includes(searchLower) ||
        formatDate(quotation.date).includes(searchLower)
      );
    });
  }, [quotations, searchTerm]);

  // Ordenar orçamentos (mais recentes primeiro)
  const sortedQuotations = useMemo(() => {
    return [...filteredQuotations].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredQuotations]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewQuotation = (id: string) => {
    navigate(`/quotations/${id}`);
  };

  const handleEditQuotation = (id: string) => {
    navigate(`/quotations/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setQuotationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (quotationToDelete) {
      deleteQuotation(quotationToDelete);
      setShowDeleteModal(false);
      setQuotationToDelete(null);
    }
  };


  const handleDownloadQuotation = (id: string) => {
    const quotation = quotations.find(q => q.id === id);
    if (quotation) {
      generatePDF(quotation, false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orçamentos</h1>
        <Button
          onClick={() => navigate('/quotations/new')}
          leftIcon={<FaPlus  />}
        >
          Novo Orçamento
        </Button>
      </div>

      <div className="bg-white shadow rounded-3xl p-6 ">
        <div className="flex mb-6">
          <Input
            placeholder="Buscar por número, cliente ou data..."
            value={searchTerm}
            onChange={handleSearch}
            leftIcon={<FiSearch className="text-gray-400" />}
            className="max-w-md h-10 text-lg font-medium"
          />
        </div>

        {sortedQuotations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum orçamento encontrado.</p>
            <Button
              onClick={() => navigate('/quotations/new')}
              variant="outline"
              leftIcon={<FaPlus  />}
            >
              Criar primeiro orçamento
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-lg font-medium text-gray-600 uppercase tracking-wider">
                    Nº
                  </th>
                  <th className="px-6 py-3 text-left text-lg font-medium text-gray-600 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-lg font-medium text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-right text-lg font-medium text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-lg font-medium text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-md font-medium text-gray-900">
                        {quotation.number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-md text-gray-6  00">
                        {formatDate(quotation.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg text-gray-900">
                        {quotation.customer.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-md font-medium text-gray-900">
                       {formatCurrency(quotation.total)} 
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleViewQuotation(quotation.id)}
                          className="text-indigo-600 hover:text-indigo-900 text-xl duration-200"
                          title="Visualizar"
                        >
                          <SiQuicklook  />
                        </button>
                        <button
                          onClick={() => handleEditQuotation(quotation.id)}
                          className="text-yellow-600 hover:text-yellow-900 text-xl duration-200"
                          title="Editar"
                        >
                          <MdEditDocument />
                        </button>
                        <button
                          onClick={() => handleDownloadQuotation(quotation.id)}
                          className="text-purple-600 hover:text-purple-900 text-xl duration-200"
                          title="Download PDF"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(quotation.id)}
                          className="text-red-600 hover:text-red-900 text-xl duration-200"
                          title="Excluir"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmação para excluir */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="mr-3"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              leftIcon={<FaTrash />}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p>Tem certeza que deseja excluir este orçamento?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

export default QuotationList;