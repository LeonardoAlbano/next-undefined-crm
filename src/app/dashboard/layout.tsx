import Sidebar from "@/components/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen grid-cols-app">
      <Sidebar />
      <main className="">{children}</main>
    </div>
  );
}
