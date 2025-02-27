"use client";
import { PaymentService } from "@/services/payment.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/components/ui/ConditionalLayout";

interface BodyDataProps {
  email: string;
  plan: "basic" | "premium" | undefined | "";
}

export default function SuccessPage() {
  const router = useRouter();
  const { token } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const paymentService = PaymentService.getInstance();
  const [bodyData, setBodyData] = useState<BodyDataProps>({
    email: "",
    plan: "",
  });
  const { email } = useUser();
  console.log("email" + email);
  console.log("emails", email, bodyData.email);
  const checkSuccessToken = async () => {
    try {
      setIsLoading(true);
      console.log("fez a req do checkSucessToken");
      const verificationResult = await paymentService.verifySessionToken(
        token as string
      );
      console.log("verificationResult", verificationResult);

      if (verificationResult.valid) {
        if (verificationResult.email === email) {
          console.log("Email corresponde ao token");
          router.push(
            `/form?email=${encodeURIComponent(
              verificationResult.email
            )}&plan=${encodeURIComponent(verificationResult.planType || "")}`
          );
        } else {
          console.log(
            "Email não corresponde ao token",
            verificationResult.email,
            email
          );

          // router.push(
          //   `/?email=${encodeURIComponent(
          //     verificationResult.email
          //   )}&plan=${encodeURIComponent(verificationResult.planType || "")}`
          // );

          console.log("emails", email, bodyData.email);
        }
      } else {
        console.error("Stripe Error:");
      }
    } catch (error) {
      console.error("Error verifying session token:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }

    if (email) {
      // Only run when email is available
      checkSuccessToken();
    }
  }, [token, router, email]);

  return (
    <div className="p-4">
      <h1>Success Page</h1>
      <p>Token: {token}</p>
      {isLoading && <p>Verificando...</p>}
    </div>
  );
}
