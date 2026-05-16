import ReactDom from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

ReactDom.createRoot(document.getElementById('root')).render(<AuthProvider>
  <App />
</AuthProvider>);