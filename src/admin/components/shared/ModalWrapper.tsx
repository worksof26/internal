import { useEffect, type ReactNode } from 'react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size: 'sm' | 'md' | 'lg' | 'xl';
}

export function ModalWrapper({ isOpen, onClose, title, children, size }: ModalWrapperProps): ReactNode {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal" role="presentation">
      <button type="button" className="admin-modal__backdrop" aria-label="Close modal" onClick={onClose} />
      <section className={`admin-modal__dialog admin-modal__dialog--${size}`} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <header className="admin-modal__header">
          <h2 id="admin-modal-title" className="admin-modal__title">{title}</h2>
          <button type="button" className="admin-modal__close" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <div className="admin-modal__body">{children}</div>
      </section>
    </div>
  );
}

export default ModalWrapper;
