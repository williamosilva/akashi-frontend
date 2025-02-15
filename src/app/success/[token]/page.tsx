"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token, router]);

  return (
    <div className="p-4">
      <h1>Success Page</h1>
      <p>Token: {token}</p>
    </div>
  );
}
