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

      <main className="bg-blackpurple px-10">
        <div className="flex w-full justify-end py-8">
          <ProfileButton />
        </div>
        {children}
      </main>
    </div>
  );
}
