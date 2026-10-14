'use client';

import React from 'react';

export interface IconProps {
  className?: string;
  size?: number;
}

export const MotorcyclePDFIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M5 15C5 16.1 5.9 17 7 17C8.1 17 9 16.1 9 15C9 13.9 8.1 13 7 13C5.9 13 5 13.9 5 15Z" fill="currentColor" />
      <path d="M15 15C15 16.1 15.9 17 17 17C18.1 17 19 16.1 19 15C19 13.9 18.1 13 17 13C15.9 13 15 13.9 15 15Z" fill="currentColor" />
      <path d="M7 15L10 10L14 10L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 10L12 8C12 7.4 12.4 7 13 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="16" y="3" width="6" height="8" rx="1" fill="currentColor" opacity="0.2" />
      <path d="M16 3H20V7H16V3Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 5H19" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
};

export const MotorcycleImageIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M5 15C5 16.1 5.9 17 7 17C8.1 17 9 16.1 9 15C9 13.9 8.1 13 7 13C5.9 13 5 13.9 5 15Z" fill="currentColor" />
      <path d="M15 15C15 16.1 15.9 17 17 17C18.1 17 19 16.1 19 15C19 13.9 18.1 13 17 13C15.9 13 15 13.9 15 15Z" fill="currentColor" />
      <path d="M7 15L10 10L14 10L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 10L12 8C12 7.4 12.4 7 13 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="15" y="2" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="4" r="0.5" fill="currentColor" />
      <path d="M15 6L18 9L21 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};

export const MotorcycleVideoIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M5 15C5 16.1 5.9 17 7 17C8.1 17 9 16.1 9 15C9 13.9 8.1 13 7 13C5.9 13 5 13.9 5 15Z" fill="currentColor" />
      <path d="M15 15C15 16.1 15.9 17 17 17C18.1 17 19 16.1 19 15C19 13.9 18.1 13 17 13C15.9 13 15 13.9 15 15Z" fill="currentColor" />
      <path d="M7 15L10 10L14 10L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 10L12 8C12 7.4 12.4 7 13 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="5" r="3" fill="currentColor" opacity="0.2" />
      <path d="M16.5 5L19 6.5L16.5 8V5Z" fill="currentColor" />
    </svg>
  );
};
