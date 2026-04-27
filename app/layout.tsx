import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'La Balanza Cósmica',
  description: 'Tutor de matemáticas interactivo con IA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans h-screen overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
