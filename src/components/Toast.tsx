import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-150 pointer-events-none">
      <div className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A] text-xs font-mono font-bold uppercase shadow-[4px_4px_0px_#1A1A1A]">
        <CheckCircle className="w-4 h-4 text-[#FF3E00] shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
};
