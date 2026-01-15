import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, backgroundImage }) => {
  return (
    <div className="relative bg-primary py-20 text-center text-white overflow-hidden">
      {backgroundImage && (
        <>
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img 
            src={backgroundImage} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        </>
      )}
      <div className="relative z-20 container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-gray-300 max-w-2xl mx-auto">{subtitle}</p>}
        <div className="h-1 w-24 bg-secondary mx-auto mt-6"></div>
      </div>
    </div>
  );
};

export default PageHeader;
