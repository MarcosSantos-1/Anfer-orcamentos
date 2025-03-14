// src/components/quotation/QuotationPDF.tsx
import React from 'react';
import { Quotation } from '../../models/Quotation';
import { formatCurrency, formatDate } from '../../utils/formatters';
import logoImg from '../../assets/images/logo.png';
import waveImg from '../../assets/images/wave.png';

// Este componente representa a visualização do PDF
const QuotationPDF: React.FC<{ quotation: Quotation }> = ({ quotation }) => {
  return (
    <div className="bg-white p-0 max-w-4xl mx-auto print-content">
      {/* Cabeçalho com fundo preto e onda */}
      <div className="relative">
        <div className="bg-zinc-900 text-white p-8 pb-10">
          <div className="flex justify-between items-start">
            {/* Logo e nome da empresa */}
            <div className="flex items-center flex-col">
              <img src={logoImg} alt="ANFER" className="w-36 h-36 mr-4" />
              <div>
                <h1 className="text-2xl font-bold mt-2">ANFER <span className="font-normal">ESQUADRIAS</span></h1>
              </div>
            </div>
            
            {/* Informações de contato */}
            <div className="text-center space-y-4">
              <div className="mb-4">
                <p className="text-yellow-500 font-semibold">Contato</p>
                <p className="text-sm">(11) 94009-3757</p>
              </div>
              <div className="mb-4">
                <p className="text-yellow-500 font-semibold">e-Mail</p>
                <p className="text-sm">oficial.anferesquadrias@gmail.com</p>
              </div>
            </div>
            
            {/* Endereço e website */}
            <div className="text-right">
              <div className="mb-4">
                <p className="text-yellow-500 font-semibold">Endereço:</p>
                <p className="text-sm">Rua Rio Meriti, 120 - São Miguel -</p>
                <p className="text-sm">pta. São Paulo</p>
              </div>
              <div>
                <p className="text-yellow-500 font-semibold">Web:</p>
                <p className="text-sm">anfer-website.vercel.app</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Imagem ondulada */}
        <div className="absolute -bottom-1 left-0 right-0">
          <img src={waveImg} alt="" className="w-full" />
        </div>
      </div>
      
      {/* Informações do cliente e orçamento */}
      <div className="p-8 flex justify-between">
        {/* Dados do cliente */}
        <div>
          <p className="font-bold mb-1">Para:</p>
          <h2 className="text-xl font-bold uppercase mb-2">{quotation.customer.name}</h2>
          <p>{quotation.customer.address}</p>
          <p><span className="font-semibold">Contato:</span> {quotation.customer.contact}</p>
          <p><span className="font-semibold">E-Mail:</span> {quotation.customer.email}</p>
        </div>
        
        {/* Número e data do orçamento */}
        <div className="text-right">
          <h1 className="text-4xl font-bold mb-8">ORÇAMENTO</h1>
          <p><span className="font-semibold">Pedido nº:</span> {quotation.number}</p>
          <p><span className="font-semibold">Data:</span> {formatDate(quotation.date)}</p>
        </div>
      </div>
      
      {/* Tabela de Itens */}
      <div className="px-8">
        {/* Cabeçalho da tabela */}
        <div className="grid grid-cols-12 text-white">
          <div className="col-span-8 bg-red-700 py-4 px-6 rounded-tl-lg">
            <h3 className="font-bold uppercase">Descrição</h3>
          </div>
          <div className="col-span-2 bg-gray-900 py-4 px-6 text-center">
            <h3 className="font-bold uppercase">QTD</h3>
          </div>
          <div className="col-span-2 bg-gray-900 py-4 px-6 text-right rounded-tr-lg">
            <h3 className="font-bold uppercase">Total</h3>
          </div>
        </div>
        
        {/* Corpo da tabela */}
        {quotation.items.map((item, index) => {
          // Agrupar itens por categoria
          const parts = item.description.split(' - ');
          const isCategory = parts.length > 1;
          const mainDesc = isCategory ? parts[0] : item.description;
          const subDesc = isCategory ? parts.slice(1).join(' - ') : '';
          
          // Verifica se é um novo grupo
          const previousItem = index > 0 ? quotation.items[index - 1] : null;
          const previousParts = previousItem ? previousItem.description.split(' - ') : [''];
          const previousCategory = previousParts.length > 1 ? previousParts[0] : '';
          const isNewCategory = mainDesc !== previousCategory && isCategory;
          
          return (
            <React.Fragment key={item.id}>
              {isNewCategory && (
                <div className="grid grid-cols-12 border-b">
                  <div className="col-span-12 bg-white py-3 px-6 font-bold uppercase">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm">{item.description}</div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-12 border-b">
                <div className="col-span-8 py-4 px-6">
                  {isCategory ? (
                    <span className="pl-4">{subDesc}</span>
                  ) : (
                    mainDesc
                  )}
                </div>
                <div className="col-span-2 py-4 px-6 text-center">
                  {item.quantity}
                </div>
                <div className="col-span-2 py-4 px-6 text-right font-semibold">
                  {/*R${item.total.toFixed(2)}*/}
                  {formatCurrency(item.total)}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Resumo financeiro */}
<div className='flex w-full '>
      <div className="px-8 mt-6 mb-8 w-1/2">
        <div className="flex justify-between items-center">
          {/* Dados de pagamento */}
          <div className="w-full">
            <h3 className="font-bold text-lg uppercase mb-2">Dados para pagamento</h3>
            <p>{quotation.paymentInfo.name}</p>
            <p><span className="font-semibold">Agência:</span> {quotation.paymentInfo.agency}</p>
            <p><span className="font-semibold">CC:</span> {quotation.paymentInfo.account}</p>
            <p><span className="font-semibold">PIX (CNPJ):</span> {quotation.paymentInfo.pix}</p>
          </div>
          
          {/* Total Geral */}

        </div>
      </div>

      <div className="px-8 mt-4 w-1/2 flex-col">
        <div className="flex justify-end">
          <div className="w-full">
            <div className="flex justify-between py-2">
              <span>Sub Total</span>
              <span className="font-bold"> {formatCurrency(quotation.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Taxas {quotation.taxRate}%</span>
              <span> {formatCurrency(quotation.taxes)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Frete</span>
              <span>{quotation.shipping}</span>
            </div>
          </div>
        </div>
        <div className="bg-red-700 text-white p-4 w-ful flex justify-between">
            <span className="font-bold text-lg uppercase">Total Geral</span>
            <span className="font-bold text-lg">{formatCurrency(quotation.total)}</span>
          </div>  
      </div>

</div>
      
      {/* Assinatura */}
     {/* <div className="px-8 mt-6 text-center">
        <p className="font-bold">{quotation.paymentInfo.name}</p>
        <p>Fabricante</p>
        <p>Orçamentista</p>
      </div>*/}
    </div>
  );
};

export default QuotationPDF;