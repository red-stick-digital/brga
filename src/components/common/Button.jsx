import React from 'react';

const Button = ({ children, onClick, className, type = 'button', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-8 py-4 min-w-[235px] bg-[#8BB7D1] text-black font-helvetica font-semibold rounded-md hover:bg-opacity-90 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;