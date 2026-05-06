import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(159 100% 19%)',
    card: 'hsl(0 0% 97%)',
    cardForeground: 'hsl(150 25% 35%)',
    popover: 'hsl(146 26% 94%)',
    popoverForeground: 'hsl(150 25% 35%)',
    primary: 'hsl(159 100% 19%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(160 28% 88%)',
    secondaryForeground: 'hsl(150 25% 35%)',
    muted: 'hsl(160 29% 91%)',
    mutedForeground: 'hsl(148 11% 36%)',
    accent: 'hsl(160 28% 88%)',
    accentForeground: 'hsl(150 25% 35%)',
    destructive: 'hsl(179 100% 24%)',
    border: 'hsl(160 34% 90%)',
    input: 'hsl(160 18% 82%)',
    ring: 'hsl(147 11% 60%)',
    radius: '1rem',
    chart1: 'hsl(148 28% 72%)',
    chart2: 'hsl(151 45% 41%)',
    chart3: 'hsl(158 100% 25%)',
    chart4: 'hsl(152 100% 18%)',
    chart5: 'hsl(0 0% 0%)',
    fontSerif: 'InstrumentSerif-Regular',
  },
  dark: {
    background: 'hsl(147 8% 7%)',
    foreground: 'hsl(146 22% 93%)',
    card: 'hsl(147 10% 11%)',
    cardForeground: 'hsl(146 7% 80%)',
    popover: 'hsl(147 10% 11%)',
    popoverForeground: 'hsl(146 7% 80%)',
    primary: 'hsl(159 100% 19%)',
    primaryForeground: 'hsl(147 100% 95%)',
    secondary: 'hsl(148 11% 15%)',
    secondaryForeground: 'hsl(146 7% 80%)',
    muted: 'hsl(148 11% 15%)',
    mutedForeground: 'hsl(147 6% 55%)',
    accent: 'hsl(148 11% 15%)',
    accentForeground: 'hsl(146 7% 80%)',
    destructive: 'hsl(180 100% 13%)',
    border: 'hsl(147 6% 16%)',
    input: 'hsl(147 6% 14%)',
    ring: 'hsl(149 15% 35%)',
    radius: '1rem',
    chart1: 'hsl(158 100% 23%)',
    chart2: 'hsl(43 21% 94%)',
    chart3: 'hsl(159 100% 19%)',
    chart4: 'hsl(142 100% 12%)',
    chart5: 'hsl(131 100% 11%)',
    fontSerif: 'InstrumentSerif-Regular',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
    fonts: {
      regular: {
        fontFamily: THEME.light.fontSerif,
        fontWeight: '400',
      },
      medium: {
        fontFamily: THEME.light.fontSerif,
        fontWeight: '500',
      },
      bold: {
        fontFamily: THEME.light.fontSerif,
        fontWeight: '700',
      },
      heavy: {
        fontFamily: THEME.light.fontSerif,
        fontWeight: '900',
      },
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
    fonts: {
      regular: {
        fontFamily: THEME.dark.fontSerif,
        fontWeight: '400',
      },
      medium: {
        fontFamily: THEME.dark.fontSerif,
        fontWeight: '500',
      },
      bold: {
        fontFamily: THEME.dark.fontSerif,
        fontWeight: '700',
      },
      heavy: {
        fontFamily: THEME.dark.fontSerif,
        fontWeight: '900',
      },
    },
  },
};
