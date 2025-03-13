// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
        <div className="mb-2">
          <span className="font-medium">ANFER ESQUADRIAS</span> © {year} - Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;