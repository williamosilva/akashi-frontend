"use client";
import { PaymentService } from "@/services/payment.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/components/ui/ConditionalLayout";
import Home from "@/app/page";
import { cn } from "@/lib/utils";

export default function SuccessPage() {
  const router = useRouter();
  const { token } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const paymentService = PaymentService.getInstance();
  const { email } = useUser();
  const checkSuccessToken = async () => {
    console.log("começou a checksucesstoken");
    try {
      setIsLoading(true);
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
          console.error("User not logged in with the same email");
        }
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
    checkSuccessToken();
  }, [token, router]);

  return (
    <div
      className={cn(
        isLoading ? "cursor-wait pointer-events-none selection-none" : ""
      )}
    >
      <Home />
    </div>
  );
}
