// src/components/quotation/QuotationForm.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { Quotation, QuotationItem } from '../../models/Quotation';
import { Customer } from '../../models/Customer';
import { Product } from '../../models/Product';
import { useQuotation } from '../../context/QuotationContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../../utils/formatters';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  initialData?: Customer;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Customer>({
    id: '',
    name: '',
    address: '',
    contact: '',
    email: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: '',
        name: '',
        address: '',
        contact: '',
        email: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: formData.id || uuidv4() });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? 'Editar Cliente' : 'Novo Cliente'}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} className="mr-3">
            Cancelar
          </Button>
          <Button
            type="button"
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
  );
};

interface ProductItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: QuotationItem) => void;
  initialData?: QuotationItem;
  products: Product[];
}

const ProductItemModal: React.FC<ProductItemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  products
}) => {
  const [formData, setFormData] = useState<QuotationItem>({
    id: '',
    title: '',     
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: '',
        title: '',     
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      });
      setSelectedCategory('');
      setSelectedProduct('');
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    // Calcular o total quando muda quantidade ou preço
    const total = formData.quantity * formData.unitPrice;
    setFormData(prev => ({ ...prev, total }));
  }, [formData.quantity, formData.unitPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedProduct('');
  };

  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setSelectedProduct(productId);
    
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        // Assume que a categoria pode ser usada como título
        // Ou você pode adicionar um campo title ao modelo Product
        setFormData(prev => ({
          ...prev,
          title: product.category || '',
          description: product.description,
          unitPrice: product.defaultPrice
        }));
      }
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: formData.id || uuidv4() });
    onClose();
  };

  // Obter categorias únicas dos produtos
  const categories = [...new Set(products.map(product => product.category))];
  
  // Filtrar produtos pela categoria selecionada
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? 'Editar Item' : 'Novo Item'}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} className="mr-3">
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            leftIcon={<FiSave />}
          >
            Salvar
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Categoria"
          value={selectedCategory}
          onChange={handleSelectCategory}
          options={categories.map(category => ({ value: category, label: category }))}
        />

        {selectedCategory && (
          <Select
            label="Produto"
            value={selectedProduct}
            onChange={handleSelectProduct}
            options={filteredProducts.map(product => ({ value: product.id, label: product.description }))}
          />
        )}
        <Input
          label="Título"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Input
          label="Descrição"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantidade"
            name="quantity"
            type="number"
            min="1"
            step="1"
            value={formData.quantity.toString()}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Preço Unitário (R$)"
            name="unitPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.unitPrice.toString()}
            onChange={handleChange}
            required
            leftIcon={<FiDollarSign className="text-gray-400" />}
          />
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <p className="text-lg font-semibold text-right">
            Total: {formatCurrency(formData.total)} 
          </p>
        </div>
      </form>
    </Modal>
  );
};

const QuotationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { 
    getQuotation, 
    createQuotation, 
    saveQuotation, 
    customers,
    products,
    saveCustomer,
    settings
  } = useQuotation();

  const [quotation, setQuotation] = useState<Quotation>(() => {
    if (id) {
      const existingQuotation = getQuotation(id);
      return existingQuotation || createQuotation();
    }
    return createQuotation();
  });

  

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QuotationItem | null>(null);

  // Atualizar número do pedido formatado
  useEffect(() => {
    if (!id) {
      // Se for um novo orçamento, usar paymentInfo das configurações
      setQuotation(prev => ({
        ...prev,
        paymentInfo: settings.paymentInfo
      }));
    }
  }, [id, settings]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    const customer = customers.find(c => c.id === customerId);
    
    if (customer) {
      setQuotation(prev => ({ ...prev, customer }));
    }
  };

  const handleQuotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuotation(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const handleEditCustomer = () => {
    setSelectedCustomer(quotation.customer);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = (customer: Customer) => {
    saveCustomer(customer);
    setQuotation(prev => ({ ...prev, customer }));
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: QuotationItem) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (item: QuotationItem) => {
    const items = [...quotation.items];
    const index = items.findIndex(i => i.id === item.id);
    
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    
    // Recalcular subtotal e total
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const taxes = (subtotal * quotation.taxRate) / 100;
    
    setQuotation(prev => ({
      ...prev,
      items,
      subtotal,
      taxes,
      total: subtotal + taxes
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    const items = quotation.items.filter(item => item.id !== itemId);
    
    // Recalcular subtotal e total
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const taxes = (subtotal * quotation.taxRate) / 100;
    
    setQuotation(prev => ({
      ...prev,
      items,
      subtotal,
      taxes,
      total: subtotal + taxes
    }));
  };

  const handleSaveQuotation = () => {
    saveQuotation(quotation);
    navigate('/quotations');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id ? 'Editar Orçamento' : 'Novo Orçamento'}
        </h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate('/quotations')}
            variant="outline"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveQuotation}
            leftIcon={<FiSave />}
          >
            Salvar
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Input
              label="Número do Pedido"
              name="number"
              value={quotation.number}
              onChange={handleQuotationChange}
              disabled
            />
          </div>
          
          <div>
            <Input
              label="Data"
              type="date"
              name="date"
              value={quotation.date}
              onChange={handleQuotationChange}
              leftIcon={<FiCalendar className="text-gray-400" />}
            />
          </div>
          
          <div>
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <Select
                  label="Cliente"
                  value={quotation.customer?.id || ''}
                  onChange={handleCustomerChange}
                  options={customers.map(c => ({ value: c.id, label: c.name }))}
                />
              </div>
              <Button
                onClick={handleAddCustomer}
                variant="outline"
                size="sm"
                className="mb-1"
                leftIcon={<FiPlus />}
              >
                Novo
              </Button>
              {quotation.customer?.id && (
                <Button
                  onClick={handleEditCustomer}
                  variant="outline"
                  size="sm"
                  className="mb-1"
                >
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {quotation.customer?.id && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600">Endereço:</p>
                <p>{quotation.customer.address || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contato:</p>
                <p>{quotation.customer.contact || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">E-mail:</p>
                <p>{quotation.customer.email || 'Não informado'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Itens do Orçamento</h2>
          <Button
            onClick={handleAddItem}
            leftIcon={<FiPlus />}
            size="sm"
          >
            Adicionar Item
          </Button>
        </div>
        
        {quotation.items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum item adicionado. Clique em "Adicionar Item" para começar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Título/Descrição
                 </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Unitário
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotation.items.map((item) => (
                  <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-full md:w-1/3">
              <div className="flex justify-between py-2">
                <span className="font-medium">Subtotal:</span>
                <span className="font-medium"> {formatCurrency(quotation.subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Taxa:</span>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    name="taxRate"
                    value={quotation.taxRate.toString()}
                    onChange={handleQuotationChange}
                    className="w-16 text-right ml-2"
                  />
                  <span className="ml-1">%</span>
                  <span className="ml-4"> {formatCurrency(quotation.taxes)}</span>
                </div>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium">Frete:</span>
                <div>
                  <Select
                    name="shipping"
                    value={quotation.shipping}
                    onChange={(e) => setQuotation(prev => ({ ...prev, shipping: e.target.value }))}
                    options={[
                      { value: 'incluso', label: 'Incluso' },
                      { value: 'gratis', label: 'Grátis' },
                      { value: 'a_combinar', label: 'A combinar' }
                    ]}
                    className="w-32"
                  />
                </div>
              </div>
              
              <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold"> {formatCurrency(quotation.total)} </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados para Pagamento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            name="paymentInfo.name"
            value={quotation.paymentInfo?.name || ''}
            onChange={(e) => setQuotation(prev => ({
              ...prev,
              paymentInfo: { ...prev.paymentInfo, name: e.target.value }
            }))}
          />
          
          <Input
            label="Agência"
            name="paymentInfo.agency"
            value={quotation.paymentInfo?.agency || ''}
            onChange={(e) => setQuotation(prev => ({
              ...prev,
              paymentInfo: { ...prev.paymentInfo, agency: e.target.value }
            }))}
          />
          
          <Input
            label="Conta Corrente"
            name="paymentInfo.account"
            value={quotation.paymentInfo?.account || ''}
            onChange={(e) => setQuotation(prev => ({
              ...prev,
              paymentInfo: { ...prev.paymentInfo, account: e.target.value }
            }))}
          />
          
          <Input
            label="PIX (CNPJ)"
            name="paymentInfo.pix"
            value={quotation.paymentInfo?.pix || ''}
            onChange={(e) => setQuotation(prev => ({
              ...prev,
              paymentInfo: { ...prev.paymentInfo, pix: e.target.value }
            }))}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          onClick={() => navigate('/quotations')}
          variant="outline"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSaveQuotation}
          leftIcon={<FiSave />}
        >
          Salvar Orçamento
        </Button>
      </div>

      {/* Modais */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        initialData={selectedCustomer || undefined}
      />
      
      <ProductItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialData={selectedItem || undefined}
        products={products}
      />
    </div>
  );
};

export default QuotationForm;