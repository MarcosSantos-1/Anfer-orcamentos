// src/services/pdf.ts
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Quotation } from '../models/Quotation';
import { formatCurrency, formatDate } from '../utils/formatters';
import logoImg from '../assets/images/logo.png'; // Importe as imagens diretamente
import waveImg from '../assets/images/wave.png';

// Função para gerar o PDF a partir do orçamento
export const generatePDF = async (quotation: Quotation, shouldPrint: boolean = false) => {
  try {
    // Adicionar a fonte Poppins ao documento
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    // Aguardar um pouco para garantir que as fontes foram carregadas
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Criar o elemento com o conteúdo do orçamento
    const element = document.createElement('div');
    element.innerHTML = generateHTML(quotation);
    document.body.appendChild(element);
    
    // Configurar o elemento para ficar visível mas fora da tela
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '0';
    element.style.width = '794px'; // Tamanho A4 em pixels (aproximadamente)
    element.style.fontFamily = "'Poppins', sans-serif";
    
    // Usar html2canvas com as opções corretas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    // Remover o elemento temporário
    document.body.removeChild(element);
    document.head.removeChild(fontLink);
    
    // Criar o PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Adicionar a imagem do canvas ao PDF
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // Definir o nome do arquivo
    const fileName = `Orcamento-${quotation.number}-${quotation.customer.name.replace(/\s+/g, '-')}.pdf`;
    
    if (shouldPrint) {
      // Abrir o PDF em uma nova janela para impressão
      pdf.output('dataurlnewwindow');
    } else {
      // Fazer o download do PDF
      pdf.save(fileName);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return false;
  }
};

// Função para gerar HTML para o PDF
const generateHTML = (quotation: Quotation): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Orçamento ${quotation.number}</title>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .wave-img {
          position: absolute;
          z-index: -2; 
          left: 0;
          width: 100%;
        }
        
        .header-content {
          padding: 15px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .logo-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-left: 50px;
        }
        
        .logo {
          position: absolute;
          left: 30;
          width: 230px;
          height: 230px;
          object-fit: cover;

        }
        
        .company-name {
          margin-top: 140px;
          font-size: 20px;
          font-weight: bold;
          color: #fff;

        }
        
        .company-name span {
          font-weight: normal;
          color: #fff;
        }
        
        .contact-info {
          text-align: left;
          font-size: 14px;
          color: #fff;
          margin-right: 5px;

        }
        
        .contact-label {
          color: #f3c950;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .client-section {
          margin: 10px 0 0 5px;
          display: flex;
          justify-content: space-between;
          padding: 30px;
        }
        
        .client-info h2 {
          font-weight: bold;
          margin: 3px 0;
          text-transform: uppercase;
        }
        
        .order-info {
          text-align: right;
        }
        
        .order-info h1 {
          font-size: 32px;
          margin-bottom: 30px;
        }
        .invoice-table{
          border-bottom-right-radius: 6px;
          border-bottom-left-radius: 6px;
          border: 1px solid #e5e7eb;
          margin: 0 30px
        }

        .table-header {
          display: flex;
          width: 100%;
        }
        
        .desc-header {
          background-color: #b91c1c;
          color: white;
          padding: 15px 20px;
          width: 66.66%;
          font-weight: bold;
          text-transform: uppercase;
          border-top-left-radius: 6px;
        }
        
        .qty-header, .total-header {
          background-color: #1a1a1a;
          color: white;
          padding: 15px 20px;
          width: 16.66%;
          font-weight: bold;
          text-transform: uppercase;
          text-align: center;
        }
        
        .total-header {
          text-align: right;
          border-top-right-radius: 6px;
        }
        
        .item-row {
          display: flex;
          width: 100%;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .category-row {
          width: 100%;
          padding: 10px 20px;
          font-weight: bold;
          text-transform: uppercase;
          background-color: #f9fafb;
        }
        
        .item-desc {
          padding: 15px 20px;
          width: 66.66%;
          font-size: 13px;
        }
        
        .item-qty {
          padding: 15px 20px;
          width: 16.66%;
          text-align: center;
          font-size: 13px;

        }
        
        .item-total {
          padding: 15px 20px;
          width: 16.66%;
          text-align: right;
          font-weight: 600;
          font-size: 13px;
        }

        .payment-section {
          margin-top: 30px;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
        }
        
        .payment-info {
          width: 50%;
        }
             
        .payment-info h3 {
          text-transform: uppercase;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .payment-info-text{
          font-size: 12px;
        }

        .summary-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 0 10px;
          width: 50%;
          gap: 20px;
        }

        .summary-row {
          display: flex;
          padding: 3px 5px;
          gap: 30px;
        }
        
        .grand-total {
          margin: 10px, 35px;
          width: 85%;
          background-color: #b91c1c;
          color: white;
          height: 70px;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 0 0 8px 8px;        
}
        
        .grand-total-label {
          font-weight: bold;
          text-transform: uppercase;
          font-size: 18px;
        }
        
        .grand-total-value {
          font-weight: bold;
          font-size: 18px;
        }
        
        .signature {
          margin-top: 40px;
          text-align: center;
        }
      </style>
    </head>
    <body>
     <img src="${waveImg}" class="wave-img" alt="">
      <div class="header">
        <div class="header-content">
          <div class="logo-container">
            <img src="${logoImg}" class="logo" alt="ANFER">
            <div class="company-name">ANFER <span>ESQUADRIAS</span></div>
          </div>
          
          <div class="contact-info">
            <div class="contact-label">Contato</div>
            <div>(11) 94009-3757</div>
            <div class="contact-label" style="margin-top: 15px;">e-Mail</div>
            <div>anfer.esquadrias@gmail.com</div>
          </div>
          
          <div class="contact-info">
            <div class="contact-label">Endereço:</div>
            <div>Rua Rio Meriti, 120 - São Miguel -</div>
            <div>pta. São Paulo</div>
            <div class="contact-label" style="margin-top: 15px;">Web:</div>
            <div>anfer-website.vercel.app</div>
          </div>
        </div>
      </div>
      
      <div class="client-section">
        <div class="client-info">
          <div>Para:</div>
          <h2>${quotation.customer.name}</h2>
          <div>${quotation.customer.address}</div>
          <div><strong>Contato:</strong> ${quotation.customer.contact}</div>
          <div><strong>E-Mail:</strong> ${quotation.customer.email}</div>
        </div>
        
        <div class="order-info">
          <h1>ORÇAMENTO</h1>
          <div><strong>Pedido nº:</strong> ${quotation.number}</div>
          <div><strong>Data:</strong> ${formatDate(quotation.date)}</div>
        </div>
      </div>
      
      <div class="invoice-table" ">
        <div class="table-header">
          <div class="desc-header">Descrição</div>
          <div class="qty-header">QTD</div>
          <div class="total-header">TOTAL</div>
        </div>
        
        ${generateItemsHTML(quotation)}
      </div>
      
      <div class="payment-section">
        <div class="payment-info">
          <h3>Dados para pagamento</h3>
            <div class="payment-info-text">
              <div>${quotation.paymentInfo.name}</div>
              <div><strong>Agência:</strong> ${quotation.paymentInfo.agency}</div>
              <div><strong>CC:</strong> ${quotation.paymentInfo.account}</div>
              <div><strong>PIX (CNPJ):</strong> ${quotation.paymentInfo.pix}</div>
            </div>
        </div>

        <div class="summary-section">
          <div class="summary-content">
            <div class="summary-row">
              <div>Sub Total:</div>
              <div><strong>${formatCurrency(quotation.subtotal)}</strong></div>
            </div>
            <div class="summary-row">
              <div>Taxas: ${quotation.taxRate} %</div>
              <div> <strong> ${formatCurrency(quotation.taxes)}</strong></div>
            </div>
            <div class="summary-row">
              <div>Frete?</div>
              <div><strong>${quotation.shipping}</strong></div>
            </div>
          </div>
          <div class="grand-total">
            <div class="grand-total-label">Total Geral: </div>
            <div class="grand-total-value"> ${formatCurrency(quotation.total)}</div>
        </div>
        </div>
        
      </div>

      <div class="footer-section">

      </div>

    </body>
    </html>
  `;
};

// Função auxiliar para gerar o HTML dos itens
const generateItemsHTML = (quotation: Quotation): string => {
  let currentCategory = '';
  let html = '';

  quotation.items.forEach((item) => {
    // Verifica se há uma categoria no início da descrição (formato: "CATEGORIA - descrição")
    const parts = item.description.split(' - ');
    const category = parts.length > 1 ? parts[0] : '';
    const description = parts.length > 1 ? parts.slice(1).join(' - ') : item.description;

    // Se for uma nova categoria, adiciona uma linha de categoria
    if (category && category !== currentCategory) {
      currentCategory = category;
      html += `
        <div class="category-row">
          ${category}
        </div>
      `;
    }

    // Adiciona o item
    html += `
      <div class="item-row">
        <div class="item-desc">
          <div class="font-semibold">${item.title}</div>
          <div>${item.description}</div>
        </div>
        <div class="item-qty">${item.quantity}</div>
        <div class="item-total">${formatCurrency(item.total)}</div>
      </div>
    `;
  });

  return html;
};