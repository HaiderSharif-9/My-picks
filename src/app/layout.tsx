import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Picks — Good finds, thoughtfully picked',
  description: 'A considered collection of useful, beautiful and interesting finds from around the world.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
