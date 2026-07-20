"use client";

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground pb-5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-5 top-10 text-[14vw] font-heading font-bold uppercase leading-none tracking-[-0.06em] text-foreground/[0.03]">
          Mode
        </div>

        <div className="absolute bottom-8 right-5 text-[12vw] font-serif italic leading-none text-foreground/[0.04]">
          Atelier
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <SignUp />
      </div>
    </main>
  );
}
