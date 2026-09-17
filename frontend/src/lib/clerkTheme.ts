import { dark } from "@clerk/themes";

export const skyluxeClerkAppearance = {
  baseTheme: dark,
  variables: {
    colorBackground: "#0c0c10",
    colorInputBackground: "#141419",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#a1a1aa",
    colorPrimary: "#D4AF37",
    colorTextOnPrimaryBackground: "#050505",
    colorDanger: "#f87171",
    colorSuccess: "#34d399",
    borderRadius: "1rem",
    fontFamily: '"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  elements: {
    // Main Sign In / Sign Up Cards
    card: "!bg-[#09090c]/95 !backdrop-blur-3xl !border !border-[#D4AF37]/30 !shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_45px_rgba(212,175,55,0.15)] rounded-[2rem] p-7 sm:p-10 max-w-[440px] w-full transition-all duration-300",
    rootBox: "w-full flex justify-center",
    headerTitle: "!text-white font-serif !text-2xl sm:!text-3xl font-bold tracking-tight !mb-1 text-center",
    headerSubtitle: "!text-zinc-400 text-xs font-light tracking-wide text-center",
    socialButtonsBlockButton: "!bg-[#141419] !border !border-white/10 hover:!border-[#D4AF37]/60 hover:!bg-[#1e1e26] !text-white rounded-xl transition-all duration-300 py-3.5 shadow-sm group",
    socialButtonsBlockButtonText: "!text-zinc-200 text-sm font-medium tracking-wide group-hover:!text-white",
    socialButtonsProviderIcon: "!w-4 !h-4 transition-transform group-hover:scale-110",
    dividerLine: "!bg-gradient-to-r !from-transparent !via-zinc-700 !to-transparent",
    dividerText: "!text-zinc-500 text-[10px] uppercase tracking-[0.25em] font-mono",
    formFieldLabel: "!text-zinc-300 text-xs font-mono uppercase tracking-wider mb-2",
    formFieldInput: "!bg-[#121216] !border !border-white/10 !text-white rounded-xl focus:!border-[#D4AF37] focus:!ring-2 focus:!ring-[#D4AF37]/30 transition-all text-sm py-3.5 px-4 placeholder:!text-zinc-600 shadow-inner",
    formButtonPrimary: "!bg-gradient-to-r !from-[#D4AF37] !via-[#E5C358] !to-[#F3E5AB] !text-black font-bold text-xs tracking-widest uppercase rounded-xl py-3.5 !shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:!shadow-[0_0_45px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 !border-0 cursor-pointer",
    footerActionLink: "!text-[#D4AF37] hover:!text-[#F3E5AB] font-semibold transition-colors ml-1.5 underline decoration-[#D4AF37]/40 hover:decoration-[#F3E5AB]",
    footerActionText: "!text-zinc-400 text-xs tracking-wide",
    footer: "!border-t !border-white/10 pt-5 mt-5",
    identityPreviewText: "!text-white font-medium",
    identityPreviewEditButton: "!text-[#D4AF37] hover:!text-[#F3E5AB] text-xs font-mono transition-colors",
    formFieldSuccessText: "!text-emerald-400 text-xs mt-1",
    formFieldErrorText: "!text-rose-400 text-xs mt-1 font-light",
    alertText: "!text-rose-200 text-xs font-light",
    alert: "!bg-rose-950/80 !border !border-rose-500/40 rounded-xl p-3.5",

    // UserButton Profile Dropdown Menu (Solid Obsidian Glass)
    userButtonPopoverRootBox: "!shadow-2xl z-50",
    userButtonPopoverCard: "!bg-[#0c0c10] !opacity-100 !border !border-[#D4AF37]/40 !shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(212,175,55,0.25)] rounded-2xl p-3 min-w-[280px]",
    userButtonPopoverMain: "!bg-[#0c0c10]",
    userButtonPopoverActions: "!bg-[#0c0c10] flex flex-col gap-1.5 py-1",
    userButtonPopoverActionButton: "!bg-[#141419] hover:!bg-[#D4AF37]/20 !text-white rounded-xl transition-all duration-200 py-3 px-3.5 border border-white/5 hover:border-[#D4AF37]/40 flex items-center gap-3",
    userButtonPopoverActionButtonText: "!text-white font-medium text-sm hover:!text-[#D4AF37]",
    userButtonPopoverActionButtonIcon: "!text-[#D4AF37] !w-4 !h-4",
    userButtonPopoverFooter: "!bg-[#07070a] !border-t !border-white/10 !p-3 !mt-2 rounded-b-xl",
    userPreview: "!bg-[#141419] !p-3.5 !rounded-xl !border !border-white/10 !mb-2",
    userPreviewMainIdentifier: "!text-white !font-bold !text-sm tracking-wide",
    userPreviewSecondaryIdentifier: "!text-[#D4AF37] !font-mono !text-xs",
    userPreviewAvatarContainer: "!border !border-[#D4AF37]/50 shadow-md",
  }
};

