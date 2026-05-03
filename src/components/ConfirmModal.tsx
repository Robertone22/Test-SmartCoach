

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-[#2a2a2a] p-6 rounded-xl max-w-sm w-full fade-in">
        <p className="text-lg font-medium mb-6 text-center">{message}</p>
        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f0f0f0] border border-[#2a2a2a] px-4 py-2 rounded-lg transition-colors"
          >
            Anulează
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white px-4 py-2 rounded-lg transition-colors"
          >
            Da, șterge
          </button>
        </div>
      </div>
    </div>
  );
}
