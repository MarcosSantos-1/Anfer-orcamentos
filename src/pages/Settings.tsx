// src/pages/Settings.tsx
import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useQuotation } from '../context/QuotationContext';
import MigrationTool from '../components/MigrationTool'; // Adicionar essa linha


const Settings: React.FC = () => {
  const { settings, saveSettings } = useQuotation();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Lidar com campos aninhados (ex: paymentInfo.name)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((currentFormData: { [x: string]: any; }) => ({
        ...currentFormData,
        [parent]: {
          ...(currentFormData[parent as keyof typeof currentFormData] || {}),
          [child]: value
        }
      }));
    } else {
      setFormData((currentFormData: any) => ({ 
        ...currentFormData, 
        [name]: value 
      }));
    }
    
    setIsSaved(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(formData);
    setIsSaved(true);
    
    // Reset saved message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };
  
  return (
     <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
       
        <MigrationTool />

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4">Informações da Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Nome da Empresa"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
              />
              
              <Input
                label="Endereço"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
              />
              
              <Input
                label="Telefone / Contato"
                name="contact"
                value={formData.contact || ''}
                onChange={handleChange}
              />
              
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
              
              <Input
                label="Website"
                name="website"
                value={formData.website || ''}
                onChange={handleChange}
              />
            </div>
            <hr className='text-zinc-300 h-2 '/>
            <h2 className="text-xl font-semibold mb-4 mt-7">Informações de Pagamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Nome Completo"
                name="paymentInfo.name"
                value={formData.paymentInfo?.name || ''}
                onChange={handleChange}
              />
              
              <Input
                label="Agência"
                name="paymentInfo.agency"
                value={formData.paymentInfo?.agency || ''}
                onChange={handleChange}
              />
              
              <Input
                label="Conta Corrente"
                name="paymentInfo.account"
                value={formData.paymentInfo?.account || ''}
                onChange={handleChange}
              />
              
              <Input
                label="PIX (CNPJ)"
                name="paymentInfo.pix"
                value={formData.paymentInfo?.pix || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex justify-end">
              {isSaved && (
                <div className="text-green-600 mr-4 flex items-center">
                  Configurações salvas com sucesso!
                </div>
              )}
              
              <Button
                type="submit"
                leftIcon={<FiSave />}
              >
                Salvar Configurações
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;