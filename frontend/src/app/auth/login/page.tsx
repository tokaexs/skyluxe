"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, Lock, Mail, Fingerprint, Sparkles } from "lucide-react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Helper for browser-safe Base64URL encoding
const base64urlEncode = (str: string) => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com";
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "com.skyluxe.services";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingApple, setIsLoadingApple] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Incorrect email or password.");
      }

      const data = await response.json();
      login(data.access_token);
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || "Unable to connect to authentication servers.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    setError("");
    try {
      if (typeof window !== "undefined" && (window as any).google && GOOGLE_CLIENT_ID !== "your-google-client-id.apps.googleusercontent.com") {
        const google = (window as any).google;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            try {
              const res = await fetch("http://localhost:3001/api/v1/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_token: response.credential }),
              });
              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Google authentication verification failed.");
              }
              const data = await res.json();
              login(data.access_token);
              router.push(redirectPath);
            } catch (err: any) {
              setError(err.message || "Google validation failed on API.");
              setIsLoadingGoogle(false);
            }
          }
        });
        google.accounts.id.prompt();
      } else {
        // Offline sandbox credential generator
        console.log("Google GIS client not loaded or using placeholder ID. Generating local test credential.");
        const header = base64urlEncode(JSON.stringify({ alg: "RS256", kid: "test-kid" }));
        const payload = base64urlEncode(JSON.stringify({
          sub: "google-oauth2|100293810293810",
          email: "demo@skyluxe.com",
          name: "Alexander Vanderbilt",
          picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          email_verified: true,
          aud: GOOGLE_CLIENT_ID,
          iss: "https://accounts.google.com"
        }));
        const dummyToken = `${header}.${payload}.dummy_sig`;

        const res = await fetch("http://localhost:3001/api/v1/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: dummyToken }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Google sandbox authorization failed.");
        }
        const data = await res.json();
        login(data.access_token);
        router.push(redirectPath);
      }
    } catch (err: any) {
      setError(err.message || "Failed to coordinate Google Sign-In.");
      setIsLoadingGoogle(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoadingApple(true);
    setError("");
    try {
      if (typeof window !== "undefined" && (window as any).AppleID && APPLE_CLIENT_ID !== "com.skyluxe.services") {
        const AppleID = (window as any).AppleID;
        AppleID.auth.init({
          clientId: APPLE_CLIENT_ID,
          scope: 'name email',
          redirectURI: 'https://localhost:3000/auth/callback',
          state: 'origin:login',
          usePopup: true
        });

        const response = await AppleID.auth.signIn();
        const idToken = response.authorization.id_token;

        const res = await fetch("http://localhost:3001/api/v1/auth/apple", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Apple authentication verification failed.");
        }
        const data = await res.json();
        login(data.access_token);
        router.push(redirectPath);
      } else {
        // Offline sandbox credential generator
        console.log("Apple Sign-In client not loaded or using placeholder ID. Generating local test credential.");
        const header = base64urlEncode(JSON.stringify({ alg: "RS256", kid: "test-kid" }));
        const payload = base64urlEncode(JSON.stringify({
          sub: "apple-auth2|99882233445566",
          email: "demo@skyluxe.com",
          name: "Alexander Vanderbilt",
          email_verified: true,
          aud: APPLE_CLIENT_ID,
          iss: "https://appleid.apple.com"
        }));
        const dummyToken = `${header}.${payload}.dummy_sig`;

        const res = await fetch("http://localhost:3001/api/v1/auth/apple", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: dummyToken }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Apple sandbox authorization failed.");
        }
        const data = await res.json();
        login(data.access_token);
        router.push(redirectPath);
      }
    } catch (err: any) {
      setError(err.message || "Failed to coordinate Apple Sign-In.");
      setIsLoadingApple(false);
    }
  };


  return (
    <main className="relative min-h-screen bg-onyx flex overflow-hidden w-full">
      {/* Dynamic Scripts Loader */}
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
      <Script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" strategy="lazyOnload" />

      {/* Left Panel: Animated Branding */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-[#020202] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center opacity-[0.15]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-onyx" />

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 max-w-lg p-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs font-semibold tracking-wider uppercase">SkyLuxe OS</span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white mb-6">
            Secure Global <br />Access.
          </h1>
          <p className="text-platinum/60 text-lg font-light font-sans">
            Authenticate to manage your fleet, interact with your concierge, and coordinate your global travel network.
          </p>
        </motion.div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="flex-grow flex flex-col justify-center items-center relative z-10 p-6 lg:w-1/2">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-platinum/50 hover:text-white transition-colors text-sm font-light z-20">
          <ArrowLeft className="w-4 h-4" /> Back to Ecosystem
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

          <h2 className="text-3xl font-serif font-bold text-white mb-2 font-serif">Sign In</h2>
          <p className="text-platinum/50 font-light text-sm mb-6 font-sans">Access your flight command center.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-sans">
              {error}
            </div>
          )}

          {/* Social Sign-In Block */}
          <div className="space-y-3 mb-8">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle}
              className="w-full py-3.5 rounded-xl border border-white/10 hover:border-gold/40 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer disabled:opacity-75 font-sans"
            >
              {isLoadingGoogle ? (
                <Sparkles className="w-4 h-4 text-gold animate-spin-slow" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={isLoadingApple}
              className="w-full py-3.5 rounded-xl border border-white/10 hover:border-gold/40 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer disabled:opacity-75 font-sans"
            >
              {isLoadingApple ? (
                <Sparkles className="w-4 h-4 text-gold animate-spin-slow" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.09.09 2.22-.58 2.94-1.39z" />
                </svg>
              )}
              Continue with Apple
            </button>
          </div>

          <div className="relative mb-8 flex py-2 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-platinum/20 text-xs font-mono tracking-widest uppercase">Or email keys</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium font-sans">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-platinum/50 uppercase tracking-widest font-medium font-sans">Password</label>
                <Link href="/auth/recover" className="text-xs text-gold hover:text-gold-light transition-colors font-sans">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none font-sans"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 rounded-xl bg-white hover:bg-gold text-onyx font-bold text-lg transition-all duration-300 mt-4 flex items-center justify-center gap-2 group disabled:opacity-70 font-sans cursor-pointer">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 animate-spin-slow" /> Authenticating...
                </span>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Authenticate
                </>
              )}
            </button>
          </form>

          <p className="text-center text-platinum/40 text-sm mt-8 font-light font-sans">
            Don't have an account? <Link href="/auth/register" className="text-white hover:text-gold transition-colors font-medium">Request Access</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-onyx flex items-center justify-center text-white">Opening auth terminals...</div>}>
      <LoginContent />
    </Suspense>
  );
}
