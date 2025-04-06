import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  type?: 'standard' | 'popup';
  zIndex?: number;
}

export function Modal({ isOpen, onClose, title, children, zIndex, type = 'standard' }: ModalProps) {

  const isModal = type === 'standard';
  const isPopup = type === 'popup';
  const calculatedZIndex = zIndex || (isPopup ? 50 : 30);

  console.log(calculatedZIndex);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
      <div className={`fixed inset-0 z-${calculatedZIndex} overflow-y-auto`}>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity cursor-default"
        onClick={onClose}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
      />

      <div className={`flex min-h-full ${isModal ? 'items-stretch sm:items-center' : 'items-center'} justify-center p-0 sm:p-4`}>
        <div className={`relative bg-white shadow-xl ${isModal ? 'w-full min-h-screen sm:min-h-0' : ''} sm:h-auto sm:max-w-lg sm:rounded-lg p-4 sm:p-6 ${isPopup ? 'rounded-lg max-w-lg w-[90%]' : ''}`}>
          <div className="flex items-center justify-between mb-8 align-center">

            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>

            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
} 