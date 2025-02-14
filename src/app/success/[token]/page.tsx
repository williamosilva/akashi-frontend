"use client"; // Indica que é um componente Client, necessário para usar useParams

import { useParams } from "next/navigation";
import FormPage from "../../form/page";

export default function SuccessPage() {
  const { token } = useParams(); // Captura o token da URL

  return console.log(token);
}
