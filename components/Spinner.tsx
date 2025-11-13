import React from 'react';

const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };
  return (
    <div className="flex justify-center items-center py-8">
      <div className={`${sizeClasses[size]} border-primary rounded-full animate-spin border-t-transparent`}></div>
    </div>
  );
};

export default Spinner;
