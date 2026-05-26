export const LOCALES = ['en', 'ja', 'zh'] as const;
export type Locale = typeof LOCALES[number];

export const LOCATIONS = ['face', 'hair', 'body', 'physics', 'toggle', 'other'] as const;
export const ISSUE_TYPES = ['model_error', 'change_artwork', 'adjust_physics', 'add_remove', 'other'] as const;
export const PRIORITIES = ['high', 'medium', 'low'] as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://forms.mochipuworks.com';
export const MOCHIPU_EMAIL = process.env.MOCHIPU_EMAIL ?? 'mmpu.work@gmail.com';
