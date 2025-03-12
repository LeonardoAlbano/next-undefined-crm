import { ProfileButton } from "@/components/profile-button";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen grid-cols-app">
      <Sidebar />

      <main className="bg-gradient-to-b from-[#010A20] to-[rgba(128,4,252,0.83)] px-10">
        <div className="flex w-full justify-end py-8">
          <ProfileButton />
        </div>
        {children}
      </main>
    </div>
  );
}
