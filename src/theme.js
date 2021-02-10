import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { light: '#5050d2', main: '#5050d2', dark: '#5050d2' },
    secondary: { light: '#ffffff', main: '#ffffff', dark: '#ffffff' },
    tertiary: { light: '#8884d8', main: '#8884d8', dark: '#8884d8' },
    green: { light: 'forestgreen', main: 'forestgreen', dark: 'forestgreen' },
    gray: { light: '#555', main: '#555', dark: '#555' },
  },
});

export default theme;
