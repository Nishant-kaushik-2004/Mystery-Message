import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-2 sm:py-4 bg-gray-200 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-700 text-sm">
            <span className="font-medium">Mystery Message</span>
          </div>
          
          <div className="mt-1 sm:mt-2 md:mt-0 flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              Created by <span className="font-medium">Nishant Kaushik</span>
            </p>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;