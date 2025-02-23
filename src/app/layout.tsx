
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white h-full w-full"
      >
        {children}
      </body>
    </html>
  );
}
