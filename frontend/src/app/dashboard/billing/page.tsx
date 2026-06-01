"use client";

import { motion } from "framer-motion";
import { CreditCard, Wallet, ArrowUpRight, ArrowDownRight, FileText, Plus, Zap } from "lucide-react";

export default function Billing() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Wallet & Billing</h1>
          <p className="text-platinum/50 font-light text-sm">Manage payment methods, view transaction history, and fund your aviation wallet.</p>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-sm flex items-center gap-2">
          <DownloadIcon className="w-4 h-4" /> Download Statement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Wallet Balance & Cards */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Wallet Balance */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-3xl border border-gold/30 bg-gradient-to-br from-onyx to-onyx-light relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-platinum/60 mb-2">
                <Wallet className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-medium">Available Balance</span>
              </div>
              <h2 className="text-5xl font-bold text-white tracking-tight mb-6">$450,000<span className="text-xl text-platinum/40">.00</span></h2>
              
              <button className="w-full py-3 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] flex justify-center items-center gap-2">
                <Plus className="w-4 h-4" /> Add Funds
              </button>
            </div>
          </motion.div>

          {/* Saved Cards */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold text-white">Payment Methods</h3>
              <button className="text-gold text-xs font-medium hover:text-white transition-colors">Add New</button>
            </div>
            
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between group hover:border-gold/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-[#000000] rounded flex items-center justify-center relative overflow-hidden">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Apple Pay</p>
                    <p className="text-platinum/50 text-xs">Primary Default</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-gold flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-black/20 flex items-center justify-between group hover:border-white/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-[#1A1F71] rounded flex items-center justify-center relative overflow-hidden">
                    <span className="text-white text-[10px] font-bold italic">VISA</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">•••• 4242</p>
                    <p className="text-platinum/50 text-xs">Expires 12/28</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-white">Transaction History</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none">
                <option>All Transactions</option>
                <option>Charter Flights</option>
                <option>Membership Dues</option>
                <option>Wallet Funding</option>
              </select>
            </div>
            
            <div className="divide-y divide-white/5">
              <TransactionRow 
                title="Aircraft Charter: BOM - DWC" 
                date="Oct 05, 2026" 
                amount="-$51,500.00" 
                type="debit" 
                invoice="INV-2901"
              />
              <TransactionRow 
                title="Wallet Funding via Wire" 
                date="Sep 20, 2026" 
                amount="+$250,000.00" 
                type="credit" 
              />
              <TransactionRow 
                title="Signature Membership Renewal" 
                date="Jan 01, 2026" 
                amount="-$100,000.00" 
                type="debit" 
                invoice="INV-1002"
              />
              <TransactionRow 
                title="Catering Surcharge (BOM-DEL)" 
                date="Sep 28, 2026" 
                amount="-$1,250.00" 
                type="debit" 
                invoice="INV-2844"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function TransactionRow({ title, date, amount, type, invoice }: any) {
  const isCredit = type === "credit";
  return (
    <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-platinum'}`}>
          {isCredit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-white font-medium">{title}</p>
          <p className="text-platinum/50 text-xs">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className={`font-bold ${isCredit ? 'text-green-400' : 'text-white'}`}>{amount}</span>
        {invoice ? (
          <button className="flex items-center gap-2 text-platinum/50 hover:text-gold transition-colors text-xs font-medium border border-white/10 px-3 py-1.5 rounded-lg bg-white/5">
            <FileText className="w-3 h-3" /> {invoice}
          </button>
        ) : (
          <div className="w-24" /> // placeholder for alignment
        )}
      </div>
    </div>
  );
}

function DownloadIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
  );
}
