"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-5 top-10 text-[14vw] font-heading font-bold uppercase leading-none tracking-[-0.06em] text-foreground/3">
          Mode
        </div>

        <div className="absolute bottom-8 right-5 text-[12vw] font-serif italic leading-none text-foreground/4">
          Atelier
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <SignIn />
      </div>
    </main>
  );
}
