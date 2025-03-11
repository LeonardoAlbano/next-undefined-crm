"use client";

import { AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import BtnSignInWithGoogle from "@/assets/BtnSignInWithGoogle.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFormState } from "@/hooks/use-form-state";

import { signUpAction } from "./actions";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push("/auth/sign-in");
    }
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
        <Label htmlFor="name" className="text-white">
          Name
        </Label>
        <Input name="name" id="name" />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

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
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation" className="text-white">
          Repetir Senha
        </Label>
        <div className="relative">
          <Input
            name="password_confirmation"
            type={showPassword ? "text" : "password"}
            id="password_confirmation"
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
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Criar conta"
        )}
      </Button>

      <Separator />

      <Button
        type="submit"
        variant="ghost"
        className="w-full border text-white"
      >
        <Image src={BtnSignInWithGoogle} alt="Login com Google" />
        Cadastro com o Google
      </Button>
    </form>
  );
}
