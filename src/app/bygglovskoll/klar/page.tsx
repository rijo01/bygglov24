import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { bygglovskollAktiv } from "@/lib/bygglovskoll/flag";
import KlarKlient from "./KlarKlient";

export const metadata: Metadata = {
  title: "Din Bygglovskoll | bygglov24.se",
  description: "Ditt underlag visas här efter att betalningen verifierats.",
  robots: { index: false, follow: false },
};

export default function KlarPage() {
  if (!bygglovskollAktiv()) notFound();

  return (
    <div className="container-wide py-10 sm:py-14">
      <Suspense fallback={<p className="text-slate-600">Verifierar betalningen…</p>}>
        <KlarKlient />
      </Suspense>
    </div>
  );
}
