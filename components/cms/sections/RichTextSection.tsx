import React from 'react';

interface RichTextSectionProps {
  config: any;
  locale: 'en' | 'fr' | 'zh';
}

export const RichTextSection: React.FC<RichTextSectionProps> = ({ config, locale }) => {
  const contentHtml = config.contentHtml?.[locale] || '';

  if (!contentHtml) return null;

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto">
      <div 
        className="prose prose-lg prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
};
