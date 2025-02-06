import Footer from "@/components/ui/Footer";
import Link from "next/link";

export default function FormPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="relative z-[2]">
        <h1 className="text-2xl font-bold">Formulário</h1>
        <Link href="/" className="mt-4 inline-block text-blue-500">
          Voltar para Home
        </Link>
        <Footer />
      </div>
    </main>
  );
}
