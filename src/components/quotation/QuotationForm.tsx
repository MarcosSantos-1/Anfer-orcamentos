// src/components/quotation/QuotationForm.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiDollarSign, FiCalendar, FiFileText, FiTool, FiPackage, FiEdit, FiTrash } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { Quotation, QuotationItem } from '../../models/Quotation';
import { Customer } from '../../models/Customer';
import { Product } from '../../models/Product';
import { useQuotation } from '../../context/QuotationContext';
import { firebaseQuotationService } from '../../services/firebase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../../utils/formatters';

// Define tipos de produtos
const PRODUCT_TYPES = {
  SERVICE: 'Serviço',
  MANUFACTURING: 'Fabricação'
};

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
  const [productType, setProductType] = useState<string>(PRODUCT_TYPES.SERVICE);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Categorizar produtos
  const categorizedProducts = React.useMemo(() => {
    return products.map(product => {
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
  }, [products]);

  // Atualizar categorias e produtos filtrados quando mudar o tipo
  useEffect(() => {
    const filtered = categorizedProducts.filter(p => {
      const isService = p.type === PRODUCT_TYPES.SERVICE;
      return productType === PRODUCT_TYPES.SERVICE ? isService : !isService;
    });
    
    setFilteredProducts(filtered);
    
    // Extrair categorias únicas
    const categories = [...new Set(filtered.map(product => product.category))];
    setFilteredCategories(categories);
    
    // Resetar a categoria selecionada se não existir nessa filtragem
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('');
    }
  }, [productType, categorizedProducts, selectedCategory]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      
      // Tenta determinar o tipo e a categoria
      const matchingProduct = categorizedProducts.find(p => p.description === initialData.description);
      if (matchingProduct) {
        setProductType(matchingProduct.type || PRODUCT_TYPES.SERVICE);
        setSelectedCategory(matchingProduct.category);
      }
    } else {
      setFormData({
        id: '',
        title: '',     
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      });
    }
  }, [initialData, isOpen, categorizedProducts]);

  useEffect(() => {
    // Calcular o total quando muda quantidade ou preço
    const total = formData.quantity * formData.unitPrice;
    setFormData(prev => ({ ...prev, total }));
  }, [formData.quantity, formData.unitPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductType(e.target.value);
  };

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    
    if (category) {
      // Define o título como a categoria selecionada
      setFormData(prev => ({
        ...prev,
        title: category
      }));

      // Encontra todos os produtos da categoria
      const productsInCategory = filteredProducts.filter(p => p.category === category);
      
      if (productsInCategory.length > 0) {
        // Pega o primeiro produto da categoria para preencher os valores iniciais
        const firstProductInCategory = productsInCategory[0];
        
        // Se houver apenas um produto na categoria, use sua descrição
        if (productsInCategory.length === 1) {
          setFormData(prev => ({
            ...prev,
            title: category,
            description: firstProductInCategory.description,
            unitPrice: firstProductInCategory.defaultPrice
          }));
        } else {
          // Se houver vários produtos, use a categoria como descrição e o preço do primeiro produto
          setFormData(prev => ({
            ...prev,
            title: category,
            description: `${category} - Vários produtos desta categoria`,
            unitPrice: firstProductInCategory.defaultPrice
          }));
        }
      }
    }
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
      title={initialData?.id ? 'Editar Item' : 'Novo Item'}
      size="3xl"
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
        {/* Tipo de Produto */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Tipo de Produto</label>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              type="button"
              className={`px-6 py-3 text-lg font-medium flex items-center gap-2 flex-1 ${
                productType === PRODUCT_TYPES.SERVICE ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setProductType(PRODUCT_TYPES.SERVICE)}
            >
              <FiTool /> Serviço
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-lg font-medium flex items-center gap-2 flex-1 ${
                productType === PRODUCT_TYPES.MANUFACTURING ? 'bg-green-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setProductType(PRODUCT_TYPES.MANUFACTURING)}
            >
              <FiPackage /> Fabricação
            </button>
          </div>
        </div>

        <Select
          label="Categoria/Produto"
          value={selectedCategory}
          onChange={handleSelectCategory}
          options={[
            { value: '', label: 'Selecione uma categoria/produto' },
            ...filteredCategories.map(category => ({ value: category, label: category }))
          ]}
          className="text-lg"
        />

        <Input
          label="Título"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="text-lg"
        />
        
        <Textarea
          label="Descrição"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          leftIcon={<FiFileText className="text-gray-400" />}
          rows={4}
          className="text-lg"
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
            className="text-lg"
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
            className="text-lg"
          />
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xl font-semibold text-right">
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

  // Configurar informações padrão e número do pedido para novos orçamentos
  useEffect(() => {
    const setupNewQuotation = async () => {
      if (!id) {
        try {
          // Se for um novo orçamento, usar paymentInfo das configurações
          setQuotation(prev => ({
            ...prev,
            paymentInfo: settings.paymentInfo
          }));
          
          // Se não tiver número, gerar um novo
          if (!quotation.number) {
            // Obtém o próximo número de orçamento do Firebase
            const nextNumber = await firebaseQuotationService.getNextNumber();
            
            // Atualiza o estado do orçamento com o novo número
            setQuotation(prev => ({
              ...prev,
              number: nextNumber
            }));
          }
        } catch (error) {
          console.error("Erro ao configurar novo orçamento:", error);
        }
      }
    };

    setupNewQuotation();
  }, [id, settings, quotation.number]);

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

  const handleSaveQuotation = async () => {
    try {
      await saveQuotation(quotation);
      navigate('/quotations');
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      // Você pode implementar uma notificação de erro aqui
    }
  };

  // Determinar o tipo de cada item para exibição com cores diferentes
  const getItemType = (item: QuotationItem) => {
    const matchingProduct = products.find(p => p.description === item.description);
    if (!matchingProduct) return PRODUCT_TYPES.MANUFACTURING;
    
    const isService = 
      matchingProduct.category.toUpperCase().includes('REPROGRAMAÇÃO') || 
      matchingProduct.category.toUpperCase().includes('SERVIÇO') ||
      matchingProduct.description.toUpperCase().includes('SERVIÇO') ||
      matchingProduct.category.toUpperCase().includes('INSTALAÇÃO');
    
    return isService ? PRODUCT_TYPES.SERVICE : PRODUCT_TYPES.MANUFACTURING;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {id ? 'Editar Orçamento' : 'Novo Orçamento'}
        </h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate('/quotations')}
            variant="outline"
            className="text-lg"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveQuotation}
            leftIcon={<FiSave />}
            className="text-lg"
          >
            Salvar
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className='max-w-2xs'>
            <Input
              label="Número do Pedido"
              name="number"
              value={quotation.number}
              onChange={handleQuotationChange}
              disabled
              className='text-lg'
            />
          </div>
          
          <div className='max-w-3xs'>
            <Input
              label="Data"
              type="date"
              name="date"
              value={quotation.date}
              onChange={handleQuotationChange}
              leftIcon={<FiCalendar className="text-gray-400" />}
              className='text-lg'
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
                  className='text-lg'
                />
              </div>
              <Button
                onClick={handleAddCustomer}
                variant="outline"
                size="sm"
                className="mb-1 text-lg"
                leftIcon={<FiPlus />}
              >
                Novo
              </Button>
              {quotation.customer?.id && (
                <Button
                  onClick={handleEditCustomer}
                  variant="outline"
                  size="sm"
                  className="mb-1 text-lg"
                >
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {quotation.customer?.id && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md max-w-6xl">
            <h3 className="font-medium text-gray-700 mb-2">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-lg font-medium text-gray-800">{quotation.customer.name || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-base text-gray-600">Endereço:</p>
                <p className="text-lg">{quotation.customer.address || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-base text-gray-600">Contato:</p>
                <p className="text-lg">{quotation.customer.contact || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-base text-gray-600">E-mail:</p>
                <p className="text-lg">{quotation.customer.email || 'Não informado'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-10 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Itens do Orçamento</h2>
          <Button
            onClick={handleAddItem}
            leftIcon={<FiPlus />}
            size="md"
            className="text-lg"
          >
            Adicionar Item
          </Button>
        </div>
        
        {quotation.items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-lg">
            Nenhum item adicionado. Clique em "Adicionar Item" para começar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {quotation.items.map((item) => {
                  const itemType = getItemType(item);
                  const isService = itemType === PRODUCT_TYPES.SERVICE;
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 ${isService ? 'border-l-4 border-blue-500' : 'border-l-4 border-green-500'}`}
                    >
                      <td className="px-6 py-4 whitespace-normal w-3/5">
                        <div className="flex items-center gap-2">
                          {isService ? 
                            <FiTool className="text-blue-500 text-xl" /> : 
                            <FiPackage className="text-green-500 text-xl" />
                          }
                          <div>
                            <div className={`font-semibold text-lg ${isService ? 'text-blue-600' : 'text-green-600'}`}>
                              {item.title}
                            </div>
                            <div className="text-lg text-gray-600">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right w-1/5">
                        <div className="text-lg text-gray-700 font-medium">
                          {formatCurrency(item.unitPrice)} x {item.quantity}
                        </div>
                        <div className="text-lg font-bold">
                          {formatCurrency(item.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center w-1/5">
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-blue-600 hover:text-blue-900 text-xl"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-900 text-xl"
                          >
                            <FiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-full md:w-1/3">
              <div className="flex justify-between py-2">
                <span className="font-medium text-lg">Subtotal:</span>
                <span className="font-medium text-lg"> {formatCurrency(quotation.subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-lg">Taxa:</span>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="0"
                    step="1.0"
                    name="taxRate"
                    value={quotation.taxRate.toString()}
                    onChange={handleQuotationChange}
                    className="w-16 text-right ml-2 text-lg"
                  />
                  <span className="ml-4 text-lg"> % </span>
                  <span className="ml-4 text-lg"> {formatCurrency(quotation.taxes)}</span>
                </div>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium text-lg">Frete:</span>
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
                    className="w-48 text-lg"
                  />
                </div>
              </div>
              
              <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-xl font-bold"> {formatCurrency(quotation.total)} </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">Dados para Pagamento (somente para visualização)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          <Input disabled
            label="Nome"
            name="paymentInfo.name"
            value={quotation.paymentInfo?.name || ''}
            className='text-red-500 text-lg'
            onChange={(e) => setQuotation(prev => ({
              ...prev,
              paymentInfo: { ...prev.paymentInfo, name: e.target.value }
            }))}
          />
          
          <Input disabled
            label="Agência"
            name="paymentInfo.agency"
            value={quotation.paymentInfo?.agency || ''}
            className='text-red-500 text-lg'
            onChange={(e) => setQuotation(prev => ({
              ...prev,
              paymentInfo: { ...prev.paymentInfo, agency: e.target.value }
            }))}
          />
          
          <Input disabled
            label="Conta Corrente"
            name="paymentInfo.account"
            value={quotation.paymentInfo?.account || ''}
            className='text-red-500 text-lg'
            onChange={(e) => setQuotation(prev => ({
              ...prev,
              paymentInfo: { ...prev.paymentInfo, account: e.target.value }
            }))}
          />
          
          <Input disabled
            label="PIX (CNPJ)"
            name="paymentInfo.pix"
            className='text-red-500 text-lg'
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
          className="text-lg"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSaveQuotation}
          leftIcon={<FiSave />}
          className="text-lg"
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