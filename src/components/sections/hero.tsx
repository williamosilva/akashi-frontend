import Image from "next/image";
import { Button } from "../ui/button";
import { Container } from "../ui/container";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <Container>
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-6">
            Bem-vindo ao Futuro
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Crie experiências incríveis com Next.js e as melhores práticas de
            desenvolvimento.
          </p>
          <Button>Comece Agora</Button>
        </div>
      </Container>
    </section>
  );
}
