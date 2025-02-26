"use client";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import BtnSignInWithGoogle from "@/assets/BtnSignInWithGoogle.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { signInWithEmailAndPassword } from "./actions";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <section className="flex h-full flex-col items-center justify-center px-4 bg-blackpurple">
        <form
          action={signInWithEmailAndPassword}
          className="space-y-4 w-full max-w-xs"
        >
          <div className="space-y-1">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <Input name="email" type="email" id="email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blackpurple hover:text-muted-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-foreground hover:underline text-white"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-purple-700">
            Login
          </Button>

          <Separator />

          <Button
            type="submit"
            variant="ghost"
            className="w-full border text-white"
          >
            <Image src={BtnSignInWithGoogle} alt="Login com Google" />
            Login com o Google
          </Button>

          <div className="pt-3 ml-1">
            <Link href="/auth/sign-up" className="text-muted-foreground">
              Registrar-se
            </Link>
          </div>
        </form>
      </section>

      <section className="hidden md:block">
        <img src="/picture.png" className="w-full h-screen object-cover" />
      </section>
    </main>
  );
}
