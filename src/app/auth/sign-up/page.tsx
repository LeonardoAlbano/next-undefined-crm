/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signUpForm = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type SignUpForm = z.infer<typeof signUpForm>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>();

  async function handleSignUp(data: SignUpForm) {
    console.log(data);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Cadastro criado com sucesso");
  }

  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <section className="hidden md:block">
        <img src="/picture.png" className="h-screen w-full object-cover" />
      </section>
      <section className="flex h-full flex-col items-center justify-center bg-blackpurple px-4 pb-20">
        <div className="m-10">
          <h1 className="text-4xl font-semibold text-white">Cria conta</h1>
        </div>
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="w-full max-w-xs space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="name" className="text-white">
              Nome
            </Label>
            <Input {...register("name")} type="text" id="name" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <Input {...register("email")} type="email" id="email" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-blackpurple hover:text-muted-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

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
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-blackpurple hover:text-muted-foreground"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-700"
          >
            Criar conta
          </Button>
        </form>
      </section>
    </main>
  );
}
