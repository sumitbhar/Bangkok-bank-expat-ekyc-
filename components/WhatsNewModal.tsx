
import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import Button from './common/Button';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const BUILD_VERSION = '2.0.0-prod'; // Change this to show the modal again
const LOCAL_STORAGE_KEY = 'ekyc-whats-new-version';

const WhatsNewModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (lastSeenVersion !== BUILD_VERSION) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, BUILD_VERSION);
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-[--color-background-main] w-full max-w-md rounded-2xl shadow-2xl flex flex-col">
        <header className="p-4 border-b border-[--color-border] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[--color-text-header]">What's New in This Build</h2>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-[--color-surface-accent]">
            <CloseIcon className="h-6 w-6 text-[--color-text-muted]" />
          </button>
        </header>
        <main className="p-6 space-y-4">
            <p className="text-sm text-[--color-text-body]">We've just rolled out a major update to enhance the application's quality and security, making it ready for production use.</p>
            <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-[--color-success] flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold text-[--color-text-header]">Enhanced Security:</span>
                        <p className="text-[--color-text-muted]">An automatic session timeout has been added to log you out after 10 minutes of inactivity, protecting your data.</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-[--color-success] flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold text-[--color-text-header]">Polished UI:</span>
                        <p className="text-[--color-text-muted]">All buttons and alerts have been standardized for a cleaner, more consistent user experience.</p>
                    </div>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-[--color-success] flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold text-[--color-text-header]">Improved Stability:</span>
                        <p className="text-[--color-text-muted]">The application is now more robust, with better error handling and a more realistic backend simulation.</p>
                    </div>
                </li>
            </ul>
        </main>
        <footer className="p-4 bg-[--color-surface-accent] rounded-b-2xl">
            <Button variant="primary" onClick={handleClose} className="w-full justify-center">
                Got It, Thanks!
            </Button>
        </footer>
      </div>
    </div>
  );
};

export default WhatsNewModal;
