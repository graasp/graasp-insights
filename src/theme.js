import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { light: '#09653f', main: '#09653f', dark: '#09653f' },
    secondary: { light: '#ffffff', main: '#ffffff', dark: '#ffffff' },
    tertiary: {
      light: 'forestgreen',
      main: 'forestgreen',
      dark: 'forestgreen',
    },
  },
});

export default theme;
