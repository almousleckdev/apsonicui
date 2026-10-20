import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageBlockNodeView } from './ImageBlockNodeView';
import type { DOMOutputSpec } from '@tiptap/pm/model';

export const ImageBlock = Node.create({
  name: 'imageBlock',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="image-block"]',
        getAttrs: (dom) => {
          const figure = dom as HTMLElement;
          const img = figure.querySelector('img');
          const figcaption = figure.querySelector('figcaption');
          return {
            src: img?.getAttribute('src') || null,
            alt: img?.getAttribute('alt') || '',
            caption: figcaption?.textContent?.trim() || '',
          };
        },
      },
      {
        tag: 'figure',
        getAttrs: (dom) => {
          const figure = dom as HTMLElement;
          const img = figure.querySelector('img');
          const figcaption = figure.querySelector('figcaption');
          return {
            src: img?.getAttribute('src') || null,
            alt: img?.getAttribute('alt') || '',
            caption: figcaption?.textContent?.trim() || '',
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          const img = dom as HTMLImageElement;
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') || '',
            caption: img.getAttribute('title') || '',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const captionText = (HTMLAttributes.caption || '').trim();
    const children: DOMOutputSpec[] = [
      [
        'img',
        {
          src: HTMLAttributes.src,
          alt: HTMLAttributes.alt || '',
          class:
            'rounded-2xl max-w-2xl w-full mx-auto block object-cover my-0 mb-0 shadow-none border-none bg-transparent select-none',
        },
      ],
    ];

    if (captionText) {
      children.push([
        'figcaption',
        {
          class:
            'text-center text-xs sm:text-sm text-zinc-500 italic mt-1 font-sans block w-full outline-none',
        },
        captionText,
      ]);
    }

    return [
      'figure',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'image-block',
        class: 'my-6 text-center block max-w-2xl mx-auto group relative',
      }),
      ...children,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockNodeView);
  },
});
