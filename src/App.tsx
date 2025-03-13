// src/App.tsx
import React, { useEffect } from 'react';
import Router from './Router';
import { useQuotation } from './context/QuotationContext';
import LoadingScreen from './components/ui/LoadingScreen';


const App: React.FC = () => {
  const { customers, loading, error } = useQuotation();

  // Log inicial para verificar se os dados estão sendo carregados corretamente
  useEffect(() => {
    console.log('App iniciado com sucesso!');
    if (!loading) {
      console.log(`${customers.length} clientes carregados.`);
    }
  }, [customers.length, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Erro</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors"
            onClick={() => window.location.reload()}
          >
            Recarregar aplicativo
          </button>
        </div>
      </div>
    );
  }

  return <Router />;
};

export default App;