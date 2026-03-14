import { DM_Sans, Playfair_Display } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display'
});

export const metadata = {
  title: 'Memora',
  description: 'Bringing memories to life through WebAR'
};

export default function RootLayout({ children }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmsuZXhhbXBsZS5jb20k';

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <body className={`${dmSans.variable} ${playfair.variable}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
