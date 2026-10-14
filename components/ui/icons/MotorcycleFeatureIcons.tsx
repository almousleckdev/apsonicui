'use client';

import React from 'react';
import type { IconProps } from './MotorcycleCategoryIcons';

export const MotorcycleSchoolIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
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
      <path d="M16 2L20 4L18 5L16 4L14 5L12 4L16 2Z" fill="currentColor" opacity="0.8" />
      <path d="M18 5L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const MotorcycleBookIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="6" cy="16" r="2.5" fill="currentColor" />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
      <path d="M6 16L9 12L15 12L18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12L12 10.5C12 10.2 12.2 10 12.5 10H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 4H20C20.6 4 21 4.4 21 5V9C21 9.6 20.6 10 20 10H17C16.4 10 16 9.6 16 9V5C16 4.4 16.4 4 17 4Z" fill="currentColor" opacity="0.3" />
      <path d="M17 4H20C20.6 4 21 4.4 21 5V9C21 9.6 20.6 10 20 10H17C16.4 10 16 9.6 16 9V5C16 4.4 16.4 4 17 4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17.5 6H19.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M17.5 7.5H19.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};

export const MotorcycleDownloadIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => {
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
      <path d="M16 3V7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 5L20 7L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
