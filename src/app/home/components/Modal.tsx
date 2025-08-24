import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: boolean; // if true, show as side panel
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, side }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.35)',
      zIndex: 1000,
      display: 'flex',
      alignItems: side ? 'stretch' : 'center',
      justifyContent: side ? 'flex-end' : 'center',
    }} onClick={onClose}>
      <div
        style={{
          background: '#181818',
          color: '#b5ff00',
          borderRadius: side ? '16px 0 0 16px' : 16,
          minWidth: side ? 320 : 340,
          maxWidth: 400,
          minHeight: side ? '100vh' : 120,
          padding: 32,
          boxShadow: '0 4px 32px #0008',
          position: 'relative',
          right: side ? 0 : undefined,
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#b5ff00', fontSize: 22, cursor: 'pointer' }}>✕</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
