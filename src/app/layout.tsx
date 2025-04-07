import '../app/global.css';
import Navbar from './components/core/navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-full w-full"
      >
        
        {children}
      </body>
    </html>
  );
}
