// src/components/MigrationTool.tsx
import React, { useState } from 'react';
import { FiDownload, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import Button from './ui/Button';
import { useQuotation } from '../context/QuotationContext';

const MigrationTool: React.FC = () => {
  const { migrateData } = useQuotation();
  const [isMigrating, setIsMigrating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      setSuccess(false);
      setError(null);
      
      await migrateData();
      
      setSuccess(true);
      setIsMigrating(false);
    } catch (err) {
      console.error('Erro na migração:', err);
      setError('Ocorreu um erro durante a migração. Verifique o console para mais detalhes.');
      setIsMigrating(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Ferramenta de Migração</h2>
      <p className="mb-4 text-gray-600">
        Use esta ferramenta para migrar seus dados do armazenamento local (localStorage) para o Firebase.
        Isso garantirá que seus dados sejam preservados e acessíveis em qualquer dispositivo.
      </p>
      
      <div className="flex items-center">
        {!success && !error && (
          <Button
            onClick={handleMigration}
            leftIcon={<FiDownload />}
            isLoading={isMigrating}
            disabled={isMigrating}
          >
            {isMigrating ? 'Migrando dados...' : 'Migrar dados para Firebase'}
          </Button>
        )}
        
        {success && (
          <div className="flex items-center text-green-600">
            <FiCheck className="mr-2" />
            <span>Migração concluída com sucesso!</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center text-red-600">
            <FiAlertTriangle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MigrationTool;