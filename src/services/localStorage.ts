// src/services/localStorage.ts
import { Quotation } from '../models/Quotation';
import { Customer } from '../models/Customer';
import { Product } from '../models/Product';

// Chaves para o localStorage
const KEYS = {
  QUOTATIONS: 'anfer_quotations',
  CUSTOMERS: 'anfer_customers',
  PRODUCTS: 'anfer_products',
  SETTINGS: 'anfer_settings'
};

// Serviço para gerenciar orçamentos no localStorage
export const quotationService = {
  getAll: (): Quotation[] => {
    const data = localStorage.getItem(KEYS.QUOTATIONS);
    return data ? JSON.parse(data) : [];
  },
  
  getById: (id: string): Quotation | undefined => {
    const quotations = quotationService.getAll();
    return quotations.find(q => q.id === id);
  },
  
  save: (quotation: Quotation): void => {
    const quotations = quotationService.getAll();
    const index = quotations.findIndex(q => q.id === quotation.id);
    
    if (index >= 0) {
      quotations[index] = quotation;
    } else {
      quotations.push(quotation);
    }
    
    localStorage.setItem(KEYS.QUOTATIONS, JSON.stringify(quotations));
  },
  
  delete: (id: string): void => {
    const quotations = quotationService.getAll().filter(q => q.id !== id);
    localStorage.setItem(KEYS.QUOTATIONS, JSON.stringify(quotations));
  },
  
  getNextNumber: (): string => {
    const quotations = quotationService.getAll();
    
    if (quotations.length === 0) {
      return '0186'; // Começar do 0185 em vez de 0001
    }
    
    // Encontra o maior número e incrementa
    const maxNumber = Math.max(...quotations.map(q => parseInt(q.number)));
    return (maxNumber + 1).toString().padStart(4, '0');
  }
};

// Serviço para gerenciar clientes no localStorage
export const customerService = {
  getAll: (): Customer[] => {
    const data = localStorage.getItem(KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },
  
  getById: (id: string): Customer | undefined => {
    const customers = customerService.getAll();
    return customers.find(c => c.id === id);
  },
  
  save: (customer: Customer): void => {
    const customers = customerService.getAll();
    const index = customers.findIndex(c => c.id === customer.id);
    
    if (index >= 0) {
      customers[index] = customer;
    } else {
      customers.push(customer);
    }
    
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  },
  
  delete: (id: string): void => {
    const customers = customerService.getAll().filter(c => c.id !== id);
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  }
};

// Serviço para gerenciar produtos no localStorage
export const productService = {
  getAll: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
  
  getById: (id: string): Product | undefined => {
    const products = productService.getAll();
    return products.find(p => p.id === id);
  },
  
  save: (product: Product): void => {
    const products = productService.getAll();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },
  
  delete: (id: string): void => {
    const products = productService.getAll().filter(p => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  }
};

// Serviço para gerenciar configurações no localStorage
export const settingsService = {
  get: () => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      companyName: 'ANFER ESQUADRIAS',
      address: 'Rua Rio Meriti, 120 - São Miguel - pta. São Paulo',
      contact: '(11) 94009-3757',
      email: 'anfer.esquadrias@gmail.com',
      website: 'anfer-website.vercel.app',
      paymentInfo: {
        name: 'Antonio Marcos da Silva Santos',
        agency: '0001',
        account: '21227529-1',
        pix: '46.332.306/0001-46'
      }
    };
  },
  
  save: (settings: any): void => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
};

// Função para carregar dados iniciais se o localStorage estiver vazio
export const initializeData = () => {
  // Verificar se já existem dados
  if (!localStorage.getItem(KEYS.QUOTATIONS)) {
    localStorage.setItem(KEYS.QUOTATIONS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(KEYS.CUSTOMERS)) {
    // Adicionar alguns clientes de exemplo
    const sampleCustomers: Customer[] = [
      {
        id: '1',
        name: 'PANTERA LOG',
        address: 'Rua Heitor Bariani, 239 - Tatuapé',
        contact: '3213-5687',
        email: 'panteralog@panteralog.com.br'
      }
    ];
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(sampleCustomers));
  }
  
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    // Adicionar alguns produtos de exemplo
    const sampleProducts: Product[] = [
      {
        id: '1',
        description: 'CONTROLES DE 4 BOTÕES (CLONE)',
        defaultPrice: 90,
        category: 'CONTROLES CLONES DE PORTA DE AÇO'
      },
      {
        id: '2',
        description: 'CONTROLE PPA',
        defaultPrice: 50,
        category: 'ADIÇÃO DE CONTROLE PPA'
      },
      {
        id: '3',
        description: 'SERVIÇO DE REPROGRAMAÇÃO DE PLACAS ELETRÔNICAS DE PORTÃO',
        defaultPrice: 20,
        category: 'REPROGRAMAÇÃO DE PORTÕES'
      }
      
    ];
    
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(sampleProducts));
  }
  
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    settingsService.save(settingsService.get());
  }
    // Verificar o contador de orçamentos
    const quotations = quotationService.getAll();
    if (quotations.length === 0) {
      // Se não existirem orçamentos, defina o próximo número como 0185
      localStorage.setItem('anfer_next_quotation_number', '0185');
    }
};