import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { ChakraProvider, ColorModeScript, Button } from '@chakra-ui/react';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import './styles/main.scss';

const config: ThemeConfig = {
  initialColorMode: 'dark', // 'dark' | 'light'
  useSystemColorMode: false,
};
const theme = extendTheme({ config });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider>
    <ColorModeScript initialColorMode={'dark'} />
    <App />
  </ChakraProvider>,
);
