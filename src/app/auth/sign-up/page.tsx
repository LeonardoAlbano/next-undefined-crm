"use client";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <section className="hidden md:block">
        <img src="/picture.png" className="w-full h-screen object-cover" />
      </section>
      <section className="flex h-full flex-col items-center justify-center px-4 bg-blackpurple pb-20">
        <div className="m-10">
          <h1 className="text-4xl font-semibold text-white">Cria conta</h1>
        </div>
        <form className="space-y-4 w-full max-w-xs">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-white">
              Nome
            </Label>
            <Input name="name" type="text" id="name" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <Input name="email" type="email" id="email" />
          </div>

          {/* Campo de Senha */}
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
          </div>

          {/* Campo de Repetir Senha */}
          <div className="space-y-1 pb-2">
            <Label htmlFor="confirm-password" className="text-white">
              Repetir Senha
            </Label>
            <div className="relative">
              <Input
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blackpurple hover:text-muted-foreground"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-purple-700">
            Criar conta
          </Button>
        </form>
      </section>
    </main>
  );
}
