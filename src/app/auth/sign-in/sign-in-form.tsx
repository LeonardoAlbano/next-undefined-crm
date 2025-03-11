"use client";

import { AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import BtnSignInWithGoogle from "@/assets/BtnSignInWithGoogle.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFormState } from "@/hooks/use-form-state";

import { signInWithEmailAndPassword } from "./actions";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword
  );
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label htmlFor="email" className="text-white">
          E-mail
        </Label>
        <Input name="email" type="email" id="email" />

        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-blackpurple hover:text-muted-foreground"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}
        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground text-white hover:underline"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button
        disabled={isPending}
        type="submit"
        className="w-full bg-purple-700"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Login"}
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
  );
}
