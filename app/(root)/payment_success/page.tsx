"use client";
import useCart from "@/lib/hooks/useCart";
import Link from "next/link";
import { useEffect } from "react";

const SuccessfulPayment = () => {
  const cart = useCart();

  useEffect(() => {
    cart.clearCart();
  }, []);

  return (
    <div className="mt-44 flex flex-col justify-center items-center gap-5">
      <p className="text-heading4-bold text-red-1">Successful Payment</p>
      <p>Thank you for your purchase</p>
      <Link
        href={"/"}
        className="p-4 border text-base-bold hover:bg-black hover:text-white rounded-lg"
      >
        CONTINUE SHOPPING
      </Link>
    </div>
  );
};

export default SuccessfulPayment;

export const dynamic = 'force-dynamic'