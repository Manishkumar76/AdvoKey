import '../app/global.css';

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
