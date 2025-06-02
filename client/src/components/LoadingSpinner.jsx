import React from 'react'


const LoadingSpinner = ({ message }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="loader"></div>
      <p className="ml-2">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
