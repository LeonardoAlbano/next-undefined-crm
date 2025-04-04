import { redirect } from "next/navigation";

import { isAuthenticated } from "@/auth/auth";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (await isAuthenticated()) {
    redirect("/dashboard/home");
  }
  return <div>{children}</div>;
}
