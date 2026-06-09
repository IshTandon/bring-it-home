export const theme = {
  colors: {
    background: '#0a0e1a',
    surface: '#111827',
    border: '#1f2937',
    accent: '#f59e0b',
    textPrimary: '#f9fafb',
    textMuted: '#6b7280',
  },
} as const;

export type ThemeColors = typeof theme.colors;
