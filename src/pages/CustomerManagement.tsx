// src/pages/CustomerManagement.tsx
import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash, FiSearch, FiSave } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useQuotation } from '../context/QuotationContext';
import { Customer } from '../models/Customer';
import { v4 as uuidv4 } from 'uuid';

const CustomerManagement: React.FC = () => {
  const { customers, saveCustomer, deleteCustomer } = useQuotation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Customer>({
    id: '',
    name: '',
    address: '',
    contact: '',
    email: ''
  });
  
  // Filtrar clientes
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.address.toLowerCase().includes(searchLower) ||
      customer.contact.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower)
    );
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setFormData({
      id: '',
      name: '',
      address: '',
      contact: '',
      email: ''
    });
    setIsModalOpen(true);
  };
  
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({ ...customer });
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomer({
      ...formData,
      id: formData.id || uuidv4()
    });
    setIsModalOpen(false);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <Button
            onClick={handleAddCustomer}
            leftIcon={<FiPlus />}
          >
            Novo Cliente
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex mb-6">
            <Input
              placeholder="Buscar por nome, endereço, contato..."
              value={searchTerm}
              onChange={handleSearch}
              leftIcon={<FiSearch className="text-gray-400" />}
              className="max-w-md h-10"
            />
          </div>
          
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhum cliente encontrado.</p>
              <Button
                onClick={handleAddCustomer}
                variant="outline"
                leftIcon={<FiPlus />}
              >
                Adicionar cliente
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      E-mail
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="text-base font-medium text-gray-900 whitespace-normal break-words">
                          {customer.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-base text-gray-500 whitespace-normal break-words">
                          {customer.address}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-base text-gray-500 whitespace-normal break-words">
                          {customer.contact}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-base text-gray-500 whitespace-normal break-words">
                          {customer.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(customer.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <FiTrash className="w-5 h-5" />
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
      </div>
      
      {/* Modal de Cliente */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? 'Editar Cliente' : 'Novo Cliente'}
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
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Endereço"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Input
            label="Contato"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
          <Input
            label="E-mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
        <p>Tem certeza que deseja excluir este cliente?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
      </Modal>
    </Layout>
  );
};

export default CustomerManagement;