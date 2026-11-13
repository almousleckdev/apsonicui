// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { NextIntlClientProvider } from 'next-intl';
import type { HomeFeaturedModelItem } from '@/lib/types/homepage';

vi.mock('@/lib/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href, ...rest }, children),
}));
vi.mock('next/image', () => ({
  default: ({ src, alt, onLoad, onError }: { src: string; alt: string; onLoad?: () => void; onError?: () => void }) =>
    React.createElement('img', { src, alt, onLoad, onError }),
}));

import { RecommendedModels } from '@/components/features/recommended-models';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const model = (id: string, colors: string[] = []): HomeFeaturedModelItem => ({
  id,
  name: `Model ${id}`,
  image: `/m/${id}.png`,
  colors: colors.map((c) => ({ id: c, name: c, hex: '#000000', image: `/m/${id}-${c}.png` })),
});

let root: Root | undefined;
let host: HTMLElement | undefined;

async function mount(models: HomeFeaturedModelItem[]) {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  const Provider = NextIntlClientProvider as unknown as React.ComponentType<{ locale: string; messages: object }>;
  await act(async () => {
    root!.render(
      React.createElement(
        Provider,
        { locale: 'en', messages: {} },
        React.createElement(RecommendedModels, { initialConfig: models }),
      ),
    );
  });
}

// Pictures are cross-faded and stay in the page; the shown ones are marked.
const title = () => host!.querySelector('h3[data-active="true"]')?.textContent;
const bike = () => host!.querySelector<HTMLImageElement>('[data-layer="bike"][data-shown="true"] img')?.getAttribute('src');
const background = () =>
  host!.querySelector<HTMLImageElement>('[data-layer="background"][data-shown="true"] img')?.getAttribute('src');

// jsdom downloads nothing: finish every picture's download the way a browser does.
const finishLoading = async () => {
  await act(async () => {
    host!.querySelectorAll('img').forEach((img) => img.dispatchEvent(new Event('load')));
  });
};
const press = async (label: string) => {
  const button = host!.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
  await act(async () => {
    button.click();
  });
  await finishLoading();
};

afterEach(async () => {
  await act(async () => root?.unmount());
  host?.remove();
});

describe('recommended models carousel', () => {
  it('moves to the next and previous model with the arrows', async () => {
    await mount([model('1'), model('2'), model('3')]);
    expect(title()).toBe('Model 1');
    await press('Next model');
    expect(title()).toBe('Model 2');
    await press('Next model');
    await press('Next model');
    expect(title()).toBe('Model 1');
    await press('Previous model');
    expect(title()).toBe('Model 3');
  });

  it('colour dots change only the picture of the current model', async () => {
    await mount([model('1', ['black', 'red']), model('2', ['white'])]);
    expect(bike()).toBe('/m/1.png');
    await act(async () => {
      host!.querySelector<HTMLButtonElement>('button[aria-label="Select red"]')!.click();
    });
    await finishLoading();
    expect(bike()).toBe('/m/1-red.png');
    expect(title()).toBe('Model 1');
  });

  it('has no page-position dots between the picture and the colour dots', async () => {
    await mount([model('1', ['black']), model('2', ['red'])]);
    expect(host!.querySelectorAll('button[aria-label^="Go to slide"]').length).toBe(0);
  });

  it('keeps the old picture on screen until the new one has loaded, so there is never a blank gap', async () => {
    await mount([model('1', ['black', 'red'])]);
    await act(async () => {
      host!.querySelector<HTMLButtonElement>('button[aria-label="Select red"]')!.click();
    });
    expect(bike()).toBe('/m/1.png'); // red is chosen but still downloading
    await finishLoading();
    expect(bike()).toBe('/m/1-red.png');
  });

  it('loads the next picture before it is needed and never removes a picture from the page', async () => {
    await mount([model('1', ['black', 'red']), model('2')]);
    const sources = () => [...host!.querySelectorAll('[data-layer="bike"] img')].map((i) => i.getAttribute('src'));
    expect(sources()).toEqual(expect.arrayContaining(['/m/1.png', '/m/1-black.png', '/m/1-red.png']));
    const before = sources();
    await press('Next model');
    expect(sources()).toEqual(expect.arrayContaining(before));
  });

  it('every 10 seconds the picture changes together with its colour dot, then moves to the next model', async () => {
    vi.useFakeTimers();
    try {
      await mount([model('1', ['black', 'red']), model('2', ['white'])]);
      const tick = async (ms: number) => {
        await act(async () => {
          vi.advanceTimersByTime(ms);
        });
        await finishLoading();
      };
      expect(bike()).toBe('/m/1.png');

      await tick(9_900);
      expect(bike()).toBe('/m/1.png'); // not before 10 seconds
      await tick(200);
      expect(bike()).toBe('/m/1-black.png');
      await tick(10_000);
      expect(bike()).toBe('/m/1-red.png');
      await tick(10_000);
      expect([title(), bike()]).toEqual(['Model 2', '/m/2.png']); // last colour done: next model
      await tick(10_000);
      expect(bike()).toBe('/m/2-white.png');
    } finally {
      vi.useRealTimers();
    }
  });

  it('each model has its own background, and a model without one shows none', async () => {
    await mount([{ ...model('1'), background: '/bg/one.png' }, model('2'), { ...model('3'), background: '/bg/three.png' }]);
    expect(background()).toBe('/bg/one.png');
    await press('Next model');
    expect(background()).toBeUndefined();
    await press('Next model');
    expect(background()).toBe('/bg/three.png');
  });

  it('skips a model that has no picture yet instead of showing a broken image', async () => {
    await mount([model('1'), { ...model('2'), image: '' }, model('3')]);
    expect(host!.querySelectorAll('h3').length).toBe(2);
    await press('Next model');
    expect(title()).toBe('Model 3');
  });

  it('shows no background at all when none is set, and no colour dot for a colour without a picture', async () => {
    await mount([
      { ...model('1', ['black']), colors: [
        { id: 'black', name: 'black', hex: '#000000', image: '/m/1-black.png' },
        { id: 'new', name: '', hex: '#000000', image: '' },
      ] },
    ]);
    expect(host!.querySelectorAll('[data-layer="background"]').length).toBe(0);
    expect(host!.querySelectorAll('button[aria-label^="Select "]').length).toBe(1);
  });
});
