// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

import { 
  FiHome, 
  FiPlus, 
  FiList, 
  FiUsers, 
  FiPackage, 
  FiSettings 
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-zinc-800 text-white w-64 min-h-screen p-4 rounded-tr-2xl rounded-br-2xl hidden lg:block">
      <div className="flex items-center  mb-8 pt-2">
        <div className=" rounded-full w-16 h-16 flex items-center justify-center mr-3">
          <img className='object-cover items-center justify-center' src="/logo.png" alt="Logo" />
        </div>
        <h1 className="text-2xl font-bold">ANFER</h1>
      </div>
      
      <nav className="space-y-1">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }`
          }
        >
          <FiHome />
          <span>Página Principal  </span>
        </NavLink>
        
        <div className="py-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
            Orçamentos
          </h2>
          
          <NavLink 
            to="/quotations/new" 
            className={({ isActive }) => 
              `flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FiPlus />
            <span>Novo Orçamento</span>
          </NavLink>
          
          <NavLink 
            to="/quotations" 
            className={({ isActive }) => 
              `flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FiList />
            <span>Listar Todos</span>
          </NavLink>
        </div>
        
        <div className="py-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
            Cadastros
          </h2>
          
          <NavLink 
            to="/customers" 
            className={({ isActive }) => 
              `flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FiUsers />
            <span>Clientes</span>
          </NavLink>
          
          <NavLink 
            to="/products" 
            className={({ isActive }) => 
              `flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FiPackage />
            <span>Produtos</span>
          </NavLink>
        </div>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <FiSettings />
          <span>Configurações</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;