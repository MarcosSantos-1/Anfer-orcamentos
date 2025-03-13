// src/context/QuotationContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Quotation, QuotationItem } from '../models/Quotation';
import { Customer } from '../models/Customer';
import { Product } from '../models/Product';
import { 
  firebaseQuotationService, 
  firebaseCustomerService, 
  firebaseProductService, 
  firebaseSettingsService,
  initializeFirebase,
  migrateLocalStorageToFirebase 
} from '../services/firebase';

interface QuotationContextType {
  quotations: Quotation[];
  customers: Customer[];
  products: Product[];
  settings: any;
  
  loading: boolean;
  error: string | null;
  
  // Ações para orçamentos
  getQuotation: (id: string) => Quotation | undefined;
  createQuotation: () => Quotation;
  saveQuotation: (quotation: Quotation) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
  
  // Ações para itens de orçamento
  addQuotationItem: (quotation: Quotation, description: string, quantity: number, unitPrice: number) => Quotation;
  updateQuotationItem: (quotation: Quotation, itemId: string, data: Partial<QuotationItem>) => Quotation;
  removeQuotationItem: (quotation: Quotation, itemId: string) => Quotation;
  
  // Ações para clientes
  saveCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Ações para produtos
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Ações para configurações
  saveSettings: (settings: any) => Promise<void>;
  
