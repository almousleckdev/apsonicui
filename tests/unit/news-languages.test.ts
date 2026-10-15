import { describe, expect, it } from 'vitest';
import { newsLanguages } from '@/lib/news-languages';

describe('newsLanguages', () => {
  it('counts a language once it has a title and a body', () => {
    expect(newsLanguages({ titleEn: 'A', contentHtmlEn: '<p>x</p>', titleFr: 'B', contentHtmlFr: '<p></p>', titleZh: '', contentHtmlZh: '' }))
      .toEqual({ en: true, fr: false, zh: false });
  });

  it('judges by the title alone when the body was not loaded (the admin list)', () => {
    expect(newsLanguages({ titleEn: 'A', titleFr: 'B' })).toEqual({ en: true, fr: true, zh: false });
  });
});
