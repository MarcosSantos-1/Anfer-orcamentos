// src/pages/ProductManagement.tsx
import React, { useState, useEffect } from 'react';
import { FiSearch, FiSave, FiTool, FiPackage } from 'react-icons/fi';
import { MdEditDocument } from "react-icons/md";
import { FaDownload, FaPlus, FaTrash } from "react-icons/fa6";

import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { useQuotation } from '../context/QuotationContext';
import { Product } from '../models/Product';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../utils/formatters';
import Textarea from '../components/ui/Textarea';

// Define tipos de produtos
const PRODUCT_TYPES = {
  SERVICE: 'Serviço',
  MANUFACTURING: 'Fabricação'
};

const ProductManagement: React.FC = () => {
  const { products, saveProduct, deleteProduct } = useQuotation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const [formData, setFormData] = useState<Product & { type?: string }>({
    id: '',
    description: '',
    defaultPrice: 0,
    category: '',
    type: PRODUCT_TYPES.SERVICE
  });
  
  // Estender o modelo de produtos para incluir o tipo (serviço ou fabricação)
  // Isso é feito apenas na memória para demonstração, sem alterar a estrutura do banco de dados
  const [extendedProducts, setExtendedProducts] = useState<(Product & { type: string })[]>([]);
  
  useEffect(() => {
    // Categoriza produtos de acordo com padrões no nome/categoria
    const categorized = products.map(product => {
      const isService = 
        product.category.toUpperCase().includes('REPROGRAMAÇÃO') || 
        product.category.toUpperCase().includes('SERVIÇO') ||
        product.description.toUpperCase().includes('SERVIÇO') ||
        product.category.toUpperCase().includes('INSTALAÇÃO');
        
      return {
        ...product,
        type: isService ? PRODUCT_TYPES.SERVICE : PRODUCT_TYPES.MANUFACTURING
      };
    });
    
    setExtendedProducts(categorized);
  }, [products]);
  
  // Filtrar produtos
  const filteredProducts = extendedProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.defaultPrice.toString().includes(searchLower);
      
    // Filtra por tipo (serviço ou fabricação) ou mostra todos
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'service') return matchesSearch && product.type === PRODUCT_TYPES.SERVICE;
    if (activeTab === 'manufacturing') return matchesSearch && product.type === PRODUCT_TYPES.MANUFACTURING;
    
    return matchesSearch;
  });
  
  // Agrupar produtos por categoria
  const groupedProducts = filteredProducts.reduce<Record<string, (Product & { type: string })[]>>((acc, product) => {
    const category = product.category || 'Sem Categoria';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormData({
      id: '',
      description: '',
      defaultPrice: 0,
      category: '',
      type: PRODUCT_TYPES.SERVICE
    });
    setIsModalOpen(true);
  };
  
  const handleEditProduct = (product: Product & { type: string }) => {
    setSelectedProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultPrice' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Adiciona o tipo ao nome da categoria para melhor organização
    let category = formData.category;
    if (formData.type && !category.includes(formData.type)) {
      category = `${formData.type} - ${category}`;
    }
    
    saveProduct({
      id: formData.id || uuidv4(),
      description: formData.description,
      defaultPrice: formData.defaultPrice,
      category: category
    });
    
    setIsModalOpen(false);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Produtos e Serviços</h1>
          <Button
            onClick={handleAddProduct}
            leftIcon={<FaPlus />}
            className="text-lg py-3 px-6"
          >
            Novo Produto
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6 flex flex-col  md:flex-row justify-between items-start gap-4">
            <Input
              placeholder="Buscar por descrição, categoria ou preço..."
              value={searchTerm}
              onChange={handleSearch}
              leftIcon={<FiSearch className="text-gray-400" />}
              className="w-full max-w-3xl text-lg h-12"
            />
            
            {/* Tabs para filtrar por tipo */}
            <div className="flex rounded-lg border border-gray-300">
              <button
                className={`px-6 py-3 text-lg font-medium ${activeTab === 'all' ? 'bg-red-700 text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('all')}
              >
                Todos
              </button>
              <button
                className={`px-6 py-3 text-lg font-medium flex items-center gap-2 ${activeTab === 'service' ? 'bg-red-700 text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('service')}
              >
                <FiTool /> Serviços
              </button>
              <button
                className={`px-6 py-3 text-lg font-medium flex items-center gap-2 ${activeTab === 'manufacturing' ? 'bg-red-700 text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('manufacturing')}
              >
                <FiPackage /> Fabricação
              </button>
            </div>
          </div>
          
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4 text-lg">Nenhum produto encontrado.</p>
              <Button
                onClick={handleAddProduct}
                variant="outline"
                leftIcon={<FaPlus />} 
                className="text-lg py-3 px-6"
              >
                Adicionar produto
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
                // Determina o tipo da categoria a partir dos produtos
                const categoryType = categoryProducts[0]?.type || PRODUCT_TYPES.MANUFACTURING;
                const isService = categoryType === PRODUCT_TYPES.SERVICE;
                
                return (
                <div key={category}>
                  <h2 className={`text-xl font-semibold px-6 py-3 rounded-t-lg mb-2 flex items-center gap-2 ${isService ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {isService ? <FiTool className="text-xl" /> : <FiPackage className="text-xl" />}
                    {category}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categoryProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-normal w-3/5">
                              <span className="text-lg font-medium text-gray-900">
                                {product.description}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right w-1/5">
                              <span className="text-xl text-gray-800 font-medium">
                                {formatCurrency(product.defaultPrice)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center w-1/5">
                              <div className="flex justify-center space-x-4">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="text-blue-600 hover:text-blue-900 text-2xl"
                                  title="Editar"
                                >
                                  <MdEditDocument />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(product.id)}
                                  className="text-red-600 hover:text-red-900 text-2xl"
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
                </div>
              )})}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Produto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Editar Produto' : 'Novo Produto'}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="mr-3 text-lg py-2 px-4"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              leftIcon={<FiSave />}
              className="text-lg py-2 px-4"
            >
              Salvar
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Tipo de Produto"
            name="type"
            value={formData.type || PRODUCT_TYPES.SERVICE}
            onChange={handleChange}
            options={[
              { value: PRODUCT_TYPES.SERVICE, label: 'Serviço' },
              { value: PRODUCT_TYPES.MANUFACTURING, label: 'Fabricação' }
            ]}
            className="text-lg"
          />
          
          <Input
            label="Categoria"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="Ex: CONTROLES CLONES, REPROGRAMAÇÃO..."
            className="text-lg"
          />
          
          <Textarea
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="text-lg"
            rows={4}
          />
          
          <Input
            label="Preço Padrão (R$)"
            name="defaultPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.defaultPrice.toString()}
            onChange={handleChange}
            required
            className="text-lg"
          />
        </form>
      </Modal>
      
      {/* Modal de confirmação para excluir */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="mr-3 text-lg py-2 px-4"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              leftIcon={<FaTrash />}
              className="text-lg py-2 px-4"
            >
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-lg">Tem certeza que deseja excluir este produto?</p>
        <p className="text-base text-gray-500 mt-3">Esta ação não pode ser desfeita.</p>
      </Modal>
    </Layout>
  );
};

export default ProductManagement;