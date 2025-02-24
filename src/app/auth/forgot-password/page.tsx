/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0">
        <img
          src="/picture.png"
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>

      <section className="relative z-10 bg-blackpurple  rounded-xl shadow-lg max-w-lg p-10 w-full text-center">
        <h1 className="text-4xl text-white font-bold">Esqueceu a senha?</h1>
        <p className="text-gray-300 text-sm mt-2">
          Não há nada com que se preocupar, enviaremos uma mensagem para
          ajudá-lo a redefinir sua senha.
        </p>

        <form className="space-y-4 mt-4">
          <div className="text-left">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <Input
              name="email"
              type="email"
              id="email"
              placeholder="Insira o endereço de e-mail"
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full bg-purple-700">
            Enviar link de redefinição
          </Button>
        </form>
      </section>
    </main>
  );
}
