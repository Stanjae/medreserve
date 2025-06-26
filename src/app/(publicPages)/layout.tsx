import MainNavbar from "@/components/navbar/MainNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <MainNavbar/>
        {children}
    </main>
  );
}
