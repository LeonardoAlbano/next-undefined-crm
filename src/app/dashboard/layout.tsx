import Sidebar from "@/components/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen grid-cols-app">
      <Sidebar />
      <main className="px-4 pb-12 pt-8">{children}</main>
    </div>
  );
}
