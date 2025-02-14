"use client"; // Necessário para usar useParams

import { useParams } from "next/navigation";
import FormPage from "../../app/form/page"; // Ajuste o import conforme necessário

export default function SuccessPage() {
  const { token } = useParams(); // Pega o token da URL

  return console.log(token);
}
