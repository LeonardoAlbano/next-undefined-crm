/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <section className="flex h-full flex-col items-center justify-center bg-blackpurple px-4">
        <SignInForm />
      </section>

      <section className="hidden md:block">
        <img src="/picture.png" className="h-screen w-full object-cover" />
      </section>
    </main>
  );
}
