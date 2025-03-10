/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { signIn } from "@/api/sign-in";
import BtnSignInWithGoogle from "@/assets/BtnSignInWithGoogle.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const signInForm = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInForm>;

export default function SignInPage() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>({
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  async function handleSignIn(data: SignInForm) {
    console.log(data);

    await authenticate({ email: data.email, password: data.password });

    toast.success("Login sucesso!");
  }

  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <section className="flex h-full flex-col items-center justify-center bg-blackpurple px-4">
        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="w-full max-w-xs space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <Input type="email" id="email" {...register("email")} />
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
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-foreground text-white hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-purple-700"
          >
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

          <div className="ml-1 pt-3">
            <Link href="/auth/sign-up" className="text-muted-foreground">
              Registrar-se
            </Link>
          </div>
        </form>
      </section>

      <section className="hidden md:block">
        <img src="/picture.png" className="h-screen w-full object-cover" />
      </section>
    </main>
  );
}
