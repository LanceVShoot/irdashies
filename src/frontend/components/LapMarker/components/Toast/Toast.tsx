import { FC } from 'react';

interface ToastProps {
  message: string;
}

export const Toast: FC<ToastProps> = ({ message }) => {
  return (
    <div
      className="bg-slate-800/90 text-white px-3 py-2 rounded-sm text-sm font-medium border border-slate-700 shadow-lg animate-in fade-in duration-300"
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        borderColor: 'rgba(51, 65, 85, 0.5)',
      }}
    >
      {message}
    </div>
  );
}