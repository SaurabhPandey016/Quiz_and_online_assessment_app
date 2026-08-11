import { AuthProvider } from '@/hooks/use-auth';
import SiteShell from '@/components/site-shell';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#02030b] text-[#ebf5ff] selection:bg-cyan-400/25 selection:text-white">
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
