import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { router } from './routes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Toaster position="top-right" richColors />
          <RouterProvider router={router} />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}