  // Migração
  migrateData: () => Promise<void>;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const useQuotation = (): QuotationContextType => {
  const context = useContext(QuotationContext);
  if (!context) {
    throw new Error('useQuotation deve ser usado dentro de um QuotationProvider');
  }
  return context;
};

interface QuotationProviderProps {
  children: ReactNode;
}

export const QuotationProvider: React.FC<QuotationProviderProps> = ({ children }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados iniciais do Firebase
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        setLoading(true);
        
        // Inicializar Firebase e dados padrão
        await initializeFirebase();
        
        // Carregar todos os dados
        await loadData();
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    loadFirebaseData();
  }, []);

  const loadData = async () => {
    try {
      const [quotationsData, customersData, productsData, settingsData] = await Promise.all([
        firebaseQuotationService.getAll(),
        firebaseCustomerService.getAll(),
        firebaseProductService.getAll(),
        firebaseSettingsService.get()
      ]);
      
      console.log('Produtos carregados do Firebase:', productsData);
      
      setQuotations(quotationsData);
      setCustomers(customersData);
      setProducts(productsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    }
  };
  
  
  // Função para migrar dados do localStorage para o Firebase
  const migrateData = async () => {
    try {
      setLoading(true);
      await migrateLocalStorageToFirebase();
      await loadData();
      setLoading(false);
      return Promise.resolve();
    } catch (err) {
      console.error('Erro na migração:', err);
      setError('Erro na migração. Por favor, tente novamente.');
      setLoading(false);
      return Promise.reject(err);
    }
  };

  // Funções para orçamentos
  const getQuotation = (id: string): Quotation | undefined => {
    return quotations.find(q => q.id === id);
  };

  const createQuotation = (): Quotation => {
    const today = new Date();
    const isoDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const defaultCustomer = customers.length > 0 ? customers[0] : {
      id: '',
      name: '',
      address: '',
      contact: '',
      email: ''
    };

    const newQuotation: Quotation = {
      id: uuidv4(),
      number: '',  // Será gerado ao salvar
      date: isoDate,
      customer: defaultCustomer,
      items: [],
      subtotal: 0,
      taxes: 0,
      taxRate: 0,
      shipping: 'incluso',
      total: 0,
      paymentInfo: settings.paymentInfo || {},
      notes: ''
    };

    return newQuotation;
  };

  const calculateTotals = (quotation: Quotation): Quotation => {
    const subtotal = quotation.items.reduce((sum, item) => sum + item.total, 0);
    const taxes = (subtotal * quotation.taxRate) / 100;
    const total = subtotal + taxes;

    return {
      ...quotation,
      subtotal,
      taxes,
      total
    };
  };

  const saveQuotation = async (quotation: Quotation): Promise<void> => {
    try {
      const updatedQuotation = calculateTotals(quotation);
      
      // Se for um novo orçamento, gerar número
      if (!updatedQuotation.number) {
        updatedQuotation.number = await firebaseQuotationService.getNextNumber();
      }
      
      await firebaseQuotationService.save(updatedQuotation);
      await loadData();  // Recarregar dados após salvar
    } catch (err) {
      console.error('Erro ao salvar orçamento:', err);
      setError('Erro ao salvar orçamento. Por favor, tente novamente.');
      throw err;
    }
  };

  const deleteQuotation = async (id: string): Promise<void> => {
    try {
      await firebaseQuotationService.delete(id);
      await loadData();  // Recarregar dados após excluir
    } catch (err) {
      console.error('Erro ao excluir orçamento:', err);
      setError('Erro ao excluir orçamento. Por favor, tente novamente.');
      throw err;
    }
  };

  // Funções para itens de orçamento
  const addQuotationItem = (
    quotation: Quotation,
    description: string,
    quantity: number,
    unitPrice: number
  ): Quotation => {
    const newItem: QuotationItem = {
      id: uuidv4(),
      title: '',
      description,
      quantity,
      unitPrice,
      total: quantity * unitPrice
    };

    const updatedQuotation = {
      ...quotation,
      items: [...quotation.items, newItem]
    };

    return calculateTotals(updatedQuotation);
  };

  const updateQuotationItem = (
    quotation: Quotation,
    itemId: string,
    data: Partial<QuotationItem>
  ): Quotation => {
    const updatedItems = quotation.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, ...data };
        // Recalcular o total do item se quantidade ou preço unitário foram alterados
        if (data.quantity !== undefined || data.unitPrice !== undefined) {
          updatedItem.total = (data.quantity || item.quantity) * (data.unitPrice || item.unitPrice);
        }
        return updatedItem;
      }
      return item;
    });

    const updatedQuotation = {
      ...quotation,
      items: updatedItems
    };

    return calculateTotals(updatedQuotation);
  };

  const removeQuotationItem = (quotation: Quotation, itemId: string): Quotation => {
    const updatedQuotation = {
      ...quotation,
      items: quotation.items.filter(item => item.id !== itemId)
    };

    return calculateTotals(updatedQuotation);
  };

  // Funções para clientes
  const saveCustomer = async (customer: Customer): Promise<void> => {
    try {
      const isNew = !customer.id;
      
      if (isNew) {
        customer.id = uuidv4();
      }
      
      await firebaseCustomerService.save(customer);
      await loadData();  // Recarregar dados após salvar
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError('Erro ao salvar cliente. Por favor, tente novamente.');
      throw err;
    }
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    try {
      await firebaseCustomerService.delete(id);
      await loadData();  // Recarregar dados após excluir
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setError('Erro ao excluir cliente. Por favor, tente novamente.');
      throw err;
    }
  };

  // Funções para produtos
  const saveProduct = async (product: Product): Promise<void> => {
    try {
      const isNew = !product.id;
      
      if (isNew) {
        product.id = uuidv4();
      }
      
      await firebaseProductService.save(product);
      await loadData();  // Recarregar dados após salvar
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setError('Erro ao salvar produto. Por favor, tente novamente.');
      throw err;
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await firebaseProductService.delete(id);
      await loadData();  // Recarregar dados após excluir
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      setError('Erro ao excluir produto. Por favor, tente novamente.');
      throw err;
    }
  };

  // Funções para configurações
  const saveSettings = async (newSettings: any): Promise<void> => {
    try {
      await firebaseSettingsService.save(newSettings);
      setSettings(newSettings);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      setError('Erro ao salvar configurações. Por favor, tente novamente.');
      throw err;
    }
  };

  const value = {
    quotations,
    customers,
    products,
    settings,
    loading,
    error,
    
    getQuotation,
    createQuotation,
    saveQuotation,
    deleteQuotation,
    
    addQuotationItem,
    updateQuotationItem,
    removeQuotationItem,
    
    saveCustomer,
    deleteCustomer,
    
    saveProduct,
    deleteProduct,
    
    saveSettings,
    
    migrateData
  };

  return (
    <QuotationContext.Provider value={value}>
      {children}
    </QuotationContext.Provider>
  );
};