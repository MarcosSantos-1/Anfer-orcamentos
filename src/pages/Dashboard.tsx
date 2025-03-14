// src/pages/Dashboard.tsx
import React, { useMemo } from 'react';
import { FiFileText, FiUsers, FiPackage, FiPlus, FiArrowRight } from 'react-icons/fi';
import { SiQuicklook } from "react-icons/si";
import { Link } from 'react-router-dom';
import { useQuotation } from '../context/QuotationContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { quotations, customers, products } = useQuotation();

  // Cálculos para o dashboard
  const stats = useMemo(() => {
    const totalQuotations = quotations.length;

    // Total de orçamentos este mês
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const thisMonthQuotations = quotations.filter(quotation => {
      const date = new Date(quotation.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const quotationsThisMonth = thisMonthQuotations.length;

    // Valor total de orçamentos
    const totalValue = quotations.reduce((sum, quotation) => sum + quotation.total, 0);

    // Valor médio dos orçamentos
    const averageValue = totalQuotations > 0 ? totalValue / totalQuotations : 0;

    return {
      totalQuotations,
      quotationsThisMonth,
      totalValue,
      averageValue
    };
  }, [quotations]);

  // Orçamentos recentes (últimos 5)
  const recentQuotations = useMemo(() => {
    return [...quotations]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [quotations]);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Página</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card de Orçamentos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Orçamentos</p>
                <p className="text-3xl font-bold">{stats.totalQuotations}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {stats.quotationsThisMonth} este mês
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FiFileText className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <Link to="/quotations" className="text-sm text-red-600 mt-4 inline-flex items-center">
              Ver todos <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {/* Card de Clientes */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Clientes</p>
                <p className="text-3xl font-bold">{customers.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Link to="/customers" className="text-sm text-blue-600 mt-4 inline-flex items-center">
              Ver todos <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {/* Card de Produtos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Produtos</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiPackage className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Link to="/products" className="text-sm text-green-600 mt-4 inline-flex items-center">
              Ver todos <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {/* Card de Valor */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Valor Total</p>
                <p className="text-3xl font-bold">{formatCurrency(stats.totalValue)}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Média: {formatCurrency(stats.averageValue)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FiFileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orçamentos Recentes */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Orçamentos Recentes</h2>
              <Link to="/quotations/new">
                <Button leftIcon={<FiPlus />} size="lg">
                  Novo Orçamento
                </Button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            {recentQuotations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Nenhum orçamento encontrado.</p>
                <Link to="/quotations/new">
                  <Button variant="outline" leftIcon={<FiPlus />}>
                    Criar primeiro orçamento
                  </Button>
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-lg font-bold text-gray-600 uppercase tracking-wider">
                      Nº
                    </th>
                    <th className="px-6 py-3 text-left text-lg font-bold text-gray-600 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-lg font-bold text-gray-600 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-right text-lg font-bold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-lg font-bold text-gray-600 uppercase tracking-wider">
                      
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentQuotations.map((quotation) => (
                    <tr key={quotation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-medium text-gray-900">
                          {quotation.number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg text-gray-500">
                          {new Date(quotation.date).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg text-gray-900">
                          {quotation.customer.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-medium text-gray-900">
                          {formatCurrency(quotation.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex flex-row items-center gap-2 justify-center text-right">
                        <Link to={`/quotations/${quotation.id}`} className="text-purple-600 hover:text-purple-900 flex items-center duration-200 gap-2">
                          <SiQuicklook />
                          <span className='font-semibold text-lg'>Ver detalhes</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;