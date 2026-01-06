
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-4 px-6 rounded-2xl font-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-center flex items-center justify-center tracking-tight";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-xl shadow-indigo-100/50",
    secondary: "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-xl shadow-emerald-100/50",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95",
    ghost: "text-indigo-600 hover:bg-indigo-50 active:scale-95"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
