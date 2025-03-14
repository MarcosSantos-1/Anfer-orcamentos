// src/components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiUsers, FiPackage, FiSettings } from 'react-icons/fi';

const Header: React.FC = () => {
  return (
    <header className="bg-zinc-900 text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center h-12">
          <h1 className="text-xl font-bold">GERENCIADOR DE ORÇAMENTOS</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="flex items-center hover:text-red-400 transition-colors">
            <FiFileText className="mr-1" /> Orçamentos
          </Link>
          <Link to="/customers" className="flex items-center hover:text-red-400 transition-colors">
            <FiUsers className="mr-1" /> Clientes
          </Link>
          <Link to="/products" className="flex items-center hover:text-red-400 transition-colors">
            <FiPackage className="mr-1" /> Produtos
          </Link>
          <Link to="/settings" className="flex items-center hover:text-red-400 transition-colors">
            <FiSettings className="mr-1" /> Configurações
          </Link>
        </nav>
        
        <div className="md:hidden">
          {/* Menu para mobile (implementação futura) */}
          <button className="text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;