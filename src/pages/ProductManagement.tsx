// src/pages/ProductManagement.tsx
import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash, FiSearch, FiSave } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useQuotation } from '../context/QuotationContext';
import { Product } from '../models/Product';
import { v4 as uuidv4 } from 'uuid';

const ProductManagement: React.FC = () => {
  const { products, saveProduct, deleteProduct } = useQuotation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Product>({
    id: '',
    description: '',
    defaultPrice: 0,
    category: ''
  });
  
  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.defaultPrice.toString().includes(searchLower)
    );
  });
  
  // Agrupar produtos por categoria
  const groupedProducts = filteredProducts.reduce<Record<string, Product[]>>((acc, product) => {
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
      category: ''
    });
    setIsModalOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'defaultPrice' ? parseFloat(value) || 0 : value 
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProduct({
      ...formData,
      id: formData.id || uuidv4()
    });
    setIsModalOpen(false);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Produtos e Serviços</h1>
          <Button
            onClick={handleAddProduct}
            leftIcon={<FiPlus />}
          >
            Novo Produto
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex mb-6">
            <Input
              placeholder="Buscar por descrição, categoria ou preço..."
              value={searchTerm}
              onChange={handleSearch}
              leftIcon={<FiSearch className="text-gray-400" />}
              className="max-w-md"
            />
          </div>
          
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhum produto encontrado.</p>
              <Button
                onClick={handleAddProduct}
                variant="outline"
                leftIcon={<FiPlus />}
              >
                Adicionar produto
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                <div key={category}>
                  <h2 className="text-lg font-semibold px-6 py-2 bg-gray-100 rounded-t-lg mb-2">
                    {category}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Preço Padrão
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categoryProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">
                                {product.description}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-sm text-gray-500">
                                R$ {product.defaultPrice.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <FiEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(product.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Excluir"
                                >
                                  <FiTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
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
              className="mr-3"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              leftIcon={<FiSave />}
            >
              Salvar
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Categoria"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="Ex: CONTROLES CLONES, REPROGRAMAÇÃO..."
          />
          <Input
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
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
              className="mr-3"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              leftIcon={<FiTrash />}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p>Tem certeza que deseja excluir este produto?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
      </Modal>
    </Layout>
  );
};

export default ProductManagement;