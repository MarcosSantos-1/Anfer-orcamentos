// src/utils/formatters.ts

/**
 * Formata uma data do formato ISO (YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY)
 */
export const formatDate = (isoDate: string): string => {
  if (!isoDate) return '';
  
  try {
    // Cria uma data ajustando para a timezone local
    const [year, month, day] = isoDate.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return isoDate;
  }
};
  
  /**
   * Formata um valor numérico para o formato de moeda brasileira
   */
  export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  /**
   * Formata um número de telefone adicionando máscara
   * Ex: 11999887766 -> (11) 99988-7766
   */
  export const formatPhone = (phone: string): string => {
    if (!phone) return '';
    
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    
    if (numbers.length <= 8) {
      // Formato: XXXX-XXXX
      return numbers.replace(/(\d{4})(\d{0,4})/, '$1-$2');
    } else if (numbers.length <= 10) {
      // Formato: (XX) XXXX-XXXX (telefone fixo)
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      // Formato: (XX) XXXXX-XXXX (celular)
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };
  
  /**
   * Formata um CNPJ adicionando máscara
   * Ex: 12345678000199 -> 12.345.678/0001-99
   */
  export const formatCNPJ = (cnpj: string): string => {
    if (!cnpj) return '';
    
    // Remove todos os caracteres não numéricos
    const numbers = cnpj.replace(/\D/g, '');
    
    return numbers.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  };
  
  /**
   * Gera um código único para o orçamento com base na data atual
   */
  export const generateQuotationNumber = (): string => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2); // Últimos 2 dígitos do ano
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Gerar um número aleatório de 4 dígitos
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `${year}${month}${random}`;
  };
  
  /**
   * Valida um endereço de e-mail
   */
  export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  /**
   * Valida um número de telefone (aceita com ou sem formatação)
   */
  export const isValidPhone = (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length >= 8 && numbers.length <= 11;
  };
  
  /**
   * Valida um CNPJ (aceita com ou sem formatação)
   */
  export const isValidCNPJ = (cnpj: string): boolean => {
    const numbers = cnpj.replace(/\D/g, '');
    
    if (numbers.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais (CNPJ inválido)
    if (/^(\d)\1+$/.test(numbers)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    let weight = 5;
    
    // Cálculo do primeiro dígito verificador
    for (let i = 0; i < 12; i++) {
      sum += parseInt(numbers.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(numbers.charAt(12)) !== firstDigit) return false;
    
    // Cálculo do segundo dígito verificador
    sum = 0;
    weight = 6;
    
    for (let i = 0; i < 13; i++) {
      sum += parseInt(numbers.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(numbers.charAt(13)) === secondDigit;
  };