// src/components/ui/Modal.tsx
import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiUser, FiFileText } from 'react-icons/fi'; // Substituí FiLock por FiFileText para descrição

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'; // Adicionei '3xl'
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'xl', // Mudei o padrão de 'lg' para 'xl'
  footer,
  closeOnOverlayClick = true,
}) => {
  const cancelButtonRef = useRef(null);

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl', // Novo tamanho mais largo
    full: 'sm:max-w-full sm:w-full',
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-20 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-80 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            ​
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`
                inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl 
                transform transition-all sm:my-10 sm:align-middle ${sizeClasses[size]} w-full
                border border-gray-200
              `}
            >
              <div className="bg-white px-6 pt-6 pb-5 sm:p-8">
                <div className="flex justify-between items-center">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="
                      bg-white rounded-full p-1 text-gray-500 hover:text-gray-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-200
                      transition-colors duration-150
                    "
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <FiX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-6">{children}</div>
              </div>
              {footer && (
                <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse">
                  {footer}
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;

// Exemplo de uso com inputs e textarea
export const ExampleModalUsage: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Criar Novo Item"
        size="3xl" // Tamanho mais largo
        footer={
          <>
            <button
              type="button"
              className="
                w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl
                hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200
                transition-all duration-200
              "
              onClick={() => setIsOpen(false)}
            >
              Salvar
            </button>
            <button
              type="button"
              className="
                w-full sm:w-auto px-6 py-2.5 mt-3 sm:mt-0 sm:mr-4 text-gray-700 font-medium rounded-xl
                bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200
                transition-all duration-200
              "
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <FiUser className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Nome do Item"
              className="
                block w-full rounded-xl border-2 bg-white/50
                px-4 py-3 pl-10 text-gray-900 
                ring-1 ring-transparent
                transition-all duration-200 ease-in-out
                focus:border-blue-500 focus:ring-4 focus:ring-blue-200
              "
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-5 text-gray-500">
              <FiFileText className="w-5 h-5" />
            </span>
            <textarea
              placeholder="Descrição"
              rows={4} // Altura inicial de 4 linhas
              className="
                block w-full rounded-xl border-2 bg-white/50
                px-4 py-3 pl-10 text-gray-900 
                ring-1 ring-transparent
                transition-all duration-200 ease-in-out
                focus:border-blue-500 focus:ring-4 focus:ring-blue-200
                resize-y
              "
            />
          </div>
        </div>
      </Modal>
    </>
  );
};