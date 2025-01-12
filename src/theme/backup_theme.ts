import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    background: {
      primary: '',
      secondary: '',
    },
    blue: {
      700: '#6C63FF',
      500: '#4324FF',
    },
    gray: {
      700: '#121214',
      600: '#202024',
      500: '#29292E',
      400: '#323238',
      300: '#7C7C8A',
      200: '#C4C4CC',
      100: '#E1E1E6',
    },
    title: {
      primary: '#121214',
      secondary: '#323238',
    },
    text: {
      primary: '#323238',
      secondary: '#C4C4CC',
    },

    white: '#FFFFFF',
    red: {
      500: '#F75A68',
    },
    input: {
      700: '#202024',
    },
  },
  fonts: {
    heading: 'Roboto_700Bold',
    body: 'Roboto_400Regular',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xlg: 24,
  },
  sizes: {
    14: 56,
    33: 148,
  },
});
