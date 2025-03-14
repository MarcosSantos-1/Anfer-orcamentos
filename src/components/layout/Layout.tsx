// src/components/layout/Layout.tsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Incluindo o Sidebar diretamente (ele já está posicionado fixo) */}
      {showSidebar && <Sidebar />}
      
      {/* Conteúdo principal com padding para acomodar o header e sidebar */}
      <main className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''} mt-[66px]`}>
        <div className={`pt-6 ${showSidebar ? 'lg:px-20' : 'px-4'} pb-10`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;