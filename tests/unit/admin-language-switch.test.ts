// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useAdminText } from '@/context/AdminTextContext';
import { AdminProviders } from '@/components/admin/AdminProviders';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Switching the admin between 中文 and EN must never leave the page matching both languages at once: the CSS hides the
 * language that is not chosen, so a page that says "zh" in one place and "en" in another hides every label.
 */
describe('admin language switch', () => {
  let root: Root | undefined;
  let container: HTMLElement | undefined;
  let switchTo: ((mode: 'zh' | 'en') => void) | undefined;

  function Probe() {
    const { setMode, t } = useAdminText();
    switchTo = setMode;
    return React.createElement('span', { id: 'label' }, t('nav.dashboard'));
  }

  function mount(initial: 'zh' | 'en') {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      // The same composition the admin layout uses, so the wrapper it renders is part of what is tested.
      root!.render(React.createElement(AdminProviders, { initialMode: initial, children: React.createElement(Probe) }));
    });
  }

  /** Every language marker currently in the page, including the one on <html>. */
  const markers = () => Array.from(document.querySelectorAll('[data-admin-text]')).map((el) => el.getAttribute('data-admin-text'));

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    document.cookie = 'ADMIN_TEXT=; max-age=0; path=/';
  });

  it('starts with one language everywhere', () => {
    mount('zh');
    expect(new Set(markers()).size).toBe(1);
    expect(markers()).toContain('zh');
  });

  it('changes every marker together when switching to EN and back', () => {
    mount('zh');

    act(() => switchTo!('en'));
    expect(markers().length).toBeGreaterThan(0);
    expect(new Set(markers())).toEqual(new Set(['en']));
    expect(document.getElementById('label')!.textContent).toBe('Dashboard');

    act(() => switchTo!('zh'));
    expect(new Set(markers())).toEqual(new Set(['zh']));
    expect(document.getElementById('label')!.textContent).not.toBe('Dashboard');
  });

  it('remembers the choice in a cookie for the next page load', () => {
    mount('zh');
    act(() => switchTo!('en'));
    expect(document.cookie).toContain('ADMIN_TEXT=en');
  });
});
