import React from 'react';
import Image from 'next/image';
import { ADMIN_AUTH_CONSTANTS } from '@/lib/constants/auth';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 32, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image
        src={ADMIN_AUTH_CONSTANTS.LOGO_IMAGE_PATH}
        alt="APSONIC Logo"
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </div>
  );
};
