// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Quotation } from '../models/Quotation';
import { Customer } from '../models/Customer';
import { Product } from '../models/Product';

const firebaseConfig = {
  apiKey: "AIzaSyApVSMqePEFu5I21Jd4n7863_D6pAwHd3Y",
  authDomain: "anfer-orcamentos.firebaseapp.com",
  projectId: "anfer-orcamentos",
  storageBucket: "anfer-orcamentos.firebasestorage.app",
  messagingSenderId: "886737931792",
  appId: "1:886737931792:web:11759cb665b7a757f24495"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

  // Definir coleções
  const COLLECTIONS = {
  QUOTATIONS: 'quotations',
  CUSTOMERS: 'customers',
  PRODUCTS: 'products',
  SETTINGS: 'settings'
};

// Serviço para gerenciar orçamentos no Firestore
export const firebaseQuotationService = {
  getAll: async (): Promise<Quotation[]> => {
    try {
      const q = query(collection(db, COLLECTIONS.QUOTATIONS), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Converter Timestamp para string de data
        return {
          ...data,
          id: doc.id,
          date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date
        } as Quotation;
      });
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Quotation | undefined> => {
    try {
      const docRef = doc(db, COLLECTIONS.QUOTATIONS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          date: data.date instanceof Timestamp ? data.date.toDate().toISOString().split('T')[0] : data.date
        } as Quotation;
      }
      return undefined;
    } catch (error) {
      console.error('Erro ao buscar orçamento:', error);
      return undefined;
    }
  },
  
  save: async (quotation: Quotation): Promise<void> => {
    try {
      const quotationData = {
        ...quotation,
        updatedAt: serverTimestamp()
      };
      
      // Remover o campo id antes de salvar
      const { id, ...dataToSave } = quotationData;
      
      await setDoc(doc(db, COLLECTIONS.QUOTATIONS, id), dataToSave);
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.QUOTATIONS, id));
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      throw error;
    }
  },
  
  getNextNumber: async (): Promise<string> => {
    try {
      const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'quotation_counter');
      const settingsSnap = await getDoc(settingsRef);
      
      let nextNumber = 186; // Começar do 0186 se não existir
      
      if (settingsSnap.exists()) {
        nextNumber = settingsSnap.data().nextNumber;
      }
      
      // Atualizar o contador
      await setDoc(settingsRef, { nextNumber: nextNumber + 1 });
      
      return nextNumber.toString().padStart(4, '0');
    } catch (error) {
      console.error('Erro ao gerar próximo número:', error);
      return (Math.floor(Math.random() * 9000) + 1000).toString();
    }
  }
};

// Serviço para gerenciar clientes no Firestore
export const firebaseCustomerService = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const q = query(collection(db, COLLECTIONS.CUSTOMERS), orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as Customer));
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Customer | undefined> => {
    try {
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        } as Customer;
      }
      return undefined;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return undefined;
    }
  },
  
  save: async (customer: Customer): Promise<void> => {
    try {
      const customerData = {
        ...customer,
        updatedAt: serverTimestamp()
      };
      
      // Remover o campo id antes de salvar
      const { id, ...dataToSave } = customerData;
      
      await setDoc(doc(db, COLLECTIONS.CUSTOMERS, id), dataToSave);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CUSTOMERS, id));
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }
};

// Serviço para gerenciar produtos no Firestore
export const firebaseProductService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCTS));
      const querySnapshot = await getDocs(q);
      
      const products = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as Product));
      
      console.log('Produtos recuperados do Firebase:', products);
      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Product | undefined> => {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        } as Product;
      }
      return undefined;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return undefined;
    }
  },
  
  save: async (product: Product): Promise<void> => {
    try {
      const productData = {
        ...product,
        updatedAt: serverTimestamp()
      };
      
      // Remover o campo id antes de salvar
      const { id, ...dataToSave } = productData;
      
      await setDoc(doc(db, COLLECTIONS.PRODUCTS, id), dataToSave);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      throw error;
    }
  }
};

// Serviço para gerenciar configurações no Firestore
export const firebaseSettingsService = {
  get: async (): Promise<any> => {
    try {
      const docRef = doc(db, COLLECTIONS.SETTINGS, 'app_settings');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      
      // Retornar valores padrão se não existir
      const defaultSettings = {
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
      
      // Salvar configurações padrão
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'app_settings'), defaultSettings);
      
      return defaultSettings;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return {};
    }
  },
  
  save: async (settings: any): Promise<void> => {
    try {
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'app_settings'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw error;
    }
  }
};

// Função para migrar dados do localStorage para o Firebase
export const migrateLocalStorageToFirebase = async (): Promise<void> => {
  try {
    // Migrar orçamentos
    const quotations = JSON.parse(localStorage.getItem('anfer_quotations') || '[]');
    for (const quotation of quotations) {
      await firebaseQuotationService.save(quotation);
    }
    
    // Migrar clientes
    const customers = JSON.parse(localStorage.getItem('anfer_customers') || '[]');
    for (const customer of customers) {
      await firebaseCustomerService.save(customer);
    }
    
    // Migrar produtos
    const products = JSON.parse(localStorage.getItem('anfer_products') || '[]');
    for (const product of products) {
      await firebaseProductService.save(product);
    }
    
    // Migrar configurações
    const settings = JSON.parse(localStorage.getItem('anfer_settings') || '{}');
    if (Object.keys(settings).length > 0) {
      await firebaseSettingsService.save(settings);
    }
    
    console.log('Migração concluída com sucesso!');
    
    // Opcionalmente, limpar localStorage após migração bem-sucedida
    // localStorage.clear();
  } catch (error) {
    console.error('Erro durante a migração:', error);
    throw error;
  }
};

// Inicialização do Firebase
export const initializeFirebase = async (): Promise<void> => {
  try {
    // Verificar se há dados no Firestore
    const customers = await firebaseCustomerService.getAll();
    const products = await firebaseProductService.getAll();
    
    // Se não houver dados, criar dados de exemplo
    if (customers.length === 0) {
      const sampleCustomers: Customer[] = [
        {
          id: '1',
          name: 'PANTERA LOG',
          address: 'Rua Heitor Bariani, 239 - Tatuapé',
          contact: '3213-5687',
          email: 'panteralog@panteralog.com.br'
        }
      ];
      
      for (const customer of sampleCustomers) {
        await firebaseCustomerService.save(customer);
      }
    }
    
    if (products.length === 0) {
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
      
      for (const product of sampleProducts) {
        await firebaseProductService.save(product);
      }
    }
    
    // Verificar e inicializar configurações
    await firebaseSettingsService.get();
    
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
  }
};