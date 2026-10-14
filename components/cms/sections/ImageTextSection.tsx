import React from 'react';
import Image from 'next/image';

interface ImageTextSectionProps {
  config: any;
  locale: 'en' | 'fr' | 'zh';
  imagePosition: 'left' | 'right';
}

export const ImageTextSection: React.FC<ImageTextSectionProps> = ({ config, locale, imagePosition }) => {
  const heading = config.heading?.[locale] || '';
  const description = config.description?.[locale] || '';
  const imageUrl = config.imageUrl || '';

  const ImageBlock = () => (
    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-100">
      {imageUrl && (
        <Image src={imageUrl} alt={heading} fill className="object-cover" />
      )}
    </div>
  );

  const TextBlock = () => (
    <div className="flex flex-col justify-center space-y-4">
      {heading && <h2 className="text-3xl font-bold text-gray-900">{heading}</h2>}
      {description && (
        <div 
          className="prose text-gray-600"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {imagePosition === 'left' ? (
          <>
            <ImageBlock />
            <TextBlock />
          </>
        ) : (
          <>
            <TextBlock />
            <ImageBlock />
          </>
        )}
      </div>
    </div>
  );
};
