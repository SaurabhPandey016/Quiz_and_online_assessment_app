import { AuthProvider } from '@/hooks/use-auth';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
