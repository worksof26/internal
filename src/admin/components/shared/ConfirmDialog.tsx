import type { ReactNode } from 'react';
import ModalWrapper from './ModalWrapper';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  message: string;
  danger?: boolean;
}

export function ConfirmDialog({ isOpen, onConfirm, onCancel, message, danger = false }: ConfirmDialogProps): ReactNode {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onCancel} title="Confirm action" size="sm">
      <p className="admin-confirm-dialog__message">{message}</p>
      <div className="admin-confirm-dialog__actions">
        <button type="button" className="admin-confirm-dialog__cancel" onClick={onCancel}>Cancel</button>
        <button type="button" className={danger ? 'admin-confirm-dialog__confirm admin-confirm-dialog__confirm--danger' : 'admin-confirm-dialog__confirm'} onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </ModalWrapper>
  );
}

export default ConfirmDialog;
