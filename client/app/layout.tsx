import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '../context/SidebarContext';
import { ThemeProvider } from '../context/ThemeContext';
import Provider from './(admin)/provider';
import { Metadata } from 'next';

const outfit = Outfit({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title:
    "Medisync | Hospital management made easy",
  description: "Hospital Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Provider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
