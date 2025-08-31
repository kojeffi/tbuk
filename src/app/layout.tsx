import './globals.css';
import { AuthProvider } from './AuthProvider'; // Make sure this import is correct

export const metadata = {
  title: 'Tbooke - Education Platform',
  description: 'An Education-Centric Open Learning and Social Platform',
};

// Add type definition for children
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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
