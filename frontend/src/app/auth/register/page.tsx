"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Plane, User, Lock, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { login } = useAuth();

  // Registration Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [membershipInterest, setMembershipInterest] = useState("Ad-Hoc Charter Only");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!name || !email || !phone) {
        setError("Please fill in all primary details.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!password || !confirmPassword) {
        setError("Please enter and confirm your password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      setStep(3);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "Guest";
    const lastName = nameParts.slice(1).join(" ") || "User";

    try {
      // 1. Call Register endpoint
      const registerRes = await fetch("http://localhost:3001/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName
        }),
      });

      if (!registerRes.ok) {
        const err = await registerRes.json().catch(() => ({}));
        throw new Error(err.detail || "Registration failed. Email may already be registered.");
      }

      // 2. Call Login endpoint to acquire JWT
      const loginRes = await fetch("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const err = await loginRes.json().catch(() => ({}));
        throw new Error(err.detail || "Auto-login failed after registration.");
      }

      const loginData = await loginRes.json();
      login(loginData.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-onyx flex overflow-hidden">
      {/* Left Panel: Animated Branding */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-[#020202] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center opacity-[0.25] mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-onyx/80 to-onyx" />
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 max-w-lg p-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs font-semibold tracking-wider uppercase">Elite Access</span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white mb-6">
            Join the Global <br/><span className="text-gold">Inner Circle.</span>
          </h1>
          <p className="text-platinum/60 text-lg font-light leading-relaxed">
            Request an invitation to the world's most exclusive aviation network. Your application will be reviewed by our private wealth and aviation intelligence team.
          </p>

          <div className="mt-12 space-y-6">
            <Feature icon={ShieldCheck} text="Military-Grade Identity Encryption" />
            <Feature icon={Plane} text="Instant Access to 300+ Private Jets" />
            <Feature icon={Sparkles} text="24/7 Priority Cortex AI Concierge" />
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Multi-Step Onboarding Form */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 p-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] animate-pulse" />
        </div>

        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-platinum/50 hover:text-white transition-colors text-sm font-light z-20">
          <ArrowLeft className="w-4 h-4" /> Back to Ecosystem
        </Link>

        <div className="w-full max-w-md relative z-20">
          {/* Progress Indicators */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-white/10'}`} />
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-sans">
              {error}
            </div>
          )}

          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-fade-in"
          >
            {step === 1 && (
              <StepOne 
                name={name} setName={setName} 
                email={email} setEmail={setEmail} 
                phone={phone} setPhone={setPhone} 
                onNext={handleNext} 
              />
            )}
            {step === 2 && (
              <StepTwo 
                password={password} setPassword={setPassword} 
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} 
                onNext={handleNext} 
                onBack={() => setStep(1)} 
              />
            )}
            {step === 3 && (
              <StepThree 
                departureCity={departureCity} setDepartureCity={setDepartureCity}
                membershipInterest={membershipInterest} setMembershipInterest={setMembershipInterest}
                onComplete={handleComplete} 
                onBack={() => setStep(2)} 
                loading={loading}
              />
            )}
          </motion.div>
          
          {step === 1 && (
            <p className="text-center text-platinum/40 text-sm mt-8 font-light relative z-20">
              Already a member? <Link href="/auth/login" className="text-white hover:text-gold transition-colors font-medium">Sign In</Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

// Step 1: Primary Details
function StepOne({ name, setName, email, setEmail, phone, setPhone, onNext }: any) {
  return (
    <>
      <h2 className="text-3xl font-serif font-bold text-white mb-2">Primary Details</h2>
      <p className="text-platinum/50 font-light text-sm mb-10 font-sans">Establish your SkyLuxe identity.</p>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div>
          <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium font-sans">Full Legal Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Julian Sterling" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none font-sans" 
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium font-sans">Corporate Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="julian@company.com" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none font-sans" 
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium font-sans">Primary Contact Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
            <input 
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none font-sans" 
            />
          </div>
        </div>

        <button type="submit" className="w-full py-4 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-lg transition-all duration-300 mt-4 flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer font-sans">
          Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </>
  );
}

// Step 2: Security Setup
function StepTwo({ password, setPassword, confirmPassword, setConfirmPassword, onNext, onBack }: any) {
  return (
    <>
      <h2 className="text-3xl font-serif font-bold text-white mb-2">Security Setup</h2>
      <p className="text-platinum/50 font-light text-sm mb-10 font-sans">Configure your encryption keys.</p>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div>
          <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium font-sans">Create Password</label>
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
          <div className="flex gap-1 mt-3">
            <div className="h-1 flex-1 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
            <div className="h-1 flex-1 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
            <div className="h-1 flex-1 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
            <div className="h-1 flex-1 rounded-full bg-white/10" />
          </div>
          <p className="text-[10px] text-green-400 mt-1 uppercase tracking-widest font-sans">Strong Security</p>
        </div>

        <div>
          <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium font-sans">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none font-sans" 
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onBack} className="py-4 px-6 rounded-xl border border-white/10 text-white font-bold transition-all duration-300 hover:bg-white/5 cursor-pointer font-sans">
            Back
          </button>
          <button type="submit" className="flex-1 py-4 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer font-sans">
            Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </>
  );
}

// Step 3: Travel Preferences
function StepThree({ departureCity, setDepartureCity, membershipInterest, setMembershipInterest, onComplete, onBack, loading }: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <>
      <h2 className="text-3xl font-serif font-bold text-white mb-2">Travel Preferences</h2>
      <p className="text-platinum/50 font-light text-sm mb-10 font-sans">Tailor your aviation ecosystem.</p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium font-sans">Primary Departure City</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
            <input 
              type="text" 
              required
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              placeholder="e.g., New York, London, Dubai" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none font-sans" 
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium font-sans">Membership Interest</label>
          <select 
            value={membershipInterest}
            onChange={(e) => setMembershipInterest(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none appearance-none font-sans"
          >
            <option>Ad-Hoc Charter Only</option>
            <option>Executive Tier ($25k/yr)</option>
            <option>Signature Tier ($100k/yr)</option>
            <option>Founder's Club (Invite Only)</option>
          </select>
        </div>

        <div className="flex items-start gap-3 mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
          <input type="checkbox" className="mt-1 accent-gold w-4 h-4 cursor-pointer" required defaultChecked />
          <p className="text-xs text-platinum/60 font-light leading-relaxed font-sans">
            I agree to the <Link href="/terms" className="text-gold hover:underline">Terms of Service</Link>, <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>, and acknowledge the rigorous security vetting process.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onBack} disabled={loading} className="py-4 px-6 rounded-xl border border-white/10 text-white font-bold transition-all duration-300 hover:bg-white/5 disabled:opacity-50 cursor-pointer font-sans">
            Back
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-4 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-80 cursor-pointer font-sans">
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-spin-slow" /> Verifying...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Complete Registration <CheckCircle className="w-5 h-5" />
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  );
}

function Feature({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-4 font-sans">
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-gold" />
      </div>
      <p className="text-platinum/80 font-light">{text}</p>
    </div>
  );
}
