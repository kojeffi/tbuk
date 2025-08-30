import { AuthProvider } from '@/components/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Tbooke - Education Platform',
  description: 'An Education-Centric Open Learning and Social Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}