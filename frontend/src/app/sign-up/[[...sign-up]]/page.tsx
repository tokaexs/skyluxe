import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, Plane } from "lucide-react";

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen bg-[#020202] flex items-center justify-center p-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-platinum/60 hover:text-gold transition-colors text-sm font-medium z-20 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Return to SkyLuxe
      </Link>

      <div className="relative z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3 mb-8 group">
          <Plane className="w-8 h-8 text-gold -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out" />
          <span className="text-2xl font-serif font-bold text-white tracking-tight">SkyLuxe</span>
        </Link>
        <SignUp />
      </div>
    </main>
  );
}